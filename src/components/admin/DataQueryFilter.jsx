import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc, Search, LayoutList, Grip } from 'lucide-react';

const DataQueryFilter = ({ onFilterChange, onSortChange, onLayoutChange }) => {
    const [filterConfig, setFilterConfig] = useState({
        status: 'All',
        payment: 'All',
        grade: 'All',
        minAge: '',
        maxAge: ''
    });

    const [sortConfig, setSortConfig] = useState({
        field: 'name',
        direction: 'asc'
    });

    const handleFilterUpdate = (key, value) => {
        const newConfig = { ...filterConfig, [key]: value };
        setFilterConfig(newConfig);
        onFilterChange(newConfig);
    };

    const handleSortUpdate = (field) => {
        const newDirection = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const newConfig = { field, direction: newDirection };
        setSortConfig(newConfig);
        onSortChange(newConfig);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Filter size={18} />
                    <span>Advanced Filters</span>
                </div>
                {/* Visual Toggle for future use if grid/list view is implemented */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="p-2 rounded hover:bg-white shadow-sm transition"><LayoutList size={16} /></button>
                    <button className="p-2 rounded hover:bg-white shadow-sm transition"><Grip size={16} /></button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <select
                    className="p-2 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-purple-200"
                    onChange={(e) => handleFilterUpdate('status', e.target.value)}
                >
                    <option value="All">All Attendance</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                </select>

                <select
                    className="p-2 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-purple-200"
                    onChange={(e) => handleFilterUpdate('payment', e.target.value)}
                >
                    <option value="All">All Payment Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                </select>

                <select
                    className="p-2 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-purple-200"
                    onChange={(e) => handleFilterUpdate('grade', e.target.value)}
                >
                    <option value="All">All Grades</option>
                    <option value="Daycare">Daycare</option>
                    <option value="Preschool">Preschool</option>
                    <option value="Nursery">Nursery</option>
                    <option value="KG-1">KG-1</option>
                    <option value="KG-2">KG-2</option>
                </select>

                <input
                    type="number"
                    placeholder="Min Age"
                    className="p-2 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-purple-200"
                    onChange={(e) => handleFilterUpdate('minAge', e.target.value)}
                />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 items-center overflow-x-auto">
                <span className="text-xs font-bold uppercase text-slate-400 mr-2 whitespace-nowrap">Sort By:</span>
                {['name', 'age', 'attendance', 'paymentStatus'].map(field => (
                    <button
                        key={field}
                        onClick={() => handleSortUpdate(field)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${sortConfig.field === field ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                    >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                        {sortConfig.field === field && (
                            sortConfig.direction === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DataQueryFilter;
