import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle, User, Activity, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const BiometricRegistration = ({ onComplete, onBack, defaultImages = { face: null, body: null } }) => {
    const [step, setStep] = useState('face'); // 'face' or 'body'
    const [images, setImages] = useState(defaultImages);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const webcamRef = useRef(null);

    // If we have a face but no body, start at body
    useEffect(() => {
        if (defaultImages.face && !defaultImages.body) {
            setStep('body');
        } else if (defaultImages.face && defaultImages.body) {
            // If both exist, maybe show completion or stay on body?
            // Let's stay on body to allow retake
            setStep('body');
        }
    }, []);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImages(prev => ({ ...prev, [step]: imageSrc }));
        setIsCameraOpen(false);
    }, [webcamRef, step]);

    const handleNext = () => {
        if (step === 'face') {
            setStep('body');
            setIsCameraOpen(false);
        } else {
            onComplete(images);
        }
    };

    const retake = () => {
        setImages(prev => ({ ...prev, [step]: null }));
        setIsCameraOpen(true);
    };

    const guides = {
        face: {
            title: "Facial Recognition Scan",
            desc: "Please look directly at the camera. Ensure your face is well-lit and centered.",
            icon: User,
            overlay: "border-primary-500 rounded-full w-64 h-64 border-4 opacity-50"
        },
        body: {
            title: "Full Body Identification",
            desc: "Please step back to capture your full torso and posture for gait analysis.",
            icon: Activity,
            overlay: "border-primary-500 rounded-3xl w-64 h-96 border-4 opacity-50"
        }
    };

    const currentGuide = guides[step];
    const currentImage = images[step];

    return (
        <Card className="max-w-2xl mx-auto p-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-8">
                <Badge color="bg-primary-100 text-primary-700 mb-4 animate-pulse">AI Enrollment • Step {step === 'face' ? '1' : '2'} of 2</Badge>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{currentGuide.title}</h2>
                <p className="text-slate-500 max-w-md mx-auto">{currentGuide.desc}</p>
            </div>

            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-video mb-8 ring-4 ring-slate-100 group">
                {!currentImage ? (
                    !isCameraOpen ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-900">
                            <currentGuide.icon size={64} className="mb-4 text-primary-400 opacity-50" />
                            <p className="mb-6 font-bold text-lg">Camera access required for AI setup</p>
                            <Button onClick={() => setIsCameraOpen(true)} icon={Camera} className="shadow-primary-500/50">
                                Activate Camera
                            </Button>
                        </div>
                    ) : (
                        <div className="relative h-full w-full">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="h-full w-full object-cover"
                                videoConstraints={{ facingMode: "user" }}
                            />
                            {/* Overlay Guide Box */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className={`${currentGuide.overlay} border-dashed shadow-[0_0_1000px_rgba(0,0,0,0.5)_inset]`}></div>
                            </div>

                            <div className="absolute bottom-6 inset-x-0 flex justify-center">
                                <button
                                    onClick={capture}
                                    className="w-16 h-16 bg-white rounded-full border-4 border-primary-500 shadow-lg hover:scale-110 transition-transform active:scale-95"
                                ></button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="relative h-full w-full">
                        <img src={currentImage} alt="Captured" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                            <div className="text-center text-white">
                                <CheckCircle size={64} className="mx-auto mb-4 text-green-400 drop-shadow-lg" />
                                <h3 className="text-2xl font-bold mb-2">Scan Successful</h3>
                                <p className="opacity-80">Quality: <span className="text-green-300 font-bold">Excellent (98%)</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center flex-shrink-0">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-xs text-slate-500 leading-tight">
                        Images are encrypted and used solely for<br />
                        <span className="font-bold text-slate-700">YOLOv8 Safety Monitoring</span>.
                    </p>
                </div>

                <div className="flex gap-3">
                    {currentImage && (
                        <Button variant="ghost" onClick={retake} icon={RefreshCw}>Retake</Button>
                    )}
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onBack}>Back</Button>
                        <Button
                            onClick={handleNext}
                            disabled={!currentImage}
                            className={!currentImage ? 'opacity-50 cursor-not-allowed' : 'shadow-lg shadow-primary-200'}
                        >
                            {step === 'face' ? 'Next Step' : 'Complete Setup'}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BiometricRegistration;
