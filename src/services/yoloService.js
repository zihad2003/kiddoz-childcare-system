
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

let model = null;
let modelLoading = false;

export const loadYOLOModel = async () => {
    if (model) return model;
    if (modelLoading) {
        // Wait for in-progress load
        await new Promise(resolve => {
            const check = setInterval(() => {
                if (model) { clearInterval(check); resolve(); }
            }, 200);
        });
        return model;
    }
    modelLoading = true;
    try {
        console.log('[YOLO] Loading coco-ssd model...');
        model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        console.log('[YOLO] Model loaded successfully');
        return model;
    } catch (error) {
        console.error('[YOLO] Failed to load model:', error);
        modelLoading = false;
        throw error;
    }
};

/**
 * Check if an img or video element has valid pixel data ready for inference.
 */
const isElementReady = (el) => {
    if (!el) return false;
    if (el.tagName === 'IMG') {
        return el.complete && el.naturalWidth > 0 && el.naturalHeight > 0;
    }
    if (el.tagName === 'VIDEO') {
        return el.readyState >= 2 && el.videoWidth > 0;
    }
    return false;
};

/**
 * Run person detection on an img or video element.
 * Returns array of { class, score, bbox: [x, y, w, h] }
 */
export const detectObjects = async (element) => {
    if (!model || !isElementReady(element)) return [];
    try {
        const predictions = await model.detect(element, 8);
        return predictions.filter(p => p.class === 'person');
    } catch (err) {
        console.warn('[YOLO] Detection error (frame not ready):', err.message);
        return [];
    }
};

/**
 * Demo mode: generate animated simulated detections.
 * Returns 6 objects with simulatedId 101-106 (106 = unknown stranger).
 */
export const generateDemoFrame = (width, height, frameCount) => {
    const time = frameCount * 0.05;

    const simulatedStart = [
        { id: 101, baseX: width * 0.15, baseY: height * 0.35, phase: 0 },
        { id: 102, baseX: width * 0.45, baseY: height * 0.45, phase: 2 },
        { id: 103, baseX: width * 0.75, baseY: height * 0.35, phase: 4 },
        { id: 104, baseX: width * 0.28, baseY: height * 0.55, phase: 1 },
        { id: 105, baseX: width * 0.65, baseY: height * 0.28, phase: 3 },
        { id: 106, baseX: width * 0.08, baseY: height * 0.65, phase: 5 }, // Unknown
    ];

    const personW = Math.max(50, width * 0.10);
    const personH = Math.max(100, height * 0.45);

    return simulatedStart.map(p => {
        const x = Math.max(0, Math.min(width - personW,
            p.baseX + Math.sin(time + p.phase) * (width * 0.12)));
        const y = Math.max(0, Math.min(height - personH,
            p.baseY + Math.cos(time * 0.8 + p.phase) * (height * 0.06)));

        return {
            class: 'person',
            score: 0.82 + Math.sin(time + p.phase) * 0.12,
            bbox: [x, y, personW, personH],
            simulatedId: p.id,
        };
    });
};
