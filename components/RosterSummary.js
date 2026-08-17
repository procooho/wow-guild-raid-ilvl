import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import ShieldIcon from '@mui/icons-material/Shield';

const utilityBuffs = [
    { name: "Arcane Intellect", class: "Mage", benefit: "+5% Intellect", icon: "/mage.png", classKey: "mage", category: "core" },
    { name: "Power Word: Fortitude", class: "Priest", benefit: "+5% Stamina", icon: "/priest.png", classKey: "priest", category: "core" },
    { name: "Battle Shout", class: "Warrior", benefit: "+5% Attack Power", icon: "/warrior.png", classKey: "warrior", category: "core" },
    { name: "Mark of the Wild", class: "Druid", benefit: "+3% Versatility & Resistances", icon: "/druid.png", classKey: "druid", category: "core" },
    { name: "Chaos Brand", class: "Demon Hunter", benefit: "+5% Magic Damage Taken", icon: "/demonhunter.webp", classKey: "demon hunter", category: "core" },
    { name: "Mystic Touch", class: "Monk", benefit: "+5% Physical Damage Taken", icon: "/monk.png", classKey: "monk", category: "core" },
    { name: "Blessing of the Bronze", class: "Evoker", benefit: "+Cooldown Reduction", icon: "/evoker.webp", classKey: "evoker", category: "core" },
    { name: "Devotion Aura", class: "Paladin", benefit: "+3% Damage Reduction", icon: "/paladin.png", classKey: "paladin", category: "core" },
    
    // Secondary Support Utilities & Major Raid Cooldowns
    { name: "Bloodlust / Heroism", class: "Lust Class", benefit: "+30% Haste Raid Cooldown", icon: "/shaman.png", customCheck: (counts) => counts["shaman"] > 0 || counts["mage"] > 0 || counts["hunter"] > 0 || counts["evoker"] > 0, category: "utility" },
    { name: "Windfury / Skyfury", class: "Shaman", benefit: "Melee / Critical & Mastery Buff", icon: "/shaman.png", classKey: "shaman", category: "utility" },
    { name: "Healthstone / Gateway", class: "Warlock", benefit: "Consumables & Raid Gateways", icon: "/warlock.png", classKey: "warlock", category: "utility" },
    { name: "Hunter's Mark", class: "Hunter", benefit: "+5% Damage (above 80% HP)", icon: "/hunter.png", classKey: "hunter", category: "utility" },
    { name: "Atrophic Poison", class: "Rogue", benefit: "-3% Target Damage Dealt", icon: "/rogue.png", classKey: "rogue", category: "utility" },
    { name: "Anti-Magic Zone", class: "Death Knight", benefit: "Raid Magic Damage Shield", icon: "/deathknight.png", classKey: "death knight", category: "utility" },
    { name: "Aura Mastery", class: "Paladin", benefit: "Raid Damage Reduction CD", icon: "/paladin.png", classKey: "paladin", category: "utility" },
    { name: "Rallying Cry", class: "Warrior", benefit: "+10% Raid Health Cooldown", icon: "/warrior.png", classKey: "warrior", category: "utility" },
    { name: "Darkness", class: "Demon Hunter", benefit: "20% Avoid Damage Cooldown", icon: "/demonhunter.webp", classKey: "demon hunter", category: "utility" },
    { name: "Spirit Link / Tide", class: "Shaman", benefit: "Raid Healing Cooldowns", icon: "/shaman.png", classKey: "shaman", category: "utility" },
    { name: "Stampeding Roar", class: "Druid", benefit: "+60% Speed Raid Cooldown", icon: "/druid.png", classKey: "druid", category: "utility" },
    { name: "Revival / Cocoon", class: "Monk", benefit: "Raid Healing & Cleanse CD", icon: "/monk.png", classKey: "monk", category: "utility" },
    { name: "Rewind / Zephyr", class: "Evoker", benefit: "AoE Healing & Avoid CDs", icon: "/evoker.webp", classKey: "evoker", category: "utility" },
    { name: "Symbol of Hope", class: "Priest", benefit: "Raid Mana & CD Recovery", icon: "/priest.png", classKey: "priest", category: "utility" }
];

export default function RosterSummary({ roster }) {
    const router = useRouter();
    const { loggedIn } = useAuth();

    const handleRedirectToAudit = () => {
        if (loggedIn) {
            localStorage.setItem('managePageTab', 'audit');
            router.push('/manage');
        }
    };

    // --- State ---
    const [collapsed, setCollapsed] = useState({ TANK: false, HEALER: false, MELEEDPS: false, RANGEDPS: false });
    const [showCore, setShowCore] = useState(false);
    const [showUtilities, setShowUtilities] = useState(false);
    const [updatedRoster, setUpdatedRoster] = useState([]);
    const [rawChartData, setRawChartData] = useState([]);
    const [timeRange, setTimeRange] = useState("1M");
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

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/rosterHistory");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRawChartData(data);
                }
            } catch (err) {
                console.error("Failed to fetch roster history:", err);
            }
        };
        fetchHistory();
    }, []);

    // Filter chart data by selected time range
    const filteredChartData = useMemo(() => {
        if (!rawChartData || rawChartData.length === 0) return [];
        if (timeRange === "ALL") return rawChartData;

        const cutoffDate = new Date();
        if (timeRange === "2W") {
            cutoffDate.setDate(cutoffDate.getDate() - 14);
        } else if (timeRange === "1M") {
            cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        } else if (timeRange === "3M") {
            cutoffDate.setMonth(cutoffDate.getMonth() - 3);
        } else if (timeRange === "1Y") {
            cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        } else {
            return rawChartData;
        }

        return rawChartData.filter(item => {
            const itemDate = new Date(item.fullDate + "T00:00:00");
            return itemDate >= cutoffDate;
        });
    }, [rawChartData, timeRange]);

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
        showToast("Refreshing roster...", "info");
        try {
            const res = await fetch("/api/rosterItemLevels");
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setUpdatedRoster(data);
            showToast("Roster updated successfully.", "success");
        } catch (err) {
            console.error("Refresh failed:", err);
            showToast("Failed to refresh roster.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Calculate Core Buffs stats
    const coreBuffs = utilityBuffs.filter(b => b.category === "core");
    const coveredCore = coreBuffs.filter(b => b.customCheck ? b.customCheck(classCounts) : classCounts[b.classKey] > 0);
    const missingCore = coreBuffs.filter(b => !(b.customCheck ? b.customCheck(classCounts) : classCounts[b.classKey] > 0));
    const coreCountStr = `${coveredCore.length}/${coreBuffs.length}`;
    const coreSummary = missingCore.length === 0 
        ? "ALL ACTIVE" 
        : `MISSING: ${missingCore.map(b => b.name.split(" / ")[0]).join(", ")}`;

    // Calculate Secondary Utilities stats
    const utilityBuffsList = utilityBuffs.filter(b => b.category === "utility");
    const coveredUtilities = utilityBuffsList.filter(b => b.customCheck ? b.customCheck(classCounts) : classCounts[b.classKey] > 0);
    const utilityCountStr = `${coveredUtilities.length}/${utilityBuffsList.length}`;
    const utilityNames = coveredUtilities.map(b => b.name.split(" / ")[0]);
    const utilitySummary = utilityNames.length === 0 
        ? "NONE AVAILABLE" 
        : `AVAILABLE: ${utilityNames.join(", ")}`;

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

                    <span className="text-xs text-blue-400 uppercase tracking-widest mb-2 font-mono">Raid Average</span>
                    <div className="text-5xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                        {averageIlvl.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-white/30 uppercase mt-2 w-48 leading-tight">
                        *Calculated based on max potential ilvl in inventory
                    </span>
                </div>

                {/* Avg History Chart */}
                {rawChartData.length > 1 && (
                    <div className="max-w-4xl mx-auto mt-8 p-4 bg-black/50 border border-white/5 rounded-sm relative z-10 w-full h-[320px] md:h-[380px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pl-2 border-l-2 border-blue-500">
                            <span className="text-xs text-blue-300 font-black uppercase tracking-widest text-left">
                                Raid Average History
                            </span>
                            
                            {/* Date Filter Buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {[
                                    { label: "2 WEEKS", value: "2W" },
                                    { label: "1 MONTH", value: "1M" },
                                    { label: "3 MONTHS", value: "3M" },
                                    { label: "1 YEAR", value: "1Y" },
                                    { label: "ALL", value: "ALL" }
                                ].map((r) => {
                                    const isActive = timeRange === r.value;
                                    return (
                                        <button
                                            key={r.value}
                                            onClick={() => setTimeRange(r.value)}
                                            className={`
                                                relative px-3 py-1.5 text-[10px] tracking-wider uppercase font-mono transition-all duration-200
                                                border select-none outline-none overflow-hidden active:scale-95 active:translate-y-[1px]
                                                ${isActive 
                                                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                                                    : 'bg-blue-950/20 border-blue-900/40 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500 hover:text-white'
                                                }
                                            `}
                                            style={{
                                                clipPath: "polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)"
                                            }}
                                        >
                                            <div className="flex items-center gap-1.5 z-10 relative">
                                                {/* Glowing LED Dot */}
                                                <span className={`
                                                    w-1.5 h-1.5 rounded-full transition-all duration-300
                                                    ${isActive 
                                                        ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse' 
                                                        : 'bg-transparent border border-blue-800'
                                                    }
                                                `} />
                                                <span className="font-bold">{r.label}</span>
                                            </div>
                                            
                                            {/* Sheen animation indicator */}
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent translate-x-[-100%] hover:animate-shine pointer-events-none" />
                                            
                                            {/* Active Glow Accent underlay */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)] pointer-events-none" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="w-full h-[calc(100%-3.5rem)]">
                            {filteredChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={filteredChartData}>
                                        <XAxis
                                            dataKey="date"
                                            stroke="#4b5563"
                                            fontSize={10}
                                            tickMargin={8}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            domain={['dataMin - 1', 'dataMax + 1']}
                                            stroke="#4b5563"
                                            fontSize={10}
                                            tickMargin={8}
                                            tickLine={false}
                                            axisLine={false}
                                            width={40}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '4px' }}
                                            itemStyle={{ color: '#60a5fa', fontSize: '12px', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#9ca3af', fontSize: '10px', marginBottom: '4px' }}
                                            cursor={{ stroke: 'rgba(59,130,246,0.2)', strokeWidth: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="ilvl"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ r: 3, fill: '#000', stroke: '#3b82f6', strokeWidth: 2 }}
                                            activeDot={{ r: 5, fill: '#60a5fa', stroke: '#fff' }}
                                            isAnimationActive={true}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center border border-dashed border-blue-500/20 bg-black/30 rounded-sm">
                                    <span className="font-mono text-xs text-blue-400/50 tracking-widest uppercase animate-pulse">
                                        [ No data points recorded in this timeframe ]
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                <button
                    onClick={fetchRosterItemLevels}
                    disabled={loading}
                    className={`
                        relative overflow-hidden group px-8 py-4 bg-blue-900/20 border border-blue-500/50 text-blue-200 
                        font-bold uppercase tracking-widest hover:bg-blue-500/20 hover:text-white transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto
                    `}
                    style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                >
                    <div className="flex items-center gap-3 relative z-10">
                        <RefreshIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{loading ? "Refreshing Roster..." : "Refresh Roster (Daily)"}</span>
                    </div>
                    {/* Button Scan Line Effect */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-blue-400/10 to-transparent group-hover:animate-shine pointer-events-none" />
                </button>

                {/* Redirect Button */}
                <div className="relative group/tooltip w-full sm:w-auto">
                    <button
                        onClick={handleRedirectToAudit}
                        disabled={!loggedIn}
                        className={`
                            relative overflow-hidden px-8 py-3.5 font-bold uppercase tracking-widest transition-all w-full sm:w-auto
                            ${loggedIn 
                                ? 'bg-cyan-900/20 border border-cyan-500/50 text-cyan-200 hover:bg-cyan-500/20 hover:text-white cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                : 'bg-gray-900/10 border border-gray-800 text-gray-500 cursor-not-allowed opacity-60'
                            }
                        `}
                        style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <ShieldIcon className="w-5 h-5" />
                            <div className="flex flex-col items-start text-left">
                                <span className="text-[12px] leading-tight font-bold">Readiness Dashboard</span>
                                <span className={`text-[8px] font-mono tracking-widest uppercase mt-0.5
                                    ${loggedIn ? 'text-cyan-400/85 animate-pulse' : 'text-red-500/75'}
                                `}>
                                    Officer Only
                                </span>
                            </div>
                        </div>
                    </button>
                    
                    {/* Tooltip for non-officers */}
                    {!loggedIn && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/95 text-red-400 text-[10px] font-mono uppercase tracking-widest font-bold px-4 py-2 border border-red-500/50 whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-300 z-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                             style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}>
                            [ Officer Login Required to View ]
                        </div>
                    )}
                </div>
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

            {/* Raid Buff & Utility Coverage Grid */}
            <div className="mb-10 bg-black/40 border border-blue-500/20 p-6 rounded-lg backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                
                {/* Core Buffs Accordion Header */}
                <button
                    onClick={() => setShowCore(!showCore)}
                    className="flex items-center justify-between w-full text-xs text-blue-300/80 hover:text-blue-300 font-black uppercase tracking-widest py-2 px-2 hover:bg-white/5 rounded transition-all select-none mb-3"
                >
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-blue-300 font-black">Core Raid Buffs & Debuffs</span>
                        {!showCore && (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono border transition-all duration-300
                                ${missingCore.length === 0 
                                    ? "bg-green-950/40 border-green-500/30 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.15)]" 
                                    : "bg-yellow-950/40 border-yellow-500/30 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.15)]"
                                }
                            `}>
                                {coreCountStr} COVERED <span className="hidden sm:inline">— {coreSummary}</span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-mono text-[9px] opacity-60">{showCore ? "COLLAPSE" : "EXPAND"}</span>
                        {showCore ? <ExpandLessIcon className="w-4.5 h-4.5" /> : <ExpandMoreIcon className="w-4.5 h-4.5" />}
                    </div>
                </button>
                
                {/* Core Buffs Grid - Larger boxes */}
                {showCore && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in">
                        {coreBuffs.map((buff) => {
                            const isCovered = buff.customCheck 
                                ? buff.customCheck(classCounts) 
                                : classCounts[buff.classKey] > 0;
                            return (
                                <div 
                                    key={buff.name}
                                    className={`relative p-3 border rounded transition-all flex flex-col items-center justify-between text-center overflow-hidden group min-h-[130px]
                                        ${isCovered 
                                            ? 'bg-green-950/15 border-green-500/30 text-green-200 shadow-[inset_0_0_15px_rgba(34,197,94,0.05)]' 
                                            : 'bg-red-950/10 border-red-500/10 text-red-400/60'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="w-5 h-5 relative rounded overflow-hidden">
                                            <Image src={buff.icon} alt={buff.class} layout="fill" objectFit="cover" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{buff.class}</span>
                                    </div>
                                    <div className={`text-xs font-black uppercase mb-1 ${isCovered ? 'text-white' : 'text-white/40'}`}>{buff.name}</div>
                                    <div className="text-[9px] font-mono opacity-80 mb-2 leading-tight">{buff.benefit}</div>
                                    
                                    <div className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase tracking-widest mt-auto
                                        ${isCovered 
                                            ? 'bg-green-500/25 border border-green-400 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                                            : 'bg-red-500/15 border border-red-500/30 text-red-500/80'
                                        }
                                    `}>
                                        {isCovered ? "Covered" : "Missing"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Collapsible Utility & Support Section */}
                <div className="border-t border-white/5 mt-6 pt-4">
                    <button
                        onClick={() => setShowUtilities(!showUtilities)}
                        className="flex items-center justify-between w-full text-xs text-blue-300/80 hover:text-blue-300 font-black uppercase tracking-widest py-2 px-2 hover:bg-white/5 rounded transition-all select-none"
                    >
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-blue-300/85">Secondary Raid CDs & Utilities</span>
                            {!showUtilities && (
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono border transition-all duration-300
                                    ${coveredUtilities.length > 0 
                                        ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]" 
                                        : "bg-red-950/40 border-red-500/30 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.15)]"
                                    }
                                `}>
                                    {utilityCountStr} ACTIVE <span className="hidden sm:inline">— {utilitySummary}</span>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-mono text-[9px] opacity-60">{showUtilities ? "COLLAPSE" : "EXPAND"}</span>
                            {showUtilities ? <ExpandLessIcon className="w-4.5 h-4.5" /> : <ExpandMoreIcon className="w-4.5 h-4.5" />}
                        </div>
                    </button>

                    {showUtilities && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 transition-all animate-fade-in">
                            {utilityBuffsList.map((buff) => {
                                const isCovered = buff.customCheck 
                                    ? buff.customCheck(classCounts) 
                                    : classCounts[buff.classKey] > 0;
                                return (
                                    <div 
                                        key={buff.name}
                                        className={`relative p-2.5 border rounded transition-all flex flex-col items-center justify-between text-center overflow-hidden group min-h-[95px]
                                            ${isCovered 
                                                ? 'bg-green-950/10 border-green-500/25 text-green-200 shadow-[inset_0_0_10px_rgba(34,197,94,0.02)]' 
                                                : 'bg-red-950/5 border-red-500/5 text-red-400/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-1 mb-1">
                                            <div className="w-3.5 h-3.5 relative rounded overflow-hidden">
                                                <Image src={buff.icon} alt={buff.class} layout="fill" objectFit="cover" />
                                            </div>
                                            <span className="text-[8px] font-bold uppercase tracking-wider">{buff.class}</span>
                                        </div>
                                        <div className={`text-[10px] font-black uppercase mb-0.5 leading-tight ${isCovered ? 'text-white' : 'text-white/40'}`}>{buff.name}</div>
                                        <div className="text-[8px] font-mono opacity-75 mb-1 leading-tight">{buff.benefit}</div>
                                        
                                        <div className={`px-1.5 py-0.2 rounded-sm font-mono text-[8px] font-bold uppercase tracking-widest mt-auto
                                            ${isCovered 
                                                ? 'bg-green-500/20 border border-green-400/80 text-green-300 shadow-[0_0_5px_rgba(34,197,94,0.15)]' 
                                                : 'bg-red-500/10 border border-red-500/20 text-red-500'
                                            }
                                        `}>
                                            {isCovered ? "Covered" : "Missing"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
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
                    Loading database...
                </div>
            )}
        </div>
    );
}
