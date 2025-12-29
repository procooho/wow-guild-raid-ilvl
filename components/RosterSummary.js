import { useState, useEffect } from "react";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

export default function RosterSummary({ roster }) {
    // --- State ---
    const [collapsed, setCollapsed] = useState({ TANK: false, HEALER: false, MELEEDPS: false, RANGEDPS: false });
    const [updatedRoster, setUpdatedRoster] = useState([]);
    const [loading, setLoading] = useState(false);

    // Custom Toast State
    const [toast, setToast] = useState({ show: false, message: "", type: "info" }); // type: success, error, info

    // --- Mappings ---
    const roles = ["TANK", "HEALER", "MELEEDPS", "RANGEDPS"];

    const classConfig = {
        "warrior": { label: "Warrior", icon: "/warrior.png", color: "text-[#C79C6E]" },
        "paladin": { label: "Paladin", icon: "/paladin.png", color: "text-[#F58CBA]" },
        "hunter": { label: "Hunter", icon: "/hunter.png", color: "text-[#ABD473]" },
        "rogue": { label: "Rogue", icon: "/rogue.png", color: "text-[#FFF569]" },
        "priest": { label: "Priest", icon: "/priest.png", color: "text-[#FFFFFF]" },
        "death knight": { label: "Death Knight", icon: "/deathknight.png", color: "text-[#C41F3B]" },
        "shaman": { label: "Shaman", icon: "/shaman.png", color: "text-[#0070DE]" },
        "mage": { label: "Mage", icon: "/mage.png", color: "text-[#40C7EB]" },
        "warlock": { label: "Warlock", icon: "/warlock.png", color: "text-[#8787ED]" },
        "monk": { label: "Monk", icon: "/monk.png", color: "text-[#00FF96]" },
        "druid": { label: "Druid", icon: "/druid.png", color: "text-[#FF7D0A]" },
        "demon hunter": { label: "Demon Hunter", icon: "/demonhunter.webp", color: "text-[#A330C9]" },
        "evoker": { label: "Evoker", icon: "/evoker.webp", color: "text-[#33937F]" },
    };

    const roleConfig = {
        TANK: { label: "TANK", icon: "/2.png" },
        HEALER: { label: "HEALER", icon: "/3.png" },
        MELEEDPS: { label: "MELEE DPS", icon: "/1.png" },
        RANGEDPS: { label: "RANGE DPS", icon: "/4.png" },
    };

    // --- Helpers ---
    const normalizeClass = (c) => c ? c.toString().trim().toLowerCase() : "unknown";

    const getClassData = (className) => {
        const key = normalizeClass(className);
        return classConfig[key] || { label: className, icon: "/unknown.png", color: "text-gray-400" };
    };

    // --- Effects ---
    useEffect(() => {
        if (roster) {
            setUpdatedRoster(roster);
            showToast("System initialized. Data loaded.", "info");
        }
    }, [roster]);

    // Toast Timer
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 5000); // 5 Seconds
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (message, type = "info") => {
        setToast({ show: true, message, type });
    };

    // --- Logic ---
    const toggleCollapse = (role) => setCollapsed((prev) => ({ ...prev, [role]: !prev[role] }));

    const groupedRaiders = roles.reduce((acc, role) => {
        // Simple case-insensitive match for roles if needed, currently assuming UPPERCASE in DB
        acc[role] = updatedRoster.filter((r) => r.role && r.role.trim().toUpperCase() === role);
        return acc;
    }, {});

    const classCounts = Object.keys(classConfig).reduce((acc, key) => {
        acc[key] = updatedRoster.filter((r) => normalizeClass(r.characterClass) === key).length;
        return acc;
    }, {});

    const averageIlvl = updatedRoster.length > 0
        ? updatedRoster.reduce((sum, r) => sum + (Number(r.currentIlvl) || 0), 0) / updatedRoster.length
        : 0;

    const fetchRosterItemLevels = async () => {
        setLoading(true);
        showToast("Initiating scan protocols...", "info");
        try {
            const res = await fetch("/api/rosterItemLevels");
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setUpdatedRoster(data);
            showToast("Scan complete. Roster updated.", "success");
        } catch (err) {
            console.error("Scan failed:", err);
            showToast("Scan failed. Connection interrupted.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-7xl mx-auto text-white">

            {/* Custom Toast Notification - Top Center */}
            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
                    <div className={`
                        flex items-center gap-3 px-6 py-3 border shadow-[0_0_20px_rgba(0,0,0,0.5)]
                        ${toast.type === 'success' ? 'bg-black border-green-500 text-green-400 shadow-green-500/20' : ''}
                        ${toast.type === 'error' ? 'bg-black border-red-500 text-red-400 shadow-red-500/20' : ''}
                        ${toast.type === 'info' ? 'bg-black border-blue-500 text-blue-400 shadow-blue-500/20' : ''}
                    `}
                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%, 0% 20%)" }}
                        onClick={() => setToast({ ...toast, show: false })}
                    >
                        {toast.type === 'success' && <CheckCircleIcon />}
                        {toast.type === 'error' && <ErrorIcon />}
                        {toast.type === 'info' && <InfoIcon />}
                        <span className="font-mono text-sm uppercase tracking-wider font-bold">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    Roster Analysis
                </h1>

                {/* Avg Ilvl HUD */}
                <div className="inline-flex flex-col items-center justify-center p-6 bg-black/40 border border-blue-500/30 relative group">
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500" />

                    <span className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-mono">Squadron Average</span>
                    <div className="text-5xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                        {averageIlvl.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-white/30 uppercase mt-2 w-48 leading-tight">
                        *Calculated based on max potential ilvl in inventory
                    </span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center mb-10">
                <button
                    onClick={fetchRosterItemLevels}
                    disabled={loading}
                    className={`
                        relative overflow-hidden group px-8 py-4 bg-blue-900/20 border border-blue-500/50 text-blue-200 
                        font-bold uppercase tracking-widest hover:bg-blue-500/20 hover:text-white transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                >
                    <div className="flex items-center gap-3 relative z-10">
                        <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? "Scanning Datalinks..." : "Refresh Protocol (Daily)"}</span>
                    </div>
                    {/* Button Scan Line Effect */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent group-hover:animate-shine pointer-events-none" />
                </button>
            </div>

            {/* Class Breakdown Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-8 p-2 bg-black/40 border-2 border-blue-500/30 mx-auto rounded-lg backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {Object.entries(classConfig).map(([key, config]) => {
                    const count = classCounts[key] || 0;
                    return (
                        <div
                            key={key}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                                ${count > 0 ? 'bg-black/60 border-blue-400/50 opacity-100 hover:bg-black/80 hover:border-cyan-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-transparent border-transparent opacity-20 blur-[1px] grayscale'}
                            `}
                        >
                            <Image src={config.icon} alt={config.label} width={32} height={32} className="mb-2 drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" />
                            <span className={`text-xl font-black font-mono ${config.color} drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]`}>{count}</span>
                            <span className="text-[12px] uppercase tracking-wider text-white/70 hidden sm:block font-bold mt-0.5">{config.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Role Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {roles.map((role) => (
                    <div key={role} className="flex flex-col bg-black/40 border border-blue-500/20 rounded-lg p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        {/* Role Header */}
                        <div
                            onClick={() => toggleCollapse(role)}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-blue-600/30 border border-blue-400/40 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 group relative overflow-hidden rounded-t-lg"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)" }}
                        >
                            <div className="flex items-center gap-3 z-10">
                                <div className="p-2 bg-black/70 rounded border-2 border-blue-400/60 group-hover:border-cyan-400 group-hover:bg-black/90 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                                    <Image src={roleConfig[role].icon} alt={role} width={24} height={24} className="group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-black text-white tracking-widest group-hover:text-cyan-200 transition-colors drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{roleConfig[role].label}</span>
                                    <span className="text-xs text-cyan-400 font-mono group-hover:text-cyan-300 transition-colors font-bold">COUNT: {groupedRaiders[role].length}</span>
                                </div>
                            </div>
                            <div className="z-10 text-cyan-400 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                                {collapsed[role] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                            </div>
                            {/* Bg Hover with animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/30 group-hover:to-cyan-500/20 transition-all duration-300" />
                            {/* Scanning line effect on hover */}
                            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent group-hover:animate-shine pointer-events-none" />
                        </div>

                        {/* Raider List */}
                        <div className={`
                            flex flex-col gap-1 mt-1 transition-all duration-300 origin-top
                            ${collapsed[role] ? 'max-h-0 opacity-0 overflow-hidden scale-y-95' : 'max-h-[800px] opacity-100 scale-y-100 overflow-y-auto custom-scrollbar'}
                        `}>
                            {groupedRaiders[role].map((raider) => {
                                const cData = getClassData(raider.characterClass);
                                return (
                                    <div
                                        key={raider.id}
                                        className="flex items-center justify-between p-3 bg-white/5 border-l-2 border-white/10 hover:bg-white/10 hover:border-blue-500 transition-all group/item"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Image src={cData.icon} alt={cData.label} width={20} height={20} className="opacity-80 group-hover/item:opacity-100" />
                                            <span className={`text-sm font-bold tracking-wide ${cData.color} drop-shadow-sm`}>
                                                {raider.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-white/30 font-mono tracking-widest uppercase group-hover/item:text-blue-300">ILVL</span>
                                            <span className="text-sm font-mono font-bold text-white group-hover/item:text-blue-200">
                                                {raider.currentIlvl || "---"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            {groupedRaiders[role].length === 0 && (
                                <div className="p-4 text-center text-xs text-white/20 italic border border-white/5 border-t-0">
                                    NO DATA DETECTED
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State / Loading Overlay if needed */}
            {!roster && (
                <div className="text-center text-white/50 mt-20 font-mono animate-pulse">
                    ESTABLISHING CONNECTION TO DATABASE...
                </div>
            )}
        </div>
    );
}
