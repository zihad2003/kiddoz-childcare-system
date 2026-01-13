import React, { useState } from 'react';
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const DoctorUpload = ({ studentId, onUploadComplete }) => {
    const { addToast } = useToast();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            setUploading(false);
            setFile(null);
            if (onUploadComplete) onUploadComplete();
            addToast("Medical document uploaded successfully!", 'success');
        }, 2000);
    };

    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Upload className="text-purple-600" size={24} />
                Upload Medical Records
            </h3>

            <div
                className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'}
          ${file ? 'bg-purple-50 border-purple-500' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {!file ? (
                    <>
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <p className="text-slate-600 font-medium mb-1">Drag & Drop medical files here</p>
                        <p className="text-slate-400 text-sm mb-4">PDF, JPG, or PNG (Max 5MB)</p>
                        <label className="inline-block">
                            <input type="file" className="hidden" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" />
                            <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition shadow-sm">
                                Browse Files
                            </span>
                        </label>
                    </>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <p className="font-bold text-slate-800 mb-1">{file.name}</p>
                        <p className="text-slate-500 text-sm mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFile(null)}
                                disabled={uploading}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <X size={16} /> Remove
                            </Button>
                            <Button
                                onClick={handleUpload}
                                isLoading={uploading}
                                size="sm"
                            >
                                Upload Document
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h4 className="font-bold text-slate-700 text-sm mb-3">Recent Uploads</h4>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-slate-400" />
                            <span className="text-sm text-slate-600 font-medium">Vaccination_Record.pdf</span>
                        </div>
                        <span className="text-xs text-slate-400">Oct 12, 2025</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-slate-400" />
                            <span className="text-sm text-slate-600 font-medium">Allergy_Test.jpg</span>
                        </div>
                        <span className="text-xs text-slate-400">Sep 05, 2025</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DoctorUpload;
