import React from 'react';
import Card from '../ui/Card';
import Section from '../ui/Section';
import { ShieldCheck, Info, FileText, Lock } from 'lucide-react';

const InfoPage = ({ type }) => {
    const content = {
        privacy: {
            title: "Privacy Policy",
            icon: Lock,
            text: (
                <div className="space-y-4 text-slate-600">
                    <p>At KiddoZ, the privacy and security of yor child's data is our paramount concern. This policy outlines how we collect, use, and protect your information.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">1. Data Collection</h3>
                    <p>We collect biometric data (images) and health logs strictly for safety monitoring and daily reporting. All biometric templates are encrypted.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">2. CCTV & Monitoring</h3>
                    <p>Our LiveView YOLOv8 system processes video feeds locally in real-time to detect safety hazards. Feeds are not broadcast publicly.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">3. Data Sharing</h3>
                    <p>We do not sell personal data to third parties. Data is shared with medical professionals only in emergencies.</p>
                </div>
            )
        },
        terms: {
            title: "Terms of Service",
            icon: FileText,
            text: (
                <div className="space-y-4 text-slate-600">
                    <p>By using the KiddoZ platform, you agree to the following terms and conditions.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">1. Acceptance of Terms</h3>
                    <p>Accessing our services constitutes agreement to these terms. We reserve the right to update these terms at any time.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">2. Parent Responsibilities</h3>
                    <p>Parents are responsible for keeping their account credentials secure and providing accurate health information.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">3. Liability</h3>
                    <p>While we employ state-of-the-art AI safety, KiddoZ is an aid to, not a replacement for, professional human childcare supervision.</p>
                </div>
            )
        },
        help: {
            title: "Help Center",
            icon: Info,
            text: (
                <div className="space-y-4 text-slate-600">
                    <p>Need assistance? We are here to help you navigate the KiddoZ ecosystem.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">Getting Started</h3>
                    <p>Visit the 'Enroll' tab to register your child. Follow the guided AI setup to enable safety features.</p>
                    <h3 className="font-bold text-slate-800 text-lg mt-4">Technical Support</h3>
                    <p>For app issues, contact support@kiddoz.com. Our team typically responds within 24 hours.</p>
                </div>
            )
        },
        safety: {
            title: "Safety Protocols",
            icon: ShieldCheck,
            text: (
                <div className="space-y-4 text-slate-600">
                    <p>Our multi-layered safety approach ensures your peace of mind.</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li><strong>AI Monitoring:</strong> Continuous YOLOv8 tracking for fall detection and unauthorized exit alerts.</li>
                        <li><strong>Biometric Security:</strong> Facial recognition for authorized pick-up personnel.</li>
                        <li><strong>Health Screening:</strong> Daily temp and mood checks upon arrival.</li>
                        <li><strong>Emergency Response:</strong> Automatic alerts to parents and admin for critical incidents.</li>
                    </ul>
                </div>
            )
        }
    };

    const data = content[type] || content.help;

    return (
        <Section className="py-20 bg-slate-50 min-h-[60vh]">
            <div className="max-w-4xl mx-auto">
                <Card className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center gap-4 mb-8 border-b border-primary-100 pb-6">
                        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                            <data.icon size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{data.title}</h1>
                    </div>
                    <div className="prose prose-purple max-w-none">
                        {data.text}
                    </div>
                </Card>
            </div>
        </Section>
    );
};

export default InfoPage;
