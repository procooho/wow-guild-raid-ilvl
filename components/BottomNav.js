import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import HomeIcon from '@mui/icons-material/Home';
import VideocamIcon from '@mui/icons-material/Videocam';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // For "Whoosh" arrow

// Button Component
const NavButton = ({ label, icon: Icon, onClick, active, onMouseEnter, onMouseLeave }) => (
    <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
            relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-20 h-20
            ${active ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-white/50 hover:bg-white/5 hover:text-white hover:scale-105 active:scale-95'}
        `}
    >
        <Icon className="w-12 h-12 mb-2" />
        <span className="text-[12px] uppercase tracking-widest font-bold">{label}</span>
        {/* Active Indicator */}
        {active && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />}
    </button>
);

const BottomNav = () => {
    const router = useRouter();
    const [expanded, setExpanded] = useState(false); // Mobile state
    const [hoverText, setHoverText] = useState("");
    const [notices, setNotices] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [avgIlvl, setAvgIlvl] = useState(0);
    const [lastUpdate, setLastUpdate] = useState(null);
    const { loggedIn } = useAuth();

    useEffect(() => {
        // Fetch Notices
        fetch('/api/notice')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setNotices(data);
                }
            })
            .catch(err => console.error("Failed to fetch notices:", err));

        // Fetch Roster for Avg Ilvl
        // Using logic from RosterSummary.js
        fetch('/api/roster')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const totalIlvl = data.reduce((sum, raider) => sum + (raider.currentIlvl || raider.ilvl || 0), 0);
                    const avg = totalIlvl / data.length;
                    setAvgIlvl(avg.toFixed(2));
                    setLastUpdate(new Date().toLocaleDateString());
                }
            })
            .catch(err => console.error("Failed to fetch roster:", err));
    }, []);

    // Rotate notices
    useEffect(() => {
        if (notices.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % notices.length);
        }, 3000); // Rotate every 3 seconds

        return () => clearInterval(interval);
    }, [notices]);

    const currentNotice = notices[currentIndex];

    const isActive = (path) => router.pathname === path;

    // Tooltip messages
    const messages = {
        notice: "Check Raid Schedules & Rules",
        roster: "Current Raider Stats",
        video: "Watch Replays & Logs",
        manage: "Officer Login & Management"
    };

    return (
        <>
            {/* Desktop HUD */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-end gap-6 origin-bottom">
                <div className="flex items-end gap-6 animate-slide-up origin-bottom">
                    {/* Main Controller Bar */}
                    <div className="relative bg-black/60 border border-blue-500/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-5 px-8 py-4
                                    before:absolute before:inset-0 before:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] before:opacity-10 before:pointer-events-none
                                    "
                        style={{
                            borderRadius: "0 0 12px 12px"
                        }}
                    >
                        {/* Top Decoration Line */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                        {/* Left: Avg Ilvl Section */}
                        <div className="flex flex-col w-32 h-full justify-center space-y-1 mr-2 relative group">
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-blue-500/50 group-hover:bg-blue-400 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <div className="flex flex-col items-start pb-1">
                                <span className="text-[11px] text-blue-200 uppercase tracking-[0.2em] font-extrabold mb-1 flex items-center gap-2 drop-shadow-md">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-sm animate-pulse shadow-[0_0_5px_#60a5fa]" />
                                    Avg Ilvl
                                </span>
                                <span className="text-3xl font-black text-white font-mono leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                                    {avgIlvl > 0 ? avgIlvl : <span className="text-white/20">---</span>}
                                </span>
                            </div>
                            <span className="text-[10px] text-blue-200/70 font-mono tracking-wider font-bold">
                                UPDATED: <span className="text-white">{lastUpdate || "SYNC..."}</span>
                            </span>
                        </div>

                        {/* Separator */}
                        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent shadow-[0_0_5px_rgba(96,165,250,0.5)]" />

                        {/* Center Left: Home Button (Large) */}
                        <button
                            onClick={() => router.push('/')}
                            onMouseEnter={() => setHoverText("Return to Home")}
                            onMouseLeave={() => setHoverText("")}
                            className={`
                                w-20 h-20 flex items-center justify-center transition-all duration-300 group relative
                                ${isActive('/')
                                    ? 'shadow-[0_0_40px_rgba(37,99,235,0.6)]'
                                    : ''}
                            `}
                            style={{
                                clipPath: "polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)"
                            }}
                        >
                            <div className={`absolute inset-0 transition-colors duration-300 ${isActive('/') ? 'bg-blue-600' : 'bg-white/5 hover:bg-white/10'}`} />

                            {/* Inner Border */}
                            <div className="absolute inset-[1px] bg-black/40" style={{ clipPath: "polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%)" }} />

                            {/* Icon */}
                            <HomeIcon sx={{ fontSize: 36 }} className={`relative z-10 transition-transform duration-300 ${isActive('/') ? 'text-white scale-110 drop-shadow-[0_0_15px_white]' : 'text-white/70 group-hover:text-white group-hover:scale-105'}`} />
                        </button>

                        {/* Separator - Tech Line */}
                        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent shadow-[0_0_5px_rgba(96,165,250,0.5)]" />

                        {/* Center Right: Row of Buttons */}
                        <div className="flex gap-1 relative">
                            {/* Tooltip Display - Positioning Above HUD */}
                            {hoverText && (
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black/90 text-blue-200 text-[11px] font-mono uppercase tracking-[0.1em] font-bold px-4 py-1.5 border border-blue-500/50 whitespace-nowrap pointer-events-none animate-fade-in z-50 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-sm"
                                    style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}>
                                    {hoverText}
                                </div>
                            )}

                            <NavButton
                                label="Notice"
                                icon={CampaignIcon}
                                onClick={() => router.push('/raidNotice')}
                                active={isActive('/raidNotice')}
                                onMouseEnter={() => setHoverText(messages.notice)}
                                onMouseLeave={() => setHoverText("")}
                            />
                            <NavButton
                                label="Roster"
                                icon={GroupIcon}
                                onClick={() => router.push('/rosterSummaryPage')}
                                active={isActive('/rosterSummaryPage')}
                                onMouseEnter={() => setHoverText(messages.roster)}
                                onMouseLeave={() => setHoverText("")}
                            />
                            <NavButton
                                label="Video"
                                icon={VideocamIcon}
                                onClick={() => router.push('/raidLogCommon')}
                                active={isActive('/raidLogCommon')}
                                onMouseEnter={() => setHoverText(messages.video)}
                                onMouseLeave={() => setHoverText("")}
                            />
                            <NavButton
                                label={loggedIn ? "MANAGE" : "LOGIN"}
                                icon={LoginIcon}
                                onClick={() => router.push(loggedIn ? '/manage' : '/login')}
                                active={isActive(loggedIn ? '/manage' : '/login') || isActive('/login')}
                                onMouseEnter={() => setHoverText(loggedIn ? "Access Dashboard" : messages.manage)}
                                onMouseLeave={() => setHoverText("")}
                            />
                            {/* Login Indicator */}
                            {loggedIn && <div className="absolute top-2 right-4 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse pointer-events-none" />}
                        </div>

                        {/* Separator */}
                        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent shadow-[0_0_5px_rgba(96,165,250,0.5)]" />

                        {/* Right: Notices Section */}
                        <div className="flex flex-col w-75 h-full justify-center space-y-1 relative pl-4">
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

                            <div className="flex justify-between items-center pb-1 border-b border-white/10">
                                <span className="text-[13px] text-blue-200 uppercase tracking-[0.2em] font-extrabold drop-shadow-md">Latest Comms</span>
                                <span className="text-[11px] text-white/90 uppercase tracking-widest font-mono bg-blue-900/40 border border-blue-500/30 px-2 py-0.5 rounded-sm shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                                    {currentNotice ? new Date(currentNotice.createdAt).toLocaleDateString() : "NO DATA"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-sm text-white font-bold tracking-wide truncate font-sans w-[220px] animate-fade-in drop-shadow-md" title={currentNotice?.title}>
                                    {currentNotice ? currentNotice.title : <span className="text-white/40 italic">Searching frequency...</span>}
                                </span>
                                <button
                                    onClick={() => router.push('/raidNotice')}
                                    className="w-8 h-8 flex items-center justify-center text-blue-400 transition-all hover:text-white hover:scale-110 active:scale-90"
                                >
                                    <ArrowForwardIosIcon sx={{ fontSize: 18 }} className="drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                                </button>
                            </div>
                        </div>

                    </div>
                    {/* Fineprint - Desktop */}
                    <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-[500px] text-center whitespace-nowrap">
                        <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
                            Made by Angrybites - Tichondrius
                        </span>
                    </div>
                </div>
            </div>


            {/* Mobile Bottom Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 flex lg:hidden flex-col items-center transition-all duration-300 ${expanded ? 'translate-y-0' : 'translate-y-0'}`}>

                {/* Collapsed/Persistent Bar */}
                <div className="w-full bg-black/80 backdrop-blur-xl border-t border-blue-500/30 px-6 py-4 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">

                    {/* Left: Mobile Avg Ilvl */}
                    <div className="flex flex-col">
                        <span className="text-[9px] text-blue-300 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                            Avg Ilvl
                        </span>
                        <span className="text-xl font-black text-white font-mono leading-none tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                            {avgIlvl > 0 ? avgIlvl : "---"}
                        </span>
                    </div>

                    {/* Center: Mobile Fineprint */}
                    <div className="flex flex-col items-center justify-center opacity-80">
                        <span className="text-[8px] text-white/30 font-mono uppercase tracking-widest text-center leading-tight">
                            Made by Angrybites<br />Tichondrius
                        </span>
                    </div>

                    {/* Right: Menu Toggle */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`
                            relative group overflow-hidden px-5 py-2 transition-all duration-300
                            ${expanded
                                ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30'}
                        `}
                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                    >
                        {/* Inner Tech Lines */}
                        <div className={`absolute top-0 right-0 w-[2px] h-3 bg-blue-400/50 transition-all ${expanded ? 'bg-white' : ''}`} />
                        <div className={`absolute bottom-0 left-0 w-[2px] h-3 bg-blue-400/50 transition-all ${expanded ? 'bg-white' : ''}`} />

                        <div className="flex items-center gap-2 relative z-10">
                            <span className={`text-[10px] uppercase font-bold tracking-[0.2em] ${expanded ? 'text-white' : 'text-blue-200'}`}>
                                {expanded ? 'CLOSE' : 'MENU'}
                            </span>
                            <KeyboardArrowUpIcon
                                sx={{ fontSize: 18 }}
                                className={`transition-transform duration-500 ${expanded ? 'rotate-180 text-white' : 'text-blue-400 group-hover:-translate-y-0.5'}`}
                            />
                        </div>
                    </button>
                </div>

                {/* Expanded Content */}
                <div className={`w-full bg-black/95 border-t border-blue-500/30 overflow-hidden transition-all duration-300 ease-out origin-bottom backdrop-blur-2xl
                                ${expanded ? 'max-h-[500px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}
                >
                    <div className="flex flex-col gap-3 px-6 pb-6">
                        {/* Menu Header */}
                        <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] text-blue-500 uppercase tracking-[0.3em] font-bold">Navigation Systems</span>
                            <div className="w-16 h-[1px] bg-blue-500/30" />
                        </div>

                        {/* Tech Menu Items */}
                        {[
                            { label: 'HOME', icon: HomeIcon, path: '/' },
                            { label: 'RAID NOTICE', icon: CampaignIcon, path: '/raidNotice' },
                            { label: 'ROSTER SUMMARY', icon: GroupIcon, path: '/rosterSummaryPage' },
                            { label: 'COMBAT LOGS', icon: VideocamIcon, path: '/raidLogCommon' },
                            { label: loggedIn ? 'MANAGE DASHBOARD' : 'ADMIN ACCESS', icon: LoginIcon, path: loggedIn ? '/manage' : '/login' },
                        ].map((item, index) => (
                            <button
                                key={item.path}
                                onClick={() => { router.push(item.path); setExpanded(false); }}
                                className="group relative flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 overflow-hidden hover:bg-blue-900/20 hover:border-blue-500/50 transition-all duration-300 active:scale-[0.98]"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 80%, 95% 100%, 0 100%)" }}
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Active Indicator Bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${router.pathname === item.path ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-500/50'}`} />

                                <div className="flex items-center gap-4 relative z-10">
                                    <item.icon className={`w-5 h-5 ${router.pathname === item.path ? 'text-blue-400' : 'text-white/50 group-hover:text-white'}`} />
                                    <span className={`text-sm font-bold tracking-widest ${router.pathname === item.path ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                        {item.label}
                                    </span>
                                </div>

                                {/* Right Arrow */}
                                <ArrowForwardIosIcon className="w-3 h-3 text-white/20 group-hover:text-blue-400 transition-colors" />
                            </button>
                        ))}
                    </div>

                    {/* Mobile Notices Snippet */}
                    <div className="mx-6 border-t border-white/10 pt-4 relative">
                        {/* Corner Accent */}
                        <div className="absolute top-4 right-0 w-2 h-2 border-t border-r border-blue-500/50" />

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Incoming Transmission</span>
                            <span className="text-[9px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                                {currentNotice ? new Date(currentNotice.createdAt).toLocaleDateString() : "OFFLINE"}
                            </span>
                        </div>
                        <p className="text-sm text-white/90 truncate font-bold font-mono pl-2 border-l-2 border-blue-500/30">
                            {currentNotice ? currentNotice.title : "No recent communications"}
                        </p>
                    </div>

                </div>
            </div>


        </>
    );
};

export default BottomNav;
