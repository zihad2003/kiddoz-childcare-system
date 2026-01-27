
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, Globe, Save, MonitorPlay, Users, Search, ScanFace, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { loadYOLOModel, detectObjects, generateDemoFrame } from '../../services/yoloService';

const LiveStreamManager = () => {
    const { addToast } = useToast();
    const [config, setConfig] = useState({
        active: false,
        type: 'demo', // 'demo' or 'ip-cam'
        url: ''
    });
    const [loading, setLoading] = useState(false);

    // --- Student Simulation State ---
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null); // The student to simulate view for
    const [previewSearch, setPreviewSearch] = useState('');

    // --- Video/Canvas Refs for Admin Preview ---
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const [isModelLoading, setIsModelLoading] = useState(false);

    // Fetch settings & students on mount
    useEffect(() => {
        const initData = async () => {
            try {
                const [settings, studentsData] = await Promise.all([
                    api.getSettings(),
                    api.getStudents()
                ]);

                if (settings['yolo.liveStream']) {
                    setConfig(settings['yolo.liveStream'].value);
                }
                setStudents(studentsData);
                if (studentsData.length > 0) setSelectedStudent(studentsData[0]); // Default to first
            } catch (err) {
                console.error(err);
                addToast("Failed to load initial data", "error");
            }
        };
        initData();
    }, []);

    // --- YOLO / Preview Logic ---
    // This replicates the logic in LiveViewYOLO but uses selectedStudent instead of logged-in user context
    const startProcessing = useCallback(async () => {
        if (!canvasRef.current || (config.type === 'ip-cam' && !videoRef.current)) return;

        const ctx = canvasRef.current.getContext('2d');
        let frameCount = 0;

        const drawBoundingBox = (ctx, prediction, type, label) => {
            const [x, y, width, height] = prediction.bbox;
            let color = '#60a5fa'; // Blue (Other)
            if (type === 'mine') color = '#4ade80'; // Green
            if (type === 'unknown') color = '#ef4444'; // Red

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = color;
            const textWidth = ctx.measureText(label).width;
            ctx.fillRect(x, y - 24, textWidth + 10, 24);

            ctx.fillStyle = type === 'unknown' ? 'white' : 'black';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(label, x + 5, y - 7);
        };

        const renderFrame = async () => {
            // Even if config.active is false, Admin might want to see preview if setting up? 
            // For now, let's assume Admin sees what is possible to stream.

            frameCount++;
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;
            ctx.clearRect(0, 0, width, height);

            let predictions = [];

            // 1. Draw Feed
            if (config.type === 'ip-cam') {
                if (videoRef.current && videoRef.current.readyState >= 2) {
                    ctx.drawImage(videoRef.current, 0, 0, width, height);
                    if (frameCount % 4 === 0) predictions = await detectObjects(videoRef.current);
                }
            } else {
                // Demo
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(0, 0, width, height);
                ctx.font = "20px sans-serif";
                ctx.fillStyle = "#334155";
                ctx.fillText("ADMIN PREVIEW", 20, 30);
                predictions = generateDemoFrame(width, height, (performance.now() / 50));
            }

            // 2. Process Detections (Simulation Logic)

            // Helper: Deterministically map a Student ID to a specific Object Index/ID
            // This ensures "Liam" is always the person on the left, "Emma" is on the right, etc.
            const getTargetForStudent = (studentId, maxRange) => {
                if (!studentId) return -1;
                // Simple hash of the ID string
                let hash = 0;
                for (let i = 0; i < studentId.length; i++) {
                    hash = studentId.charCodeAt(i) + ((hash << 5) - hash);
                }
                return Math.abs(hash) % maxRange;
            };

            predictions.forEach((pred, index) => {
                let type = 'other';
                let label = 'Student'; // Generic label for others

                if (config.type === 'demo') {
                    // Demo Mode: We have 5 valid 'student' objects (101-105) and 1 'unknown' (106)
                    // We map the selected student to one of the 101-105 IDs
                    if (selectedStudent) {
                        const targetOffset = getTargetForStudent(selectedStudent.id, 5); // 0-4
                        const targetId = 101 + targetOffset; // 101-105

                        if (pred.simulatedId === targetId) {
                            type = 'mine';
                            label = selectedStudent.name;
                        } else if (pred.simulatedId === 106) {
                            type = 'unknown';
                            label = 'Unknown';
                        }
                    }
                } else {
                    // IP Cam Mode: We don't have simulated IDs, only array indices (0 to predictions.length)
                    // We stick the label to a specific index based on the student ID
                    if (selectedStudent && predictions.length > 0) {
                        const targetIndex = getTargetForStudent(selectedStudent.id, predictions.length);

                        if (index === targetIndex) {
                            type = 'mine';
                            label = selectedStudent.name;
                        }
                    }
                }
                drawBoundingBox(ctx, pred, type, label);
            });

            requestRef.current = requestAnimationFrame(renderFrame);
        };
        renderFrame();
    }, [config, selectedStudent]);

    // Handle Stream/Config Changes for Preview
    useEffect(() => {
        if (config.type === 'ip-cam' && config.url) {
            setIsModelLoading(true);
            loadYOLOModel().then(() => {
                setIsModelLoading(false);
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                    videoRef.current.crossOrigin = "anonymous";
                    let formattedUrl = config.url.trim();
                    if (!formattedUrl.endsWith('/video') && !formattedUrl.endsWith('/video/')) {
                        formattedUrl = formattedUrl.replace(/\/$/, '') + '/video';
                    }
                    const proxyUrl = `http://localhost:5001/api/ai/proxy-stream?url=${encodeURIComponent(formattedUrl)}`;
                    videoRef.current.src = proxyUrl;
                    videoRef.current.play().catch(console.error);
                }
                startProcessing();
            });
        } else {
            // Demo
            startProcessing();
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [config, startProcessing]);


    const handleSave = async () => {
        setLoading(true);
        try {
            await api.updateSettings({
                'yolo.liveStream': config
            });
            addToast("Stream Configuration Updated", "success");
        } catch (err) {
            addToast("Failed to update settings", "error");
        } finally {
            setLoading(false);
        }
    };

    // Filter students for dropdown
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(previewSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(previewSearch.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Settings */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-t-4 border-t-purple-600">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <MonitorPlay className="text-purple-600" />
                                Stream Control
                            </h3>
                        </div>
                        <Badge color={config.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}>
                            {config.active ? 'LIVE' : 'OFF'}
                        </Badge>
                    </div>

                    <div className="space-y-6">
                        {/* Toggle Active */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <span className="font-bold text-slate-800 block">Broadcast</span>
                                <span className="text-xs text-slate-500">Enable parent access</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={config.active}
                                    onChange={async (e) => {
                                        const newActive = e.target.checked;
                                        const newConfig = { ...config, active: newActive };
                                        setConfig(newConfig); // Optimistic UI update

                                        try {
                                            await api.updateSettings({ 'yolo.liveStream': newConfig });
                                            addToast(newActive ? "Broadcast Started" : "Broadcast Stopped", "success");
                                        } catch (err) {
                                            console.error(err);
                                            addToast("Failed to sync status", "error");
                                            setConfig({ ...config, active: !newActive }); // Revert
                                        }
                                    }}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>

                        {/* Stream Source */}
                        <div>
                            <label className="font-bold text-sm text-slate-600 mb-2 block">Source</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setConfig({ ...config, type: 'demo' })}
                                    className={`p-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${config.type === 'demo' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-200'}`}
                                >
                                    <Video size={16} /> Demo
                                </button>
                                <button
                                    onClick={() => setConfig({ ...config, type: 'ip-cam' })}
                                    className={`p-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${config.type === 'ip-cam' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-200'}`}
                                >
                                    <Globe size={16} /> IP Cam
                                </button>
                            </div>
                        </div>

                        {/* IP URL Input */}
                        {config.type === 'ip-cam' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <label className="font-bold text-sm text-slate-600 mb-2 block">Camera URL</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border rounded-xl font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                    placeholder="http://192.168.x.x:8080"
                                    value={config.url}
                                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                                />
                            </div>
                        )}

                        <Button onClick={handleSave} disabled={loading} className="w-full">
                            <Save size={18} className="mr-2" />
                            {loading ? 'Saving...' : 'Update Settings'}
                        </Button>
                    </div>
                </Card>

                {/* Simulated Parent Selector */}
                <Card className="bg-slate-800 text-white border-0">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                        <ScanFace className="text-blue-400" /> Simulate Parent View
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                        Select a student to verify what their parent sees on the dashboard.
                    </p>

                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="w-full pl-9 p-2 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none focus:border-blue-400"
                            value={previewSearch}
                            onChange={(e) => setPreviewSearch(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className={`w-full text-left p-2 rounded-lg text-sm flex items-center justify-between transition-colors ${selectedStudent?.id === student.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
                            >
                                <span className="truncate">{student.name}</span>
                                {selectedStudent?.id === student.id && <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Right Column: Live Preview */}
            <div className="lg:col-span-2">
                <Card className="h-full bg-black border-slate-800 p-1 flex flex-col">
                    <div className="bg-slate-900 p-2 rounded-t-lg flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Verification Preview</span>
                        {selectedStudent && (
                            <Badge color="bg-blue-900 text-blue-200 border border-blue-700">
                                Viewing as: {selectedStudent.name}
                            </Badge>
                        )}
                    </div>

                    <div className="relative flex-1 bg-black rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                        {/* Status Overlay */}
                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                            {config.active && <Badge color="bg-red-600 text-white animate-pulse">LIVE BROADCAST</Badge>}
                            {!config.active && <Badge color="bg-slate-600 text-slate-200">BROADCAST OFF</Badge>}
                        </div>

                        {/* Hidden Video for Texture */}
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

                        {/* Drawing Canvas */}
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-contain"
                            width={640}
                            height={480}
                        />

                        {isModelLoading && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <span className="text-white font-bold">Connecting AI Model...</span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default LiveStreamManager;
