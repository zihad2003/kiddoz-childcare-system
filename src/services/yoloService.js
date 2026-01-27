
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

let model = null;

export const loadYOLOModel = async () => {
    try {
        if (!model) {
            console.log("Loading YOLO model...");
            model = await cocoSsd.load({
                base: 'lite_mobilenet_v2' // Faster for browser
            });
            console.log("YOLO model loaded successfully");
        }
        return model;
    } catch (error) {
        console.error("Failed to load YOLO model:", error);
        throw error;
    }
};

export const detectObjects = async (videoElement) => {
    if (!model || !videoElement) return [];

    try {
        const predictions = await model.detect(videoElement, 6); // Max 6 detections for performance
        // Filter for 'person' class only
        return predictions.filter(p => p.class === 'person');
    } catch (err) {
        console.warn("Detection error (frame might not be ready):", err);
        return [];
    }
};

// Simulation helper for Demo Mode
export const generateDemoFrame = (width, height, frameCount) => {
    const time = frameCount * 0.05;

    // Simulate 5-6 people moving
    const simulatedStart = [
        { id: 101, baseX: width * 0.2, baseY: height * 0.4, speed: 2, phase: 0 },
        { id: 102, baseX: width * 0.5, baseY: height * 0.5, speed: 1.5, phase: 2 },
        { id: 103, baseX: width * 0.8, baseY: height * 0.4, speed: 2.2, phase: 4 },
        { id: 104, baseX: width * 0.3, baseY: height * 0.6, speed: 1.2, phase: 1 },
        { id: 105, baseX: width * 0.7, baseY: height * 0.3, speed: 1.8, phase: 3 },
        { id: 106, baseX: width * 0.1, baseY: height * 0.7, speed: 0.5, phase: 5 }, // Unknown/Stranger
    ];

    return simulatedStart.map(p => {
        const x = p.baseX + Math.sin(time + p.phase) * (width * 0.15);
        const y = p.baseY + Math.cos(time * 0.8 + p.phase) * (height * 0.05);

        return {
            class: 'person',
            score: 0.85 + (Math.sin(time) * 0.1), // fluctuate confidence
            bbox: [x, y, 100, 220], // fixed size roughly
            simulatedId: p.id
        };
    });
};
