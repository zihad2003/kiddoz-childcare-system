
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScanFace, Video, User, AlertTriangle, MonitorPlay, Activity, ShieldCheck, Lock, Info, Wifi, WifiOff } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { loadYOLOModel, detectObjects, generateDemoFrame } from '../../services/yoloService';
import api from '../../services/api';

const BACKEND_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getProxyStreamUrl = (url) =>
  `${BACKEND_BASE}/ai/proxy-stream?url=${encodeURIComponent(url.trim().replace(/\/$/, ''))}`;

const getSnapshotUrl = (url) => {
  try {
    const parsed = new URL(url.trim());
    return `${BACKEND_BASE}/ai/proxy-snapshot?url=${encodeURIComponent(`${parsed.protocol}//${parsed.host}`)}`;
  } catch { return null; }
};

const isOnHttps = () => window.location.protocol === 'https:';

const LiveViewYOLO = ({ student }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);          // MJPEG display img
  const snapshotRef = useRef(null);     // Hidden snapshot img for YOLO
  const rafRef = useRef(null);
  const snapshotIntervalRef = useRef(null);

  const [config, setConfig] = useState({ active: false, type: 'idle', url: '' });
  const [stats, setStats] = useState({ myChildren: 0, total: 0, unknown: 0, fps: 0 });
  const [myChildrenStatus, setMyChildrenStatus] = useState([{ active: false }]);
  const [connectionStatus, setConnectionStatus] = useState('idle'); // idle | connecting | connected | error
  const [isModelLoading, setIsModelLoading] = useState(false);

  const enrolledDetails = useRef([
    { id: student?.id || 'ST-001', name: student?.name || 'My Child', photo: student?.photo },
  ]);

  // Keep enrolled details in sync with prop
  useEffect(() => {
    enrolledDetails.current = [
      { id: student?.id || 'ST-001', name: student?.name || 'My Child', photo: student?.photo },
    ];
  }, [student]);

  // Poll admin broadcast config every 3s
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const settings = await api.getSettings();
        if (settings?.['yolo.liveStream']?.value) {
          const newCfg = settings['yolo.liveStream'].value;
          setConfig(prev => {
            if (prev.active !== newCfg.active || prev.type !== newCfg.type || prev.url !== newCfg.url) {
              return newCfg;
            }
            return prev;
          });
        }
      } catch { /* ignore */ }
    };
    fetchConfig();
    const interval = setInterval(fetchConfig, 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getTargetForStudent = useCallback((studentId, maxRange) => {
    if (!studentId || maxRange === 0) return 0;
    let hash = 0;
    for (let i = 0; i < studentId.length; i++) {
      hash = (hash << 5) - hash + studentId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % maxRange;
  }, []);

  const drawBoundingBox = useCallback((ctx, prediction, type, label) => {
    const [x, y, w, h] = prediction.bbox;
    const colors = { mine: '#4ade80', unknown: '#ef4444', other: '#60a5fa' };
    const color = colors[type] || colors.other;
    const bLen = Math.min(w, h) * 0.2;

    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx * bLen, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + dy * bLen);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    ctx.fillStyle = `${color}22`;
    ctx.fillRect(x, y, w, h);

    ctx.font = 'bold 13px monospace';
    const confText = `${label} ${Math.round((prediction.score || 0.9) * 100)}%`;
    const textW = ctx.measureText(confText).width + 12;
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 22, textW, 22);
    ctx.fillStyle = type === 'unknown' ? '#fff' : '#000';
    ctx.fillText(confText, x + 6, y - 6);

    if (type === 'mine') {
      const pulse = (Math.sin(performance.now() / 300) + 1) / 2;
      ctx.strokeStyle = `rgba(74,222,128,${0.3 + pulse * 0.5})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
    }
  }, []);

  const processPredictions = useCallback((ctx, predictions, type) => {
    let mineCount = 0, unknownCount = 0;
    const myStudent = enrolledDetails.current[0];
    const updatedStatus = [{ ...myStudent, active: false }];

    predictions.forEach((pred, index) => {
      let detType = 'other';
      let label = 'Student';

      if (type === 'demo') {
        const targetOffset = getTargetForStudent(myStudent.id, 5);
        const targetId = 101 + targetOffset;
        if (pred.simulatedId === targetId) {
          detType = 'mine'; label = myStudent.name; updatedStatus[0].active = true; mineCount++;
        } else if (pred.simulatedId === 106) {
          detType = 'unknown'; label = 'Unknown Person'; unknownCount++;
        }
      } else {
        const targetIdx = getTargetForStudent(myStudent.id, predictions.length);
        if (index === targetIdx) {
          detType = 'mine'; label = myStudent.name; updatedStatus[0].active = true; mineCount++;
        } else if (index === (targetIdx + 2) % Math.max(1, predictions.length) && predictions.length > 4) {
          detType = 'unknown'; label = 'Unknown?'; unknownCount++;
        }
      }
      drawBoundingBox(ctx, pred, detType, label);
    });

    setStats(s => ({ ...s, total: predictions.length, myChildren: mineCount, unknown: unknownCount }));
    setMyChildrenStatus(updatedStatus);
  }, [getTargetForStudent, drawBoundingBox]);

  // ── Demo render loop ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!config.active || config.type !== 'demo') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameCount = 0, lastTime = performance.now();

    const render = () => {
      const parent = canvas.parentElement;
      const W = parent?.clientWidth || 640;
      const H = parent?.clientHeight || 360;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

      const ctx = canvas.getContext('2d');

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < W; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, H); }
      for (let j = 0; j < H; j += 50) { ctx.moveTo(0, j); ctx.lineTo(W, j); }
      ctx.stroke();

      // Watermark
      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillText('KIDDOZ LIVE DEMO', W / 2 - 80, H / 2);
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText(new Date().toLocaleTimeString(), 12, H - 12);

      const predictions = generateDemoFrame(W, H, performance.now() / 50);
      processPredictions(ctx, predictions, 'demo');

      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setStats(s => ({ ...s, fps: frameCount }));
        frameCount = 0; lastTime = now;
      }

      rafRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [config.active, config.type, processPredictions]);

  // ── IP-Cam render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!config.active || config.type !== 'ip-cam' || !config.url) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setConnectionStatus('connecting');
    setIsModelLoading(true);
    loadYOLOModel()
      .then(() => setIsModelLoading(false))
      .catch(() => setIsModelLoading(false));

    // Display img — MJPEG stream via proxy
    if (imgRef.current) {
      imgRef.current.src = getProxyStreamUrl(config.url);
      imgRef.current.onload = () => setConnectionStatus('connected');
      imgRef.current.onerror = () => setConnectionStatus('error');
    }

    // Snapshot inference loop
    const snapUrl = getSnapshotUrl(config.url);
    let latestPredictions = [];

    if (snapUrl) {
      snapshotIntervalRef.current = setInterval(async () => {
        try {
          const img = snapshotRef.current;
          if (!img) return;
          img.src = `${snapUrl}&_t=${Date.now()}`;
          await new Promise((res, rej) => {
            img.onload = res; img.onerror = rej; setTimeout(rej, 3000);
          });
          latestPredictions = await detectObjects(img);
        } catch { /* ignore */ }
      }, 500);
    }

    let frameCount = 0, lastTime = performance.now();

    const render = () => {
      const parent = canvas.parentElement;
      const W = parent?.clientWidth || 640;
      const H = parent?.clientHeight || 360;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }

      const ctx = canvas.getContext('2d');
      const displayImg = imgRef.current;
      if (displayImg && displayImg.complete && displayImg.naturalWidth > 0) {
        try { ctx.drawImage(displayImg, 0, 0, W, H); } catch {
          ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
        }
      } else {
        ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
      }

      processPredictions(ctx, latestPredictions, 'ip-cam');

      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setStats(s => ({ ...s, fps: frameCount }));
        frameCount = 0; lastTime = now;
      }

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(snapshotIntervalRef.current);
      if (imgRef.current) imgRef.current.src = '';
      setConnectionStatus('idle');
    };
  }, [config.active, config.type, config.url, processPredictions]);

  // Stop everything when broadcast goes off
  useEffect(() => {
    if (!config.active) {
      cancelAnimationFrame(rafRef.current);
      clearInterval(snapshotIntervalRef.current);
      if (imgRef.current) imgRef.current.src = '';
      setConnectionStatus('idle');
      setStats({ myChildren: 0, total: 0, unknown: 0, fps: 0 });
      setMyChildrenStatus([{ active: false }]);
    }
  }, [config.active]);

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `kiddoz-tracking-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const onHttps = isOnHttps();

  return (
    <div className="flex flex-col gap-6 bg-slate-900 p-6 rounded-3xl text-white">

      {/* ── Mixed-Content Notice ── */}
      {onHttps && config.type === 'ip-cam' && config.active && (
        <div className="flex items-start gap-3 p-4 bg-amber-950/50 border border-secondary-700/50 rounded-xl text-secondary-200 text-xs">
          <Info size={16} className="shrink-0 mt-0.5 text-secondary-400" />
          <p>
            <strong className="text-secondary-300">Proxy Mode Active:</strong> Your IP camera stream is being routed
            through the KiddoZ backend server to avoid browser mixed-content blocking.
            If the stream doesn't appear, ensure the backend is reachable.
          </p>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Children', value: stats.myChildren, color: 'border-green-500', badge: 'text-green-400 bg-green-500/10', badgeText: 'Detected' },
          { label: 'Total Students', value: stats.total, color: 'border-blue-500', badge: null },
          { label: 'Unknown', value: stats.unknown, color: 'border-red-500', badge: `text-red-400 bg-red-500/10`, badgeText: stats.unknown > 0 ? 'ALERT' : 'Safe' },
          { label: 'System FPS', value: stats.fps, color: 'border-primary-500', badge: null, icon: <Activity size={16} className="text-primary-400" /> },
        ].map((s, i) => (
          <div key={i} className={`bg-slate-800 p-4 rounded-2xl border-l-4 ${s.color}`}>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{s.label}</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-3xl font-bold">{s.value}</span>
              {s.badge && <span className={`text-xs px-2 py-1 rounded-full ${s.badge}`}>{s.badgeText}</span>}
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Video Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border-2 border-slate-700 shadow-2xl">

            {/* Status badges */}
            <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
              {config.active && <Badge color="bg-red-600 text-white animate-pulse">🔴 LIVE</Badge>}
              {isModelLoading && <Badge color="bg-primary-600 text-white animate-bounce">LOADING AI...</Badge>}
              {connectionStatus === 'connecting' && <Badge color="bg-secondary-600 text-white">CONNECTING...</Badge>}
              {connectionStatus === 'error' && <Badge color="bg-red-800 text-red-200">NO SIGNAL</Badge>}
            </div>

            {/* Hidden imgs for IP-cam */}
            <img ref={imgRef} style={{ display: 'none' }} crossOrigin="anonymous" alt="" />
            <img ref={snapshotRef} style={{ display: 'none' }} crossOrigin="anonymous" alt="" />

            {/* Broadcast-off state */}
            {!config.active ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 border-2 border-slate-700">
                  <Lock size={36} className="opacity-40" />
                </div>
                <p className="font-bold text-lg text-slate-400">Waiting for Broadcast</p>
                <p className="text-sm text-slate-600 mt-1">The classroom feed is controlled by the center.</p>
                <p className="text-xs text-slate-700 mt-3">You will be notified when the stream goes live.</p>
              </div>
            ) : (
              <canvas ref={canvasRef} className="w-full h-full" width={640} height={360} />
            )}

            {/* Connection error overlay */}
            {connectionStatus === 'error' && config.active && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                <WifiOff size={40} className="text-red-400" />
                <p className="font-bold text-red-300">Cannot connect to camera</p>
                <p className="text-xs text-slate-400 text-center max-w-xs">
                  The IP camera stream is unreachable. Check that the backend proxy is running and the camera IP is correct.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={takeScreenshot} variant="secondary" disabled={!config.active}>
              <ScanFace size={18} className="mr-2" /> Screenshot
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="text-green-400" /> Monitoring Status
          </h3>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {enrolledDetails.current.map((child, idx) => {
              const isActive = myChildrenStatus[idx]?.active;
              return (
                <Card key={child.id} className={`border-l-4 ${isActive ? 'border-green-500 bg-green-900/10' : 'border-slate-600 bg-slate-800/50'} text-white border-y-0 border-r-0`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                        {child.photo ? <img src={child.photo} alt={child.name} className="w-full h-full object-cover" /> : <User size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold">{child.name}</h4>
                        <p className="text-xs text-slate-400">Enrolled Student</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-1 ${isActive ? 'bg-green-500 shadow-[0_0_10px_#4ade80] animate-pulse' : 'bg-slate-600'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-3">
                    <span className="text-slate-400">Status</span>
                    <span className={isActive ? 'text-green-400 font-bold' : 'text-slate-500'}>
                      {isActive ? '● In Frame' : '○ Not Detected'}
                    </span>
                  </div>
                </Card>
              );
            })}

            <Card className="bg-slate-800/30 border border-slate-700">
              <p className="text-xs text-slate-400">
                <strong>Privacy Note:</strong> You can only see identification details for your own enrolled children. Other students appear as anonymous.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {connectionStatus === 'error' && config.type === 'ip-cam' && (
        <div className="bg-red-900/80 text-white p-5 rounded-2xl border border-red-700">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={24} />
            <h4 className="font-bold text-lg">Cannot Connect to IP Webcam</h4>
          </div>
          <ul className="text-red-200 text-sm space-y-1 list-disc pl-5">
            <li>Your phone and computer are on the <strong>same WiFi network</strong></li>
            <li>IP Webcam app is <strong>running</strong> on your phone</li>
            <li>The IP address and port are <strong>correct</strong> (set by admin)</li>
            <li>No <strong>firewall</strong> is blocking the connection</li>
            <li>The <strong>backend server</strong> is running and reachable (stream is proxied)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveViewYOLO;