#!/usr/bin/env python3
"""
Real YOLOv8 processing server with WebSocket output.
Run: pip install ultralytics websockets opencv-python
Then: python yolo_server.py
"""
import asyncio
import base64
import cv2
import websockets
import json
import os
from ultralytics import YOLO

# Load model (downloads on first run)
model = YOLO('yolov8n.pt')

# Target IP Webcam URL (will be overridden by client if needed, but defaults here)
IP_WEBCAM_URL = 'http://192.168.1.100:8080/video'

async def stream_yolo(websocket):
    print(f"✅ Client connected: {websocket.remote_address}")
    
    # Try to open the stream
    cap = cv2.VideoCapture(IP_WEBCAM_URL)
    
    if not cap.isOpened():
        print(f"❌ Cannot connect to camera at {IP_WEBCAM_URL}")
        await websocket.send(json.dumps({"error": f"Cannot connect to camera at {IP_WEBCAM_URL}"}))
        return
    
    print(f"🚀 Starting YOLO inference on {IP_WEBCAM_URL}")
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("⚠️ Stream disconnected")
                break
            
            # Run YOLO inference
            # verbose=False reduces console clutter
            # conf=0.5 sets detection threshold
            results = model(frame, verbose=False, conf=0.5)
            
            # Draw boxes and labels on the frame
            annotated_frame = results[0].plot()
            
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
            
            # Base64 encode the frame to send over WebSocket
            b64_frame = base64.b64encode(buffer).decode('utf-8')
            
            await websocket.send(b64_frame)
            
            # Throttling to keep CPU usage sane (~20 FPS)
            await asyncio.sleep(0.05)
            
    except websockets.exceptions.ConnectionClosed:
        print("👋 Client disconnected")
    except Exception as e:
        print(f"🔥 Error: {str(e)}")
    finally:
        cap.release()
        print("🔦 Camera released")

async def main():
    # Allow port to be configurable via env
    port = int(os.environ.get("YOLO_PORT", 8765))
    host = "0.0.0.0" # Bind to all interfaces
    
    print(f"📡 YOLO WebSocket server starting on ws://{host}:{port}")
    async with websockets.serve(stream_yolo, host, port):
        await asyncio.Future()  # block forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
