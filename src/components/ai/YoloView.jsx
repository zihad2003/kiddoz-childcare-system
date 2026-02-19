import React, { useState, useRef, useEffect } from 'react';

export default function YoloView() {
    const [ipAddress, setIpAddress] = useState('192.168.1.100');
    const [port, setPort] = useState('8080');
    const [status, setStatus] = useState('disconnected'); // disconnected | connecting | connected | error
    const [streamUrl, setStreamUrl] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [useWS, setUseWS] = useState(false);
    const [frameSrc, setFrameSrc] = useState('');
    const wsRef = useRef(null);
    const imgRef = useRef(null);
    const isHttps = window.location.protocol === 'https:';

    const handleConnect = () => {
        if (!ipAddress || !port) {
            setErrorMsg('Please enter a valid IP address and port.');
            return;
        }

        if (useWS) {
            connectWebSocket();
        } else {
            setStatus('connecting');
            setErrorMsg('');
            // IMPORTANT: Use /video for MJPEG stream from IP Webcam app
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
            setErrorMsg('Connection blocked. Your browser prevents HTTP camera streams on HTTPS pages. See instructions below.');
        } else {
            setErrorMsg('Cannot connect. Ensure: (1) IP Webcam app is running, (2) You are on same WiFi, (3) IP and port are correct.');
        }
        setStreamUrl('');
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-purple-600 rounded-lg text-white">📷</span> Live Camera Feed (YOLO AI)
                </h2>
                <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setUseWS(false)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${!useWS ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                    >
                        MJPEG
                    </button>
                    <button
                        onClick={() => setUseWS(true)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition ${useWS ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                    >
                        YOLO WS
                    </button>
                </div>
            </div>

            {/* HTTPS Warning */}
            {isHttps && !useWS && (
                <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-4">
                    <p className="text-yellow-300 font-semibold text-sm">⚠️ HTTPS Limitation</p>
                    <p className="text-yellow-200 text-xs mt-1">
                        HTTP MJPEG streams are blocked on HTTPS sites. Switch to <strong className="text-white underline">YOLO WS</strong> mode or access this app locally at <code>http://localhost:5173</code>.
                    </p>
                </div>
            )}

            {/* Connection Form */}
            <div className="flex gap-4 mb-6 flex-wrap bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="flex-1 min-w-[150px]">
                    <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1.5 ml-1">Phone IP Address</label>
                    <input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="192.168.1.100"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition"
                    />
                </div>
                <div className="w-24">
                    <label className="text-gray-400 text-[10px] uppercase font-bold block mb-1.5 ml-1">Port</label>
                    <input
                        type="text"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="8080"
                        className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition"
                    />
                </div>
                <div className="flex items-end gap-2">
                    {status !== 'connected' ? (
                        <button
                            onClick={handleConnect}
                            disabled={status === 'connecting'}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
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
                {/* Status badge */}
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

            {/* Error message */}
            {errorMsg && (
                <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                        <span className="font-bold">❌</span>
                        <span>{errorMsg}</span>
                    </div>
                </div>
            )}

            {/* Video Stream */}
            <div className="relative bg-black rounded-2xl overflow-hidden aspect-video shadow-inner group cursor-crosshair">
                {useWS ? (
                    frameSrc ? (
                        <img
                            src={frameSrc}
                            alt="YOLO AI WebSocket Feed"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-2xl">🧠</div>
                            <p className="text-sm font-bold uppercase tracking-widest">Awaiting YOLO Stream...</p>
                            <p className="text-xs mt-2 px-8 text-center italic text-gray-500">Run server/yolo_server.py and connect phone to start AI detection</p>
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
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 text-2xl">📷</div>
                            <p className="text-sm font-bold uppercase tracking-widest">Camera Offline</p>
                            <p className="text-xs mt-2 px-8 text-center text-gray-500">Enter IP address and click Connect to view MJPEG stream</p>
                        </div>
                    )
                )}

                {/* Overlay HUD */}
                {status === 'connected' && (
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-bold border border-white/10 uppercase tracking-widest">
                            {useWS ? 'AI Processing Active' : 'Direct Link Active'}
                        </div>
                        <div className="bg-red-600 h-2 w-2 rounded-full animate-pulse self-center"></div>
                    </div>
                )}
            </div>

            {/* How-to instructions */}
            <details className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-800 hover:bg-gray-800/50 transition cursor-pointer">
                <summary className="text-gray-300 text-sm font-bold uppercase tracking-widest flex justify-between select-none">
                    📱 Setup Guide
                    <span className="text-purple-500 opacity-50">View Steps</span>
                </summary>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <p className="text-purple-400 text-xs font-bold uppercase tracking-tighter">1. Phone Setup</p>
                        <ol className="text-gray-400 text-xs space-y-1.5 list-decimal list-inside leading-relaxed">
                            <li>Install <strong className="text-white">IP Webcam</strong> app</li>
                            <li>Connect phone & PC to <strong className="text-white text-xs">SAME WiFi</strong></li>
                            <li>Tap <strong className="text-xs text-white">"Start server"</strong> in app</li>
                        </ol>
                    </div>
                    <div className="space-y-3">
                        <p className="text-purple-400 text-xs font-bold uppercase tracking-tighter">2. YOLO AI Mode</p>
                        <ol className="text-gray-400 text-xs space-y-1.5 list-decimal list-inside leading-relaxed">
                            <li>Switch to <strong className="text-white">YOLO WS</strong> above</li>
                            <li>Run <code>python yolo_server.py</code> locally</li>
                            <li>App detects objects and streams back via WebSocket</li>
                        </ol>
                    </div>
                </div>
            </details>
        </div>
    );
}
