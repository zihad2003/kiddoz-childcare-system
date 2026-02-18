import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Video, Globe, Save, MonitorPlay, Users, Search, ScanFace,
    ChevronRight, Wifi, WifiOff, AlertTriangle, Shield, Eye,
    Camera, Activity, Clock, Zap, RefreshCw, Maximize2, X,
    CheckCircle, Radio, Lock, Unlock
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { generateDemoFrame } from '../../services/yoloService';

// ─── Camera Feed Component ─────────────────────────────────────────────────────
const CameraFeed = ({ camId, label, isActive, selectedStudent, students, isFullscreen, onFullscreen }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [fps, setFps] = useState(0);
    const [detectionCount, setDetectionCount] = useState(0);
    const [hasUnknown, setHasUnknown] = useState(false);
    const fpsRef = useRef({ frames: 0, last: performance.now() });

    const getTargetForStudent = useCallback((studentId, maxRange) => {
        if (!studentId || maxRange === 0) return -1;
        let hash = 0;
        for (let i = 0; i < studentId.length; i++) {
            hash = studentId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % maxRange;
    }, []);

    const drawScene = useCallback((ctx, width, height, frameTime) => {
        // Background: dark room gradient
        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#0d1117');
        bg.addColorStop(1, '#161b22');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Perspective floor grid
        ctx.strokeStyle = 'rgba(30, 215, 96, 0.08)';
        ctx.lineWidth = 0.5;
        const vanishX = width / 2;
        const vanishY = height * 0.45;
        for (let i = -8; i <= 8; i++) {
            const startX = vanishX + i * (width / 8);
            ctx.beginPath();
            ctx.moveTo(vanishX + i * 20, vanishY);
            ctx.lineTo(startX, height);
            ctx.stroke();
        }
        for (let j = 0; j <= 6; j++) {
            const t = j / 6;
            const y = vanishY + (height - vanishY) * (t * t);
            const xSpread = (width * 0.5) * t;
            ctx.beginPath();
            ctx.moveTo(vanishX - xSpread, y);
            ctx.lineTo(vanishX + xSpread, y);
            ctx.stroke();
        }

        // Scanline effect
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 2);
        }

        // Camera ID watermark
        ctx.font = `bold ${Math.max(10, width * 0.025)}px monospace`;
        ctx.fillStyle = 'rgba(30, 215, 96, 0.3)';
        ctx.fillText(`CAM-${camId.toString().padStart(2, '0')}`, 12, height - 12);

        // Timestamp
        const now = new Date();
        const ts = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        ctx.font = `${Math.max(9, width * 0.022)}px monospace`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(ts, width - ctx.measureText(ts).width - 10, height - 12);
    }, [camId]);

    const drawPerson = useCallback((ctx, pred, type, label, width, height) => {
        const [x, y, w, h] = pred.bbox;
        const confidence = pred.score;

        // Color by type
        const colors = {
            mine: { stroke: '#1ed760', fill: 'rgba(30, 215, 96, 0.15)', text: '#000', badge: '#1ed760' },
            unknown: { stroke: '#ff4444', fill: 'rgba(255, 68, 68, 0.15)', text: '#fff', badge: '#ff4444' },
            other: { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)', text: '#fff', badge: '#3b82f6' },
        };
        const c = colors[type] || colors.other;

        // Animated corner brackets
        const bLen = Math.min(w, h) * 0.2;
        ctx.strokeStyle = c.stroke;
        ctx.lineWidth = 2;
        ctx.shadowColor = c.stroke;
        ctx.shadowBlur = 8;

        // TL
        ctx.beginPath(); ctx.moveTo(x, y + bLen); ctx.lineTo(x, y); ctx.lineTo(x + bLen, y); ctx.stroke();
        // TR
        ctx.beginPath(); ctx.moveTo(x + w - bLen, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + bLen); ctx.stroke();
        // BL
        ctx.beginPath(); ctx.moveTo(x, y + h - bLen); ctx.lineTo(x, y + h); ctx.lineTo(x + bLen, y + h); ctx.stroke();
        // BR
        ctx.beginPath(); ctx.moveTo(x + w - bLen, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - bLen); ctx.stroke();

        ctx.shadowBlur = 0;

        // Fill overlay
        ctx.fillStyle = c.fill;
        ctx.fillRect(x, y, w, h);

        // Label badge
        const badgeH = Math.max(18, h * 0.12);
        const fontSize = Math.max(9, badgeH * 0.55);
        ctx.font = `bold ${fontSize}px monospace`;
        const confText = `${label} ${Math.round(confidence * 100)}%`;
        const textW = ctx.measureText(confText).width + 10;

        ctx.fillStyle = c.badge;
        ctx.fillRect(x, y - badgeH - 2, textW, badgeH);

        ctx.fillStyle = type === 'unknown' ? '#fff' : '#000';
        ctx.fillText(confText, x + 5, y - badgeH / 2 - 2 + fontSize / 2);

        // Pulse ring for tracked student
        if (type === 'mine') {
            const pulse = (Math.sin(performance.now() / 300) + 1) / 2;
            ctx.strokeStyle = `rgba(30, 215, 96, ${0.3 + pulse * 0.5})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;
        let unknownDetected = false;

        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const parent = canvas.parentElement;
            const W = parent?.clientWidth || 640;
            const H = parent?.clientHeight || 360;
            if (canvas.width !== W || canvas.height !== H) {
                canvas.width = W;
                canvas.height = H;
            }

            const ctx = canvas.getContext('2d');
            const frameTime = performance.now();

            drawScene(ctx, W, H, frameTime);

            // Generate detections offset per camera
            const offset = (camId - 1) * 1.5;
            const predictions = generateDemoFrame(W, H, frameTime / 50 + offset);

            let count = 0;
            unknownDetected = false;

            predictions.forEach((pred, idx) => {
                let type = 'other';
                let label = `P-${(idx + 1).toString().padStart(2, '0')}`;

                if (selectedStudent) {
                    const targetOffset = getTargetForStudent(selectedStudent.id, 5);
                    const targetId = 101 + targetOffset;
                    if (pred.simulatedId === targetId) {
                        type = 'mine';
                        label = selectedStudent.name.split(' ')[0];
                    } else if (pred.simulatedId === 106) {
                        type = 'unknown';
                        label = 'UNKNOWN';
                        unknownDetected = true;
                    }
                } else if (pred.simulatedId === 106) {
                    type = 'unknown';
                    label = 'UNKNOWN';
                    unknownDetected = true;
                }

                drawPerson(ctx, pred, type, label, W, H);
                count++;
            });

            setDetectionCount(count);
            setHasUnknown(unknownDetected);

            // FPS
            fpsRef.current.frames++;
            const elapsed = frameTime - fpsRef.current.last;
            if (elapsed >= 1000) {
                setFps(Math.round((fpsRef.current.frames * 1000) / elapsed));
                fpsRef.current = { frames: 0, last: frameTime };
            }

            requestRef.current = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(requestRef.current);
    }, [selectedStudent, camId, drawScene, drawPerson, getTargetForStudent]);

    return (
        <div
            className={`relative bg-black rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group
                ${hasUnknown ? 'border-red-500 shadow-lg shadow-red-500/30' : isActive ? 'border-green-500/60' : 'border-slate-700 hover:border-slate-500'}`}
            style={{ aspectRatio: '16/9' }}
            onClick={() => onFullscreen(camId)}
        >
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Top HUD */}
            <div className="absolute top-0 inset-x-0 p-2 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                    <span className="text-[10px] font-bold text-white/80 font-mono">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    {hasUnknown && (
                        <span className="text-[9px] font-black text-red-400 bg-red-900/80 px-1.5 py-0.5 rounded animate-pulse">
                            ⚠ UNKNOWN
                        </span>
                    )}
                    <span className="text-[9px] text-green-400/70 font-mono">{fps}fps</span>
                    <span className="text-[9px] text-blue-400/70 font-mono">{detectionCount} det</span>
                </div>
            </div>

            {/* Fullscreen icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 rounded-full p-2">
                    <Maximize2 size={16} className="text-white" />
                </div>
            </div>
        </div>
    );
};

// ─── Detection Event Log ───────────────────────────────────────────────────────
const DetectionLog = ({ events }) => (
    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
        {events.length === 0 && (
            <p className="text-slate-500 text-xs text-center py-6">No events recorded yet.</p>
        )}
        {events.map((ev, i) => (
            <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs
                ${ev.type === 'unknown' ? 'bg-red-950/40 border-red-800/50 text-red-300' :
                    ev.type === 'detected' ? 'bg-green-950/40 border-green-800/50 text-green-300' :
                        'bg-slate-800/50 border-slate-700/50 text-slate-400'}`}>
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                    ${ev.type === 'unknown' ? 'bg-red-500/20' : ev.type === 'detected' ? 'bg-green-500/20' : 'bg-slate-600/30'}`}>
                    {ev.type === 'unknown' ? <AlertTriangle size={10} className="text-red-400" /> :
                        ev.type === 'detected' ? <CheckCircle size={10} className="text-green-400" /> :
                            <Activity size={10} className="text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{ev.message}</p>
                    <p className="opacity-60 font-mono text-[9px] mt-0.5">{ev.time} · CAM-{ev.cam}</p>
                </div>
            </div>
        ))}
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const LiveStreamManager = () => {
    const { addToast } = useToast();
    const [config, setConfig] = useState({ active: false, type: 'demo', url: '' });
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [previewSearch, setPreviewSearch] = useState('');
    const [fullscreenCam, setFullscreenCam] = useState(null);
    const [events, setEvents] = useState([]);
    const [systemStats, setSystemStats] = useState({ uptime: 0, totalDetections: 0, alerts: 0 });
    const eventIntervalRef = useRef(null);

    const CAMERAS = [
        { id: 1, label: 'MAIN HALL · CAM-01' },
        { id: 2, label: 'CLASSROOM A · CAM-02' },
        { id: 3, label: 'PLAYGROUND · CAM-03' },
        { id: 4, label: 'ENTRANCE · CAM-04' },
    ];

    // Load initial data
    useEffect(() => {
        const init = async () => {
            try {
                const [settings, studentsData] = await Promise.all([
                    api.getSettings(),
                    api.getStudents()
                ]);
                if (settings?.['yolo.liveStream']) setConfig(settings['yolo.liveStream'].value || config);
                setStudents(studentsData);
                if (studentsData.length > 0) setSelectedStudent(studentsData[0]);
            } catch (err) {
                console.error(err);
            }
        };
        init();
    }, []);

    // Simulate detection events
    useEffect(() => {
        if (!config.active) return;

        const studentNames = students.map(s => s.name.split(' ')[0]);
        const camLabels = CAMERAS.map(c => c.id);

        const addEvent = () => {
            const roll = Math.random();
            const cam = camLabels[Math.floor(Math.random() * camLabels.length)];
            const now = new Date().toLocaleTimeString();

            let ev;
            if (roll < 0.08) {
                ev = { type: 'unknown', message: 'Unknown person detected — face not in registry', time: now, cam };
                setSystemStats(s => ({ ...s, alerts: s.alerts + 1 }));
            } else if (roll < 0.5 && studentNames.length > 0) {
                const name = studentNames[Math.floor(Math.random() * studentNames.length)];
                ev = { type: 'detected', message: `${name} identified with 94% confidence`, time: now, cam };
                setSystemStats(s => ({ ...s, totalDetections: s.totalDetections + 1 }));
            } else {
                ev = { type: 'info', message: `Motion detected — 6 persons in frame`, time: now, cam };
            }

            setEvents(prev => [ev, ...prev].slice(0, 30));
        };

        eventIntervalRef.current = setInterval(addEvent, 3500);
        return () => clearInterval(eventIntervalRef.current);
    }, [config.active, students]);

    // Uptime counter
    useEffect(() => {
        if (!config.active) return;
        const t = setInterval(() => setSystemStats(s => ({ ...s, uptime: s.uptime + 1 })), 1000);
        return () => clearInterval(t);
    }, [config.active]);

    const formatUptime = (s) => {
        const h = Math.floor(s / 3600).toString().padStart(2, '0');
        const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${h}:${m}:${sec}`;
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.updateSettings({ 'yolo.liveStream': config });
            addToast('Stream configuration saved', 'success');
        } catch {
            addToast('Failed to save settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleBroadcast = async () => {
        const newActive = !config.active;
        const newConfig = { ...config, active: newActive };
        setConfig(newConfig);
        if (newActive) {
            setSystemStats({ uptime: 0, totalDetections: 0, alerts: 0 });
            setEvents([]);
            addToast('🔴 Broadcast started — parents can now view the feed', 'success');
        } else {
            addToast('Broadcast stopped', 'info');
        }
        try {
            await api.updateSettings({ 'yolo.liveStream': newConfig });
        } catch {
            setConfig(config); // revert
        }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(previewSearch.toLowerCase()) ||
        s.id?.toLowerCase().includes(previewSearch.toLowerCase())
    );

    const activeCam = fullscreenCam ? CAMERAS.find(c => c.id === fullscreenCam) : null;

    return (
        <div className="space-y-6 animate-fade-in">

            {/* ── Header Stats Bar ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        icon: <Radio size={18} className={config.active ? 'text-red-400 animate-pulse' : 'text-slate-500'} />,
                        label: 'Broadcast',
                        value: config.active ? 'LIVE' : 'OFFLINE',
                        color: config.active ? 'text-red-400' : 'text-slate-500',
                        bg: config.active ? 'bg-red-950/30 border-red-800/40' : 'bg-slate-800/50 border-slate-700/50'
                    },
                    {
                        icon: <Clock size={18} className="text-blue-400" />,
                        label: 'Uptime',
                        value: formatUptime(systemStats.uptime),
                        color: 'text-blue-300',
                        bg: 'bg-slate-800/50 border-slate-700/50'
                    },
                    {
                        icon: <Eye size={18} className="text-green-400" />,
                        label: 'Detections',
                        value: systemStats.totalDetections.toString(),
                        color: 'text-green-300',
                        bg: 'bg-slate-800/50 border-slate-700/50'
                    },
                    {
                        icon: <AlertTriangle size={18} className="text-amber-400" />,
                        label: 'Alerts',
                        value: systemStats.alerts.toString(),
                        color: systemStats.alerts > 0 ? 'text-amber-300' : 'text-slate-500',
                        bg: systemStats.alerts > 0 ? 'bg-amber-950/30 border-amber-800/40' : 'bg-slate-800/50 border-slate-700/50'
                    },
                ].map((stat, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${stat.bg}`}>
                        <div className="p-2 bg-white/5 rounded-lg">{stat.icon}</div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-lg font-black font-mono ${stat.color}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Layout ── */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Camera Grid — 3 cols */}
                <div className="xl:col-span-3 space-y-4">

                    {/* Fullscreen Modal */}
                    {fullscreenCam && (
                        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col p-4 animate-fade-in">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-white font-bold font-mono">{activeCam?.label}</span>
                                </div>
                                <button
                                    onClick={() => setFullscreenCam(null)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden">
                                <CameraFeed
                                    camId={fullscreenCam}
                                    label={activeCam?.label}
                                    isActive={config.active}
                                    selectedStudent={selectedStudent}
                                    students={students}
                                    isFullscreen={true}
                                    onFullscreen={() => { }}
                                />
                            </div>
                        </div>
                    )}

                    {/* 2×2 Camera Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CAMERAS.map(cam => (
                            <CameraFeed
                                key={cam.id}
                                camId={cam.id}
                                label={cam.label}
                                isActive={config.active}
                                selectedStudent={selectedStudent}
                                students={students}
                                isFullscreen={false}
                                onFullscreen={setFullscreenCam}
                            />
                        ))}
                    </div>

                    {/* Detection Event Log */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700/50 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <Activity size={16} className="text-green-400" />
                                Detection Event Log
                            </h4>
                            <div className="flex items-center gap-2">
                                {config.active && (
                                    <span className="text-[9px] font-black text-green-400 bg-green-900/40 px-2 py-0.5 rounded-full border border-green-700/40 animate-pulse">
                                        LIVE FEED
                                    </span>
                                )}
                                <button
                                    onClick={() => setEvents([])}
                                    className="text-slate-500 hover:text-slate-300 transition p-1 rounded"
                                >
                                    <RefreshCw size={12} />
                                </button>
                            </div>
                        </div>
                        <DetectionLog events={events} />
                    </div>
                </div>

                {/* Right Panel — Controls */}
                <div className="xl:col-span-1 space-y-4">

                    {/* Broadcast Control */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700/50 p-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                            <MonitorPlay size={16} className="text-purple-400" />
                            Stream Control
                        </h3>

                        {/* Big broadcast toggle */}
                        <button
                            onClick={toggleBroadcast}
                            className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${config.active
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20'
                                }`}
                        >
                            {config.active ? (
                                <><WifiOff size={18} /> Stop Broadcast</>
                            ) : (
                                <><Wifi size={18} /> Start Broadcast</>
                            )}
                        </button>

                        <p className="text-[10px] text-slate-500 text-center mt-2">
                            {config.active ? 'Parents can currently view the live feed' : 'Feed is private — parents cannot see it'}
                        </p>

                        <div className="mt-4 border-t border-slate-700/50 pt-4 space-y-3">
                            {/* Source selector */}
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Source Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { val: 'demo', icon: <Video size={14} />, label: 'Demo' },
                                    { val: 'ip-cam', icon: <Globe size={14} />, label: 'IP Cam' },
                                ].map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => setConfig(c => ({ ...c, type: opt.val }))}
                                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-center gap-1.5 font-bold transition-all
                                            ${config.type === opt.val
                                                ? 'bg-purple-600/20 border-purple-500/60 text-purple-300'
                                                : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'}`}
                                    >
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* IP Cam URL */}
                            {config.type === 'ip-cam' && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Camera URL</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 bg-slate-800 border border-slate-600 rounded-lg font-mono text-xs text-white outline-none focus:border-purple-500 transition"
                                        placeholder="http://192.168.x.x:8080"
                                        value={config.url}
                                        onChange={e => setConfig(c => ({ ...c, url: e.target.value }))}
                                    />
                                    <p className="text-[9px] text-slate-500 leading-relaxed">
                                        Use IP Webcam app (Android). The <code className="bg-slate-700 px-1 rounded">/video</code> path is added automatically.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
                            >
                                <Save size={14} />
                                {loading ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>

                    {/* AI Legend */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700/50 p-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Detection Legend</h4>
                        <div className="space-y-2">
                            {[
                                { color: 'bg-green-500', label: 'Tracked Student', desc: 'Selected child identified' },
                                { color: 'bg-blue-500', label: 'Other Student', desc: 'Registered child' },
                                { color: 'bg-red-500', label: 'Unknown Person', desc: 'Not in registry — alert!' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <div className={`w-3 h-3 rounded-sm mt-0.5 shrink-0 ${item.color}`} />
                                    <div>
                                        <p className="text-xs font-bold text-slate-300">{item.label}</p>
                                        <p className="text-[9px] text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Student Tracker */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700/50 p-4">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                            <ScanFace size={16} className="text-blue-400" />
                            Track Student
                        </h4>
                        <p className="text-[10px] text-slate-500 mb-3">
                            Select a child to highlight them across all camera feeds.
                        </p>

                        <div className="relative mb-3">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-blue-500 transition"
                                value={previewSearch}
                                onChange={e => setPreviewSearch(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {filteredStudents.length === 0 && (
                                <p className="text-slate-600 text-xs text-center py-4">No students found</p>
                            )}
                            {filteredStudents.map(student => (
                                <button
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-all
                                        ${selectedStudent?.id === student.id
                                            ? 'bg-blue-600/30 border border-blue-500/50 text-blue-200'
                                            : 'hover:bg-slate-800 text-slate-400 border border-transparent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black
                                            ${selectedStudent?.id === student.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                            {student.name?.charAt(0)}
                                        </div>
                                        <span className="font-medium truncate">{student.name}</span>
                                    </div>
                                    {selectedStudent?.id === student.id && (
                                        <span className="text-[9px] text-green-400 font-bold shrink-0">TRACKING</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {selectedStudent && (
                            <div className="mt-3 p-3 bg-blue-950/40 border border-blue-800/40 rounded-lg">
                                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-wider mb-1">Now Tracking</p>
                                <p className="text-sm font-bold text-white">{selectedStudent.name}</p>
                                <p className="text-[9px] text-slate-500 font-mono">{selectedStudent.id}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveStreamManager;
