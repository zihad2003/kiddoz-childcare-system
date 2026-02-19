import React from 'react';
import { Book, Video, Download, ExternalLink, FileText } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const RESOURCES = [
    {
        category: 'Nutrition',
        title: 'Healthy Lunchbox Ideas',
        type: 'article',
        readTime: '5 min read',
        icon: Book,
        color: 'bg-emerald-100 text-emerald-600',
        link: '#'
    },
    {
        category: 'Development',
        title: 'Milestones: Ages 3-5',
        type: 'pdf',
        size: '1.2 MB',
        icon: FileText,
        color: 'bg-blue-100 text-blue-600',
        link: '#'
    },
    {
        category: 'Activities',
        title: 'Weekend Sensory Play',
        type: 'video',
        duration: '10:05',
        icon: Video,
        color: 'bg-primary-100 text-primary-600',
        link: '#'
    },
    {
        category: 'Health',
        title: 'Flu Season Guidelines',
        type: 'pdf',
        size: '800 KB',
        icon: FileText,
        color: 'bg-rose-100 text-rose-600',
        link: '#'
    }
];

const ResourceTab = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Parent Resources</h2>
                <Badge color="bg-primary-100 text-primary-700">New Content Weekly</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {RESOURCES.map((resource, i) => (
                    <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary-500 cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-xl ${resource.color}`}>
                                <resource.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">{resource.category}</span>
                                    <ExternalLink size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">{resource.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    {resource.type === 'pdf' ? (
                                        <span className="flex items-center gap-1"><Download size={14} /> {resource.size}</span>
                                    ) : resource.type === 'video' ? (
                                        <span className="flex items-center gap-1"><Video size={14} /> {resource.duration}</span>
                                    ) : (
                                        <span className="flex items-center gap-1"><Book size={14} /> {resource.readTime}</span>
                                    )}
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="capitalize">{resource.type}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 mt-8 p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">Need a specific guide?</h3>
                        <p className="text-primary-100">Ask our AI Assistant to find resources for you.</p>
                    </div>
                    <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition shadow-lg">
                        Ask AI Assistant
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Book size={200} />
                </div>
            </Card>
        </div>
    );
};

export default ResourceTab;
