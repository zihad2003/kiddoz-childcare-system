import React from 'react';
import { FileText, Plus, Edit, Trash } from 'lucide-react';
import Button from '../ui/Button';

const ContentManagement = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Content Management</h2>
                <Button variant="primary" className="flex items-center gap-2">
                    <Plus size={18} /> Add New Page
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 text-center text-slate-500 py-20">
                    <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Content Pages Found</h3>
                    <p className="max-w-md mx-auto">This module allows you to manage static pages, blog posts, and resources. Start by creating a new page.</p>
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
