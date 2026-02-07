import React from 'react';

// === SUB-COMPONENTS ===

/**
 * HeroAttendanceCard
 * A large, high-impact card showing daily attendance metrics.
 * Uses bento-xl (8 cols, 4 rows)
 */
export const HeroAttendanceCard = () => {
    return (
        <div
            className="bento-xl bento-card group"
            style={{
                background: 'var(--gradient-primary)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Pattern Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 2px, transparent 0)`,
                backgroundSize: '40px 40px',
                opacity: 0.4
            }} className="animate-pulse" />

            {/* Content */}
            <div className="bento-card-content" style={{ color: 'white' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                    }} className="group-hover:rotate-12 transition-transform">
                        👥
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.9 }}>
                            TODAY'S ATTENDANCE
                        </div>
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>
                            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Main Metric */}
                <div style={{
                    fontSize: '84px',
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: '12px',
                    textShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }} className="tracking-tighter font-display">
                    87%
                </div>

                <div style={{ fontSize: '18px', opacity: 0.95, marginBottom: '32px', fontWeight: 500 }}>
                    124 out of 142 children present
                </div>

                {/* Progress Bar */}
                <div className="mt-auto">
                    <div style={{
                        width: '100%',
                        height: '10px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '5px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '87%',
                            height: '100%',
                            background: 'linear-gradient(90deg, #FFD93D 0%, #6EDDC5 100%)',
                            boxShadow: '0 0 20px rgba(255,217,61,0.6)',
                            transition: 'width 1s cubic-bezier(0.4, 0.0, 0.2, 1)'
                        }} />
                    </div>
                    <p className="text-[10px] mt-2 opacity-60 font-bold uppercase tracking-widest text-right">System Optimal</p>
                </div>
            </div>

            {/* Decorative Glow */}
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                filter: 'blur(60px)'
            }} />
        </div>
    );
};

/**
 * StatCard
 * Medium sized card for individual metrics.
 * Uses bento-md (4 cols, 3 rows)
 */
export const StatCard = ({ title, value, change, changeType, icon, gradient }) => {
    return (
        <div className="bento-md bento-card group">
            {/* Gradient Top Bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: gradient
            }} />

            <div className="bento-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Left Side */}
                    <div>
                        <div style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '16px'
                        }}>
                            {title}
                        </div>

                        <div style={{
                            fontSize: '48px',
                            fontWeight: 800,
                            background: gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: 1,
                            marginBottom: '12px'
                        }} className="font-display">
                            {value}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`px-2 py-0.5 rounded-full text-[12px] font-black ${changeType === 'increase' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {changeType === 'increase' ? '↑' : '↓'} {change}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                                vs last month
                            </span>
                        </div>
                    </div>

                    {/* Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }} className="group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * QuickActionButton
 * Small square card for CTA actions.
 * Uses bento-xs (2 cols, 2 rows)
 */
export const QuickActionButton = ({ icon, label, gradient, onClick }) => {
    return (
        <div
            className="bento-xs bento-card group active:scale-95 cursor-pointer"
            onClick={onClick}
            style={{
                background: gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
                gap: '12px',
                boxShadow: 'var(--shadow-colored)',
                border: 'none'
            }}
        >
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
            }} className="group-hover:rotate-12 transition-transform shadow-lg">
                {icon}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {label}
            </span>
        </div>
    );
};

/**
 * ActivityItem
 * Single row for activity lists.
 */
export const ActivityItem = ({ icon, title, time, room, color }) => {
    return (
        <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-slate-100 hover:translate-x-2 transition-all hover:shadow-xl cursor-pointer group">
            {/* Icon */}
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '1.25rem',
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: `0 12px 24px ${color}30`
            }} className="group-hover:scale-110 transition-transform">
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h4 className="text-[15px] font-black text-slate-800 mb-0.5">{title}</h4>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{room}</p>
            </div>

            {/* Time Badge */}
            <div style={{
                fontSize: '12px',
                fontWeight: 900,
                color: color,
                padding: '8px 16px',
                borderRadius: '12px',
                background: `${color}10`
            }}>
                {time}
            </div>
        </div>
    );
};

export const SystemBoard = () => {
    return (
        <div
            className="bento-xl bento-card group"
            style={{
                background: 'var(--bg-dark)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255,255,255,0.05) 1px, transparent 0)`,
                backgroundSize: '24px 24px',
                opacity: 1
            }} />
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #CF9893 0%, #6968A6 100%)',
                boxShadow: '0 10px 40px rgba(105,104,166,0.4)'
            }} />
            <div className="bento-card-content">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div className="rounded-2xl bg-slate-800/50 border border-white/10 p-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</div>
                        <div className="mt-2 text-2xl font-black text-white tracking-tight">Trace</div>
                    </div>
                    <div className="rounded-2xl bg-slate-800/50 border border-white/10 p-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</div>
                        <div className="mt-2 text-2xl font-black text-white tracking-tight">Index</div>
                    </div>
                    <div className="rounded-2xl bg-slate-800/50 border border-white/10 p-6">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway</div>
                        <div className="mt-2 text-2xl font-black text-white tracking-tight">Sync</div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-4">
                    {[0,1,2,3].map(i => (
                        <div key={i} className="rounded-2xl bg-slate-800/50 border border-white/10 p-6 h-24" />
                    ))}
                </div>
            </div>
        </div>
    );
};

// === MAIN DASHBOARD ===

const BentoDashboard = () => {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-bg-dark tracking-tighter mb-2">
                        Guardian <span className="text-primary-purple">Ecosystem</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">AI-Driven Childcare Management</p>
                </header>

                <div className="bento-grid !p-0">
                    <SystemBoard />
                    <HeroAttendanceCard />

                    {/* Stats */}
                    <StatCard
                        title="Total Children"
                        value="142"
                        change="8%"
                        changeType="increase"
                        icon="👶"
                        gradient="var(--gradient-primary)"
                    />

                    {/* Quick Actions */}
                    <QuickActionButton
                        icon="✅"
                        label="Check In"
                        gradient="var(--gradient-secondary)"
                        onClick={() => console.log('Check in')}
                    />

                    <QuickActionButton
                        icon="➕"
                        label="New Child"
                        gradient="var(--gradient-warm)"
                        onClick={() => console.log('New child')}
                    />

                    {/* Activity Feed */}
                    <div className="bento-lg bento-card">
                        <div className="bento-card-content">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '32px'
                            }}>
                                <h3 className="text-2xl font-black text-bg-dark tracking-tighter">
                                    Active Ecosystem
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live Trace</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <ActivityItem icon="🎨" title="Canvas & Creativity" time="10:30 AM" room="Oceanic Studio" color="#FF6B9D" />
                                <ActivityItem icon="🍎" title="Nutrient Break" time="11:00 AM" room="Central Hub" color="#FFD93D" />
                                <ActivityItem icon="📚" title="Knowledge Session" time="02:00 PM" room="Discovery Lab" color="#6CB4EE" />
                            </div>

                            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-200">
                                View Full Schedule
                            </button>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <StatCard
                        title="Health Index"
                        value="98%"
                        change="2.4%"
                        changeType="increase"
                        icon="🏥"
                        gradient="var(--gradient-warm)"
                    />

                    <QuickActionButton
                        icon="📄"
                        label="Reports"
                        gradient="var(--gradient-soft)"
                        onClick={() => console.log('Reports')}
                    />

                    <QuickActionButton
                        icon="⚙️"
                        label="Settings"
                        gradient="var(--gradient-primary)"
                        onClick={() => console.log('Settings')}
                    />
                </div>
            </div>
        </div>
    );
};

export default BentoDashboard;
