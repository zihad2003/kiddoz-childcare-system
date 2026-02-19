import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Play, Pause, Upload, Camera, Brain, Film, Info, Loader2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function YoloView() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const [ipAddress, setIpAddress] = useState('192.168.1.100');
    const [port, setPort] = useState('8080');
    const [status, setStatus] = useState('disconnected'); // disconnected | connecting | connected | error
    const [streamUrl, setStreamUrl] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [viewMode, setViewMode] = useState('mjpeg'); // mjpeg | ws | demo
    const [frameSrc, setFrameSrc] = useState('');

    // Demo Video State
    const [demoUrl, setDemoUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const wsRef = useRef(null);
    const imgRef = useRef(null);
    const isHttps = window.location.protocol === 'https:';

    useEffect(() => {
        fetchDemoVideo();
    }, []);

    const fetchDemoVideo = async () => {
        try {
            const data = await api.getDemoVideo();
            if (data.url) {
                // Ensure absolute URL if needed (using VITE_API_URL or relative)
                const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
                setDemoUrl(`${baseUrl}${data.url}`);
            }
        } catch (err) {
            console.error('Failed to fetch demo video', err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('video', file);

        setIsUploading(true);
        try {
            const data = await api.uploadDemoVideo(formData);
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
            setDemoUrl(`${baseUrl}${data.url}`);
            alert('Demo video updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to upload video');
        } finally {
            setIsUploading(false);
        }
    };

    const handleConnect = () => {
        if (viewMode === 'demo') {
            setStatus('connected');
            return;
        }

        if (!ipAddress || !port) {
            setErrorMsg('Please enter a valid IP address and port.');
            return;
        }

        if (viewMode === 'ws') {
            connectWebSocket();
        } else {
            setStatus('connecting');
            setErrorMsg('');
            // Use MJPEG stream
            const url = `http://${ipAddress}:${port}/video`;
            setStreamUrl(url);
        }
    };

    const connectWebSocket = () => {
        setStatus('connecting');
        setErrorMsg('');
        wsRef.current = new WebSocket('ws://localhost:8765');
        wsRef.current.onopen = () => setStatus('connected');
        wsRef.current.onmessage = (e) => {
            setFrameSrc(`data:image/jpeg;base64,${e.data}`);
        };
        wsRef.current.onerror = () => {
            setStatus('error');
            setErrorMsg('WebSocket connection failed. Ensure yolo_server.py is running.');
        };
        wsRef.current.onclose = () => setStatus('disconnected');
    };

    const handleDisconnect = () => {
        if (wsRef.current) wsRef.current.close();
        setStreamUrl('');
        setFrameSrc('');
        setStatus('disconnected');
    };

    const handleImgLoad = () => setStatus('connected');

    const handleImgError = () => {
        setStatus('error');
        if (isHttps) {
            setErrorMsg('Connection blocked. Your browser prevents HTTP camera streams on HTTPS pages.');
        } else {
            setErrorMsg('Cannot connect. Ensure: (1) IP Webcam app is running, (2) You are on same WiFi, (3) IP and port are correct.');
        }
        setStreamUrl('');
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-primary-600 rounded-lg text-white">📷</span> Live Camera Feed (YOLO AI)
                </h2>

                <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
                    {[
                        { id: 'mjpeg', label: 'MJPEG', icon: Camera },
                        { id: 'ws', label: 'YOLO WS', icon: Brain },
                        { id: 'demo', label: 'DEMO', icon: Film }
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => { setViewMode(mode.id); setStatus('disconnected'); handleDisconnect(); }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${viewMode === mode.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            <mode.icon size={14} /> {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
                <div className="mb-6 p-4 bg-primary-900/20 border border-primary-500/30 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-500/20 rounded-full text-primary-400">
                            <Upload size={18} />
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">Admin: Manage Demo Video</p>
                            <p className="text-primary-300/60 text-[10px] uppercase tracking-wider">Update the video shown in Demo Mode</p>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="video/*"
                        className="hidden"
                    />
                    <Button
                        size="sm"
                        onClick={() => fileInputRef.current.click()}
                        isLoading={isUploading}
                        className="bg-primary-600 hover:bg-primary-700 h-9"
                    >
                        {!isUploading && <Upload size={14} className="mr-2" />}
                        {isUploading ? 'Uploading...' : 'Replace Video'}
                    </Button>
                </div>
            )}

            {/* HTTPS Warning */}
            {isHttps && viewMode === 'mjpeg' && (
                <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-4">
                    <p className="text-yellow-300 font-semibold text-sm">⚠️ HTTPS Limitation</p>
                    <p className="text-yellow-200 text-xs mt-1">
                        HTTP MJPEG streams are blocked on HTTPS sites. Switch to <strong className="text-white underline">YOLO WS</strong> or <strong className="text-white underline">DEMO</strong> mode.
                    </p>
                </div>
            )}

            {/* Connection Form */}
            {viewMode !== 'demo' && (
                <div className="flex gap-4 mb-6 flex-wrap bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex-1 min-w-[150px]">
                        <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1.5 ml-1">Phone IP Address</label>
                        <input
                            type="text"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            placeholder="192.168.1.100"
                            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition"
                        />
                    </div>
                    <div className="w-24">
                        <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1.5 ml-1">Port</label>
                        <input
                            type="text"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            placeholder="8080"
                            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        {status !== 'connected' ? (
                            <button
                                onClick={handleConnect}
                                disabled={status === 'connecting'}
                                className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-900/20 transition-all hover:scale-105"
                            >
                                {status === 'connecting' ? 'Connecting...' : '▶ Connect'}
                            </button>
                        ) : (
                            <button
                                onClick={handleDisconnect}
                                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105"
                            >
                                ⏹ Disconnect
                            </button>
                        )}
                    </div>
                    <div className="flex items-end">
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter ${status === 'connected' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            status === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                status === 'connecting' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-gray-700 text-gray-400'
                            }`}>
                            {status === 'connected' ? 'CONNECTED' :
                                status === 'error' ? 'ERROR' :
                                    status === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
                        </span>
                    </div>
                </div>
            )}

            {/* Error message */}
            {errorMsg && viewMode !== 'demo' && (
                <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                        <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                </div>
            )}

            {/* Video Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-inner group transition-all duration-700 border border-gray-800">
                {viewMode === 'demo' ? (
                    demoUrl ? (
                        <video
                            ref={videoRef}
                            src={demoUrl}
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-cover"
                            controls={false}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 bg-gray-900/50">
                            <Film size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">No Demo Video</p>
                            {isAdmin && <p className="text-xs mt-2 text-gray-500">Upload a video above to see it here</p>}
                        </div>
                    )
                ) : viewMode === 'ws' ? (
                    frameSrc ? (
                        <img
                            src={frameSrc}
                            alt="YOLO AI WebSocket Feed"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                            <Brain size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">Awaiting YOLO Stream...</p>
                            <p className="text-xs mt-2 px-8 text-center italic text-gray-500">Run server/yolo_server.py and connect phone</p>
                        </div>
                    )
                ) : (
                    streamUrl ? (
                        <img
                            ref={imgRef}
                            src={streamUrl}
                            alt="IP Webcam Live Feed"
                            onLoad={handleImgLoad}
                            onError={handleImgError}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                            <Camera size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-bold uppercase tracking-widest">Camera Offline</p>
                            <p className="text-xs mt-2 px-8 text-center text-gray-500">Enter IP and click Connect to start</p>
                        </div>
                    )
                )}

                {/* HUD Overlays */}
                {viewMode === 'demo' && demoUrl && (
                    <>
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="bg-primary-600/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                                    DEMO MODE ACTIVE
                                </div>
                                <div className="bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-bold border border-white/10 uppercase tracking-widest">
                                    Pre-recorded Feed
                                </div>
                            </div>
                        </div>

                        {/* Simulation boxes for "Full Working Condition" look */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-[20%] left-[30%] w-[15%] h-[40%] border-2 border-green-500/50 rounded-lg">
                                <span className="absolute -top-6 left-0 bg-green-500 text-black text-[9px] font-black px-1 rounded uppercase">Student 98%</span>
                            </div>
                            <div className="absolute top-[10%] right-[20%] w-[20%] h-[30%] border-2 border-blue-500/50 rounded-lg">
                                <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[9px] font-black px-1 rounded uppercase">Teacher 95%</span>
                            </div>
                            <div className="absolute bottom-10 left-10 text-white/40 text-[10px] font-mono leading-tight">
                                [AI_SCAN_INITIALIZED]<br />
                                [BUFFER_BUFFERING_128KB]<br />
                                [OBJECT_DETECTED_CLASS_5]<br />
                                [TRACKING_REF_ID_X92]
                            </div>
                        </div>
                    </>
                )}

                {status === 'connected' && viewMode !== 'demo' && (
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-red-600/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                            {viewMode === 'ws' ? 'AI LIVE PROCESSING' : 'DIRECT LINK ACTIVE'}
                        </div>
                        <div className="bg-red-500 h-2 w-2 rounded-full animate-pulse self-center"></div>
                    </div>
                )}
            </div>

            {/* Setup Guide */}
            <details className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-800 hover:bg-gray-800/50 transition cursor-pointer group">
                <summary className="text-gray-300 text-sm font-bold uppercase tracking-widest flex justify-between select-none list-none">
                    <span className="flex items-center gap-2"><Info size={16} className="text-primary-500" /> System Guide</span>
                    <span className="text-primary-500 opacity-50 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <p className="text-primary-400 text-xs font-black uppercase tracking-tighter flex items-center gap-1.5"><Camera size={14} /> 1. Direct Mode</p>
                        <ul className="text-gray-400 text-[11px] space-y-1.5 leading-relaxed">
                            <li>• Use <strong className="text-white">IP Webcam</strong> app</li>
                            <li>• Same WiFi connection required</li>
                            <li>• Works with MJPEG protocol</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <p className="text-teal-400 text-xs font-black uppercase tracking-tighter flex items-center gap-1.5"><Brain size={14} /> 2. YOLO AI Mode</p>
                        <ul className="text-gray-400 text-[11px] space-y-1.5 leading-relaxed">
                            <li>• Run <code>yolo_server.py</code></li>
                            <li>• Real-time object detection</li>
                            <li>• Powered by WebSocket streams</li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <p className="text-secondary-400 text-xs font-black uppercase tracking-tighter flex items-center gap-1.5"><Film size={14} /> 3. Demo Mode</p>
                        <ul className="text-gray-400 text-[11px] space-y-1.5 leading-relaxed">
                            <li>• Play high-res pre-recorded feed</li>
                            <li>• Perfect for stakeholder demos</li>
                            <li>• Admin can update demo file</li>
                        </ul>
                    </div>
                </div>
            </details>
        </div>
    );
}
