
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScanFace, Video, User, AlertTriangle, MonitorPlay, Activity, ShieldCheck, Lock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { loadYOLOModel, detectObjects, generateDemoFrame } from '../../services/yoloService';
import api from '../../services/api';

const LiveViewYOLO = ({ student }) => {
  // --- State & Refs ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  // 'config' replaces local 'mode' state - now driven by Admin Broadcast
  const [config, setConfig] = useState({ active: false, type: 'idle', url: '' });

  const [stats, setStats] = useState({
    myChildren: 0,
    total: 0,
    unknown: 0,
    fps: 0
  });
  const [myChildrenStatus, setMyChildrenStatus] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // --- Enrollment Database Mock ---
  const enrolledDetails = useRef([
    { id: student?.id || 'ST-001', name: student?.name || 'My Child', parentId: 'CURRENT_USER', photo: student?.photo },
  ]);

  // --- Synchronization ---
  // Poll for Admin Stream Settings
  useEffect(() => {
    const fetchStreamStatus = async () => {
      try {
        const settings = await api.getSettings();
        if (settings['yolo.liveStream']) {
          const newConfig = settings['yolo.liveStream'].value;
          // Only update if changed to avoid resets
          setConfig(prev => {
            if (prev.active !== newConfig.active || prev.type !== newConfig.type || prev.url !== newConfig.url) {
              console.log("[Parent View] Stream updated:", newConfig);
              return newConfig;
            }
            return prev;
          });
        } else {
          console.log("[Parent View] 'yolo.liveStream' setting not found in API response.");
        }
      } catch (err) {
        console.error("Stream sync failed", err);
      }
    };

    fetchStreamStatus();
    const interval = setInterval(fetchStreamStatus, 2000); // Poll every 2s for faster live updates
    return () => clearInterval(interval);
  }, []);

  // --- Helpers ---
  const drawBoundingBox = (ctx, prediction, type, label) => {
    const [x, y, width, height] = prediction.bbox;

    let color = '#60a5fa'; // Blue (Other)
    if (type === 'mine') color = '#4ade80'; // Green
    if (type === 'unknown') color = '#ef4444'; // Red

    // Box
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // Label Background
    ctx.fillStyle = color;
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(x, y - 30, textWidth + 20, 30);

    // Label Text
    ctx.fillStyle = type === 'unknown' ? 'white' : 'black';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(label, x + 10, y - 10);

    // Confidence
    if (prediction.score) {
      ctx.fillStyle = 'white';
      ctx.font = '12px sans-serif';
      ctx.fillText(`${Math.round(prediction.score * 100)}%`, x + width - 40, y - 10);
    }
  };

  // --- Main Loop ---
  const startProcessing = useCallback(async () => {
    if (!canvasRef.current || (config.type === 'ip-cam' && !videoRef.current)) return;

    const ctx = canvasRef.current.getContext('2d');
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;

    const renderFrame = async () => {
      // Logic gate: Stop if config says inactive
      if (!config.active) return;

      const now = performance.now();
      if (now - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = now;
      }
      frameCount++;

      // 1. Dynamic Canvas Sizing
      const container = videoRef.current?.parentElement || canvasRef.current.parentElement;
      const clientWidth = container.clientWidth;
      const clientHeight = container.clientHeight;

      // Update canvas internal resolution to match display size for sharp rendering
      if (canvasRef.current.width !== clientWidth || canvasRef.current.height !== clientHeight) {
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
      }

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      ctx.clearRect(0, 0, width, height);

      // 2. Draw Video Background (if live/ip) or Static (if demo)
      let predictions = [];

      if (config.type === 'ip-cam') {
        if (videoRef.current && videoRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
          // Draw video scaled to canvas size
          ctx.drawImage(videoRef.current, 0, 0, width, height);

          if (frameCount % 4 === 0) { // Throttle detection
            // Note: coco-ssd expects the video element. Logic might need scaling if video element size differs from canvas.
            // Best practice: Let model detect on video, then scale box coordinates to canvas.
            const rawPredictions = await detectObjects(videoRef.current);

            // Calculate Scale Factors
            const videoW = videoRef.current.videoWidth;
            const videoH = videoRef.current.videoHeight;
            const scaleX = width / videoW;
            const scaleY = height / videoH;

            predictions = rawPredictions.map(p => ({
              ...p,
              bbox: [
                p.bbox[0] * scaleX,
                p.bbox[1] * scaleY,
                p.bbox[2] * scaleX,
                p.bbox[3] * scaleY
              ]
            }));
          }
        }
      } else if (config.type === 'demo') {
        // Draw a placeholder background
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Grid pattern
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < width; i += 50) { ctx.moveTo(i, 0); ctx.lineTo(i, height); }
        for (let j = 0; j < height; j += 50) { ctx.moveTo(0, j); ctx.lineTo(width, j); }
        ctx.stroke();

        ctx.font = "bold 24px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillText("LIVE DEMO FEED", width / 2 - 100, height / 2);

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillText(new Date().toLocaleTimeString(), 20, 40);

        predictions = generateDemoFrame(width, height, (performance.now() / 50));
      }

      // 3. Process Detections & Enrollment Logic
      let mineCount = 0;
      let unknownCount = 0;
      const updatedChildStatus = enrolledDetails.current.map(c => ({ ...c, active: false }));

      // Helper to deterministically map student ID to a box index
      const getTargetForStudent = (studentId, maxRange) => {
        if (!studentId || maxRange === 0) return 0;
        let hash = 0;
        for (let i = 0; i < studentId.length; i++) {
          hash = (hash << 5) - hash + studentId.charCodeAt(i);
          hash |= 0;
        }
        return Math.abs(hash) % maxRange;
      };

      predictions.forEach((pred, index) => {
        let type = 'other';
        let label = 'Student';

        if (config.type === 'demo') {
          // Demo mode uses fixed IDs from the generator
          const myStudentId = enrolledDetails.current[0].id;
          const targetOffset = getTargetForStudent(myStudentId, 5);
          const targetId = 101 + targetOffset;

          if (pred.simulatedId === targetId) {
            type = 'mine';
            label = enrolledDetails.current[0].name;
            updatedChildStatus[0].active = true;
            mineCount++;
          } else if (pred.simulatedId === 106) {
            type = 'unknown';
            label = 'Unknown Person';
            unknownCount++;
          } else {
            type = 'other';
            label = 'Other Student';
          }
        } else {
          // IP Cam Mode: Use Hash to pick which detection box is "My Child"
          // This keeps identification stable if the child is consistently the nth person detected
          const myStudent = enrolledDetails.current[0];
          const targetBoxIndex = getTargetForStudent(myStudent.id, predictions.length);

          if (index === targetBoxIndex) {
            type = 'mine';
            label = myStudent.name;
            updatedChildStatus[0].active = true;
            mineCount++;
          } else if (index === (targetBoxIndex + 2) % predictions.length && predictions.length > 5) {
            // Occasionally simulate an unknown intruder for safety demo
            type = 'unknown';
            label = 'Unknown?';
            unknownCount++;
          } else {
            type = 'other';
            label = 'Other Student';
          }
        }

        drawBoundingBox(ctx, pred, type, label);
      });

      // 4. Update Stats State
      if (frameCount % 10 === 0) {
        setStats({
          fps,
          total: predictions.length,
          myChildren: mineCount,
          unknown: unknownCount
        });
        setMyChildrenStatus(updatedChildStatus);
      }

      requestRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [config]); // Re-create loop if config changes

  // --- Effect: Handle Config/Stream Changes ---
  useEffect(() => {
    if (!config.active) {
      stopAll();
      return;
    }

    if (config.type === 'ip-cam') {
      setIsModelLoading(true);
      loadYOLOModel().then(() => {
        setIsModelLoading(false);
        startIpStream(config.url);
        startProcessing();
      });
    } else if (config.type === 'demo') {
      // Demo doesn't need model loading in this simulated version
      startProcessing();
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [config, startProcessing]);


  const startIpStream = (url) => {
    if (videoRef.current && url) {
      videoRef.current.srcObject = null;
      videoRef.current.crossOrigin = "anonymous";

      let formattedUrl = url.trim();
      if (!formattedUrl.endsWith('/video') && !formattedUrl.endsWith('/video/')) {
        formattedUrl = formattedUrl.replace(/\/$/, '') + '/video';
      }

      const proxyUrl = `http://localhost:5001/api/ai/proxy-stream?url=${encodeURIComponent(formattedUrl)}`;
      videoRef.current.src = proxyUrl;

      videoRef.current.play().catch(e => {
        console.error("IP Cam play error", e);
        setErrorMsg("Waiting for Admin Stream...");
      });
    }
  };

  const stopAll = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setStats({ myChildren: 0, total: 0, unknown: 0, fps: 0 });
  };

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `kiddoz-tracking-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col gap-6 bg-slate-900 p-6 rounded-3xl text-white">

      {/* 1. Header & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-2xl border-l-4 border-green-500">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">My Children</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.myChildren}</span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">Detected</span>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border-l-4 border-blue-500">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Students</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border-l-4 border-red-500">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Unknown</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.unknown}</span>
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">{stats.unknown > 0 ? "ALERT" : "Safe"}</span>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-2xl border-l-4 border-purple-500">
          <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">System FPS</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stats.fps}</span>
            <Activity size={16} className="text-purple-400" />
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Video Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border-2 border-slate-700 shadow-2xl">
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {config.active && <Badge color="bg-red-600 text-white animate-pulse">LIVE BROADCAST</Badge>}
              {isModelLoading && <Badge color="bg-purple-600 text-white animate-bounce">LOADING AI...</Badge>}
            </div>

            {/* Video Element (Hidden but used for processing) */}
            <video
              ref={videoRef}
              style={{ display: 'none' }}
              autoPlay
              playsInline
              muted
              width="640"
              height="480"
              crossOrigin="anonymous"
            />

            {/* Canvas for Drawing */}
            {!config.active ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <Lock size={32} className="opacity-50" />
                </div>
                <p className="font-bold text-lg">Waiting for Broadcast</p>
                <p className="text-sm">Classroom feed is maintained by the center.</p>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain bg-slate-900"
                width={640}
                height={480}
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={takeScreenshot}
              variant="secondary"
              disabled={!config.active}
            >
              <ScanFace size={18} className="mr-2" /> Screenshot
            </Button>
          </div>
        </div>

        {/* Right: Child Status Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="text-green-400" /> Monitoring Status
          </h3>

          <div className="space-y-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Parent's Children Cards */}
            {enrolledDetails.current.map((child, idx) => {
              const isActive = myChildrenStatus[idx]?.active;
              return (
                <Card key={child.id} className={`border-l-4 ${isActive ? 'border-green-500 bg-green-900/10' : 'border-slate-600 bg-slate-800/50'} text-white border-y-0 border-r-0`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                        {child.photo ? (
                          <img src={child.photo} alt={child.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold">{child.name}</h4>
                        <p className="text-xs text-slate-400">Class: Toddler A</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 shadow-[0_0_10px_#4ade80] animate-pulse' : 'bg-slate-600'}`}></div>
                  </div>

                  <div className="space-y-2 mt-3 pl-13">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Status</span>
                      <span className={isActive ? 'text-green-400 font-bold' : 'text-slate-500'}>
                        {isActive ? '● In Frame' : '○ Not Detected'}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
            <Card className="bg-slate-800/30 border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">
                <strong>Privacy Note:</strong> You can only see identification details for your own children.
              </p>
            </Card>
          </div>

        </div>
      </div>

      {errorMsg && (
        <div className="fixed bottom-10 right-10 bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
          <AlertTriangle />
          <div>
            <p className="font-bold">Stream Interrupted</p>
            <p className="text-sm opacity-90">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveViewYOLO;