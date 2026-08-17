import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShieldIcon from '@mui/icons-material/Shield';
import StarIcon from '@mui/icons-material/Star';

export default function RaidReadinessAudit() {
  const [raiders, setRaiders] = useState([]);
  const [alreadySyncedToday, setAlreadySyncedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedRaider, setSelectedRaider] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Memoized Filtered Raiders
  const filteredRaiders = useMemo(() => {
    return raiders.filter(raider => {
      // 1. Search filter
      if (searchTerm && !raider.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // 2. Role filter
      if (roleFilter !== "ALL" && raider.role !== roleFilter) {
        return false;
      }

      // 3. Status filter
      if (statusFilter !== "ALL") {
        const audit = raider.gearAudit || { missingEnchants: [], emptySockets: 0, lowTierEnchants: [] };
        const hasCritical = audit.missingEnchants?.length > 0 || audit.emptySockets > 0;
        const hasLowTier = audit.lowTierEnchants?.length > 0;

        if (statusFilter === "OPTIMIZED" && (hasCritical || hasLowTier)) {
          return false;
        }
        if (statusFilter === "CRITICAL" && !hasCritical) {
          return false;
        }
        if (statusFilter === "LOWTIER" && (hasCritical || !hasLowTier)) {
          return false;
        }
      }

      return true;
    });
  }, [raiders, searchTerm, roleFilter, statusFilter]);

  const classIconMap = {
    Warrior: "/warrior.png",
    Paladin: "/paladin.png",
    Hunter: "/hunter.png",
    Rogue: "/rogue.png",
    Priest: "/priest.png",
    "Death Knight": "/deathknight.png",
    Shaman: "/shaman.png",
    Mage: "/mage.png",
    Warlock: "/warlock.png",
    Monk: "/monk.png",
    Druid: "/druid.png",
    "Demon Hunter": "/demonhunter.webp",
    Evoker: "/evoker.webp",
  };

  const classColorMap = {
    Warrior: "text-[#C79C6E]",
    Paladin: "text-[#F58CBA]",
    Hunter: "text-[#ABD473]",
    Rogue: "text-[#FFF569]",
    Priest: "text-[#FFFFFF]",
    "Death Knight": "text-[#C41F3B]",
    Shaman: "text-[#0070DE]",
    Mage: "text-[#40C7EB]",
    Warlock: "text-[#8787ED]",
    Monk: "text-[#00FF96]",
    Druid: "text-[#FF7D0A]",
    "Demon Hunter": "text-[#A330C9]",
    Evoker: "text-[#33937F]",
  };

  const getClassIcon = (className) => classIconMap[className] || "/unknown.png";
  const getClassColor = (className) => classColorMap[className] || "text-gray-300";

  // --- Fetch Initial Audit Data ---
  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/raider/readiness");
      if (res.ok) {
        const data = await res.json();
        setRaiders(data.raiders || []);
        setAlreadySyncedToday(data.alreadySyncedToday || false);
        // Retain selection if raider still exists
        if (selectedRaider) {
          const matched = data.raiders.find(r => r.id === selectedRaider.id);
          setSelectedRaider(matched || null);
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to retrieve readiness data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  // --- Sync Data (POST) ---
  const handleSyncReadiness = async (forceSync = false) => {
    if (alreadySyncedToday && !forceSync) {
      showToast("Daily limit reached. Roster has already been scanned today. Please ask an officer for a refresh.", "error");
      return;
    }

    setSyncing(true);
    showToast("Connecting to Battle.net profiles...", "info");
    try {
      const res = await fetch("/api/raider/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: forceSync })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sync failed");
      }

      setRaiders(data.raiders || []);
      setAlreadySyncedToday(true);
      showToast("Raid readiness sync completed!", "success");

      // Auto-select first raider if none selected
      if (data.raiders && data.raiders.length > 0 && !selectedRaider) {
        setSelectedRaider(data.raiders[0]);
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to sync readiness data.", "error");
    } finally {
      setSyncing(false);
    }
  };

  // --- Toast Manager ---
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // --- Calculation Metrics ---
  const metrics = useMemo(() => {
    if (raiders.length === 0) {
      return {
        grade: "N/A",
        gradeColor: "text-gray-500",
        optimizePercent: 0,
        vaultPercent: 0,
        averageMplus: 0,
        attentionList: []
      };
    }

    let totalEnchantableSlots = 0;
    let enchantedSlots = 0;
    let totalSockets = 0;
    let filledSockets = 0;
    let mplusTotal = 0;
    let vaultAchievedCount = 0; // Did at least 1 key
    const attentionList = [];

    raiders.forEach(raider => {
      const audit = raider.gearAudit || { missingEnchants: [], emptySockets: 0, lowTierEnchants: [] };
      const keys = raider.weeklyKeysCompleted || [];
      mplusTotal += raider.mplusRating || 0;

      if (keys.length >= 1) {
        vaultAchievedCount++;
      }

      // Check if character is missing enchants or sockets or has low tier enchants
      const hasMissingEnchants = audit.missingEnchants?.length > 0;
      const hasEmptySockets = audit.emptySockets > 0;
      const hasLowTierEnchants = audit.lowTierEnchants?.length > 0;

      if (hasMissingEnchants || hasEmptySockets || hasLowTierEnchants) {
        attentionList.push({
          raider,
          missingEnchants: audit.missingEnchants || [],
          emptySockets: audit.emptySockets || 0,
          lowTierEnchants: audit.lowTierEnchants || []
        });
      }

      // Approximate slots count
      // TWW enchantable slots standard is 8
      const missingCount = audit.missingEnchants?.length || 0;
      const lowTierCount = audit.lowTierEnchants?.length || 0;
      enchantedSlots += (8 - missingCount - lowTierCount);
      totalEnchantableSlots += 8;

      // Sockets
      const emptySock = audit.emptySockets || 0;
      // Assume average of 2 sockets per character for calculation if not specified, 
      // or we just calculate base socket optimization rate
      filledSockets += 2; // base reference
      totalSockets += (2 + emptySock);
    });

    const averageMplus = Math.round(mplusTotal / raiders.length);
    const enchantRate = totalEnchantableSlots > 0 ? (enchantedSlots / totalEnchantableSlots) * 100 : 0;
    const socketRate = totalSockets > 0 ? (filledSockets / totalSockets) * 100 : 0;
    const vaultRate = (vaultAchievedCount / raiders.length) * 100;

    // Readiness score calculation: 45% gear enchants, 25% sockets, 30% weekly keys run
    const readinessScore = (enchantRate * 0.45) + (socketRate * 0.25) + (vaultRate * 0.30);

    let grade = "F";
    let gradeColor = "text-red-500 shadow-red-500/20";
    if (readinessScore >= 95) {
      grade = "A+";
      gradeColor = "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.7)]";
    } else if (readinessScore >= 88) {
      grade = "A";
      gradeColor = "text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]";
    } else if (readinessScore >= 80) {
      grade = "B";
      gradeColor = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
    } else if (readinessScore >= 70) {
      grade = "C";
      gradeColor = "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]";
    } else if (readinessScore >= 60) {
      grade = "D";
      gradeColor = "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]";
    }

    return {
      grade,
      gradeColor,
      optimizePercent: Math.round((enchantRate + socketRate) / 2),
      vaultPercent: Math.round(vaultRate),
      averageMplus,
      attentionList
    };
  }, [raiders]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-transparent text-white">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <span className="font-mono text-xs tracking-widest uppercase text-blue-300 animate-pulse">Loading Readiness Data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-white font-mono min-h-[600px]">

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[250] animate-slide-down">
          <div className={`
            flex items-center gap-3 px-6 py-3 border backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]
            ${toast.type === 'success' ? 'bg-green-950/90 border-green-500/50 text-green-300' : ''}
            ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-300' : ''}
            ${toast.type === 'info' ? 'bg-blue-950/90 border-blue-500/50 text-blue-300' : ''}
          `}
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%, 0% 20%)" }}
          >
            {toast.type === 'success' && <CheckCircleIcon />}
            {toast.type === 'error' && <ErrorIcon />}
            {toast.type === 'info' && <InfoIcon />}
            <span className="text-xs uppercase tracking-wider font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black/40 p-4 border border-white/10 rounded-lg gap-4">
        <div>
          <span className="text-xs text-blue-300 font-black uppercase tracking-widest block mb-1">Combat Readiness Assessment</span>
          <span className="text-[10px] text-white/40">Audit character equipment optimization, enchants, gem sockets, and Great Vault progression.</span>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-right hidden sm:block">
            <div className="text-[9px] text-white/30 uppercase tracking-widest font-mono">Status Check</div>
            <div className="text-[10px] text-blue-400 font-bold uppercase">
              {alreadySyncedToday ? "Synced Today" : "Awaiting Daily Sync"}
            </div>
          </div>

          <button
            onClick={() => handleSyncReadiness(false)}
            disabled={syncing || alreadySyncedToday}
            className={`
              flex items-center gap-2 px-5 py-2.5 font-bold uppercase tracking-widest text-xs transition-all flex-1 md:flex-none justify-center
              ${alreadySyncedToday
                ? 'bg-gray-800/40 border border-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              }
            `}
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
          >
            <RefreshIcon className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? "Auditing..." : alreadySyncedToday ? "DAILY SYNCED" : "RUN DAILY SYNC"}</span>
          </button>

          {/* Officer Force Sync bypass */}
          {alreadySyncedToday && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSyncReadiness(true)}
                disabled={syncing}
                className="px-3 py-1.5 bg-amber-950/30 border border-amber-500/50 text-amber-300 hover:bg-amber-500/20 text-[10px] font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)] disabled:opacity-50"
              >
                [ Force Sync ]
              </button>
              <span className="text-[8px] text-amber-400/80 font-mono mt-0.5 tracking-tight">
                * Officer Only
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI DASHBOARD SUMMARY VIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Readiness Score */}
        <div className="bg-black/50 border border-white/10 p-5 rounded-lg relative flex items-center justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Raid Readiness</span>
            <span className="text-3xl font-black tracking-tighter">SCORE CARD</span>
          </div>
          <div className={`text-5xl font-black font-mono ${metrics.gradeColor}`}>
            {metrics.grade}
          </div>
        </div>

        {/* KPI 2: Optimization Rate */}
        <div className="bg-black/50 border border-white/10 p-5 rounded-lg relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Enchants & Gems Optimization</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-black text-white font-mono">{metrics.optimizePercent}%</span>
            <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-cyan-500 h-full shadow-[0_0_10px_#22d3ee]" style={{ width: `${metrics.optimizePercent}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 3: Vault Keystones */}
        <div className="bg-black/50 border border-white/10 p-5 rounded-lg relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Weekly Great Vault Coverage</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-black text-white font-mono">{metrics.vaultPercent}%</span>
            <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="bg-green-500 h-full shadow-[0_0_10px_#22c55e]" style={{ width: `${metrics.vaultPercent}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 4: Average Mythic+ Score */}
        <div className="bg-black/50 border border-white/10 p-5 rounded-lg relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Average Mythic+ Rating</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-black text-white font-mono">{metrics.averageMplus}</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-mono">SEASON AVERAGE</span>
          </div>
        </div>
      </div>

      {/* ATTENTION REQUIRED NOTIFICATION PANEL */}
      {metrics.attentionList.length > 0 && (
        <div className="bg-yellow-950/10 border-l-4 border-yellow-500 p-4 rounded-r-lg relative overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.05)]">
          <div className="flex items-center gap-2 mb-2">
            <WarningIcon className="text-yellow-500 w-5 h-5" />
            <span className="text-xs font-black uppercase text-yellow-400 tracking-wider">Optimization Alerts: Attention Required ({metrics.attentionList.length} Raiders)</span>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[85px] overflow-y-auto pr-2 custom-scrollbar">
            {metrics.attentionList.map(({ raider, missingEnchants, emptySockets, lowTierEnchants }) => (
              <div
                key={raider.id}
                onClick={() => setSelectedRaider(raider)}
                className="bg-black/50 hover:bg-black/80 border border-yellow-500/25 px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-2"
              >
                <div className="w-4.5 h-4.5 relative rounded overflow-hidden">
                  <Image src={getClassIcon(raider.characterClass)} alt={raider.characterClass} layout="fill" objectFit="cover" />
                </div>
                <span className={`text-xs font-bold ${getClassColor(raider.characterClass)}`}>{raider.name}</span>
                <span className="text-[9px] bg-red-950/50 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">
                  {missingEnchants.length > 0 && `Enchants x${missingEnchants.length}`}
                  {missingEnchants.length > 0 && emptySockets > 0 && " | "}
                  {emptySockets > 0 && `Gems x${emptySockets}`}
                  {((missingEnchants.length > 0 || emptySockets > 0) && lowTierEnchants.length > 0) && " | "}
                  {lowTierEnchants.length > 0 && `Low-Tier x${lowTierEnchants.length}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: ROSTER LISTING TABLE */}
        <div className="lg:col-span-8 flex flex-col bg-black/30 border border-white/10 rounded-lg p-4">
          <div className="text-xs text-blue-300 font-black uppercase tracking-widest mb-4 pl-2 border-l-2 border-blue-500 text-left flex justify-between items-center">
            <span>Guild Raid Roster Audit ({filteredRaiders.length} of {raiders.length} active)</span>
          </div>

          {/* Search and Filters Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-black/25 p-3 rounded border border-white/5">
            {/* Search Input */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Search Raider</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="bg-black/85 border border-white/10 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
            {/* Role Filter */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Role Filter</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-black/85 border border-white/10 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-blue-500 transition-all uppercase font-mono"
              >
                <option value="ALL">All Roles</option>
                <option value="TANK">Tanks</option>
                <option value="HEALER">Healers</option>
                <option value="MELEEDPS">Melee DPS</option>
                <option value="RANGEDPS">Ranged DPS</option>
              </select>
            </div>
            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Status Filter</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/85 border border-white/10 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-blue-500 transition-all uppercase font-mono"
              >
                <option value="ALL">All Audits</option>
                <option value="OPTIMIZED">Fully Optimized</option>
                <option value="CRITICAL">Needs Attention (Missing)</option>
                <option value="LOWTIER">Low-Tier Enchants</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-wider text-white/50">
                  <th className="py-3 px-2">Raider</th>
                  <th className="py-3 px-2 text-center">ILVL</th>
                  <th className="py-3 px-2">Gear Optimization</th>
                  <th className="py-3 px-2 text-center">M+ Rating</th>
                  <th className="py-3 px-2">Vault Keys Run</th>
                  <th className="py-3 px-2 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRaiders.map(raider => {
                  const audit = raider.gearAudit || { missingEnchants: [], emptySockets: 0, lowTierEnchants: [] };
                  const keys = raider.weeklyKeysCompleted || [];
                  const hasCriticalIssues = audit.missingEnchants?.length > 0 || audit.emptySockets > 0;
                  const hasLowTier = audit.lowTierEnchants?.length > 0;
                  const isOptimized = !hasCriticalIssues && !hasLowTier;
                  const isSelected = selectedRaider?.id === raider.id;

                  // Vault slots (TWW: 1, 4, 8 runs)
                  const slot1 = keys.length >= 1;
                  const slot2 = keys.length >= 4;
                  const slot3 = keys.length >= 8;

                  return (
                    <tr
                      key={raider.id}
                      onClick={() => setSelectedRaider(raider)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer group/row
                        ${isSelected ? 'bg-blue-950/20 border-l-2 border-l-cyan-500' : 'border-l-2 border-l-transparent'}
                      `}
                    >
                      {/* Raider Column */}
                      <td className="py-3 px-2 flex items-center gap-2">
                        <div className="w-5 h-5 relative rounded overflow-hidden">
                          <Image src={getClassIcon(raider.characterClass)} alt={raider.characterClass} layout="fill" objectFit="cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${getClassColor(raider.characterClass)}`}>{raider.name}</span>
                          <span className="text-[8px] text-white/30 uppercase tracking-widest">{raider.role}</span>
                        </div>
                      </td>

                      {/* ILVL Column */}
                      <td className="py-3 px-2 text-center text-xs font-mono font-bold">
                        {raider.currentIlvl || "---"}
                      </td>

                      {/* Gear Optimization Column */}
                      <td className="py-3 px-2">
                        {isOptimized ? (
                          <span className="text-[10px] bg-green-950/50 border border-green-500/30 text-green-400 px-2 py-0.5 rounded font-bold uppercase">
                            Optimized
                          </span>
                        ) : (
                          <div className="flex gap-1.5 flex-wrap">
                            {audit.missingEnchants.length > 0 && (
                              <span className="text-[9px] bg-red-950/50 border border-red-500/30 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                Enchants -{audit.missingEnchants.length}
                              </span>
                            )}
                            {audit.emptySockets > 0 && (
                              <span className="text-[9px] bg-red-950/50 border border-red-500/30 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                Gems -{audit.emptySockets}
                              </span>
                            )}
                            {audit.lowTierEnchants.length > 0 && (
                              <span className="text-[9px] bg-yellow-950/30 border border-yellow-500/30 text-yellow-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                Low-Tier x{audit.lowTierEnchants.length}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Mythic+ Rating Column */}
                      <td className="py-3 px-2 text-center text-xs font-mono font-black">
                        <span className={`
                          ${raider.mplusRating >= 2500 ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.4)]' : ''}
                          ${raider.mplusRating >= 2000 && raider.mplusRating < 2500 ? 'text-purple-400' : ''}
                          ${raider.mplusRating >= 1500 && raider.mplusRating < 2000 ? 'text-blue-400' : ''}
                          ${raider.mplusRating < 1500 ? 'text-gray-400' : ''}
                        `}>
                          {raider.mplusRating || 0}
                        </span>
                      </td>

                      {/* Great Vault Progress Column */}
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          {/* Run 1 Vault Slot */}
                          <div
                            title={`Run 1: ${keys[0] ? `+${keys[0]}` : "Missing"}`}
                            className={`w-5 h-5 rounded border flex items-center justify-center text-[9px] font-mono font-bold
                              ${slot1
                                ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
                                : 'bg-transparent border-white/10 text-white/20'
                              }
                            `}
                          >
                            {slot1 ? `+${keys[0]}` : "1"}
                          </div>
                          {/* Run 4 Vault Slot */}
                          <div
                            title={`Run 4: ${keys[3] ? `+${keys[3]}` : "Missing"}`}
                            className={`w-5 h-5 rounded border flex items-center justify-center text-[9px] font-mono font-bold
                              ${slot2
                                ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
                                : 'bg-transparent border-white/10 text-white/20'
                              }
                            `}
                          >
                            {slot2 ? `+${keys[3]}` : "4"}
                          </div>
                          {/* Run 8 Vault Slot */}
                          <div
                            title={`Run 8: ${keys[7] ? `+${keys[7]}` : "Missing"}`}
                            className={`w-5 h-5 rounded border flex items-center justify-center text-[9px] font-mono font-bold
                              ${slot3
                                ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
                                : 'bg-transparent border-white/10 text-white/20'
                              }
                            `}
                          >
                            {slot3 ? `+${keys[7]}` : "8"}
                          </div>

                          {/* Total completed runs indicator */}
                          <span className="text-[10px] text-white/40 ml-1.5 font-mono">({keys.length} Runs)</span>
                        </div>
                      </td>

                      {/* Overall Status Badge */}
                      <td className="py-3 px-2 text-right">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm
                          ${hasCriticalIssues
                            ? 'bg-red-500/15 border border-red-500/30 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                            : hasLowTier
                              ? 'bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.15)]'
                              : 'bg-green-500/20 border border-green-500/50 text-green-300'
                          }
                        `}>
                          {hasCriticalIssues ? "NEEDS ATTN" : hasLowTier ? "NEEDS WORK" : "FULLY READY"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: INDIVIDUAL DETAIL AUDIT CARD */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="text-xs text-blue-300 font-black uppercase tracking-widest mb-0.5 pl-2 border-l-2 border-blue-500 text-left">
            Raider Specific Audit
          </div>

          {selectedRaider ? (
            <div className="bg-black/50 border border-white/10 rounded-lg p-5 relative overflow-hidden flex flex-col gap-5">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-blue-500" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-blue-500" />

              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 relative rounded-full border border-white/15 overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                  <Image src={getClassIcon(selectedRaider.characterClass)} alt={selectedRaider.characterClass} layout="fill" objectFit="cover" />
                </div>
                <div>
                  <div className="text-base font-black uppercase tracking-wider">{selectedRaider.name}</div>
                  <div className="flex items-center gap-2 text-[9px] text-white/40 mt-0.5 uppercase tracking-widest">
                    <span className={getClassColor(selectedRaider.characterClass)}>{selectedRaider.characterClass}</span>
                    <span>•</span>
                    <span>{selectedRaider.server}</span>
                  </div>
                  <a
                    href={`https://worldofwarcraft.com/en-us/character/us/${selectedRaider.server.toLowerCase()}/${selectedRaider.name.toLowerCase()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1.5 bg-blue-950/30 border border-blue-500/50 hover:bg-blue-600 hover:text-white text-[10px] font-black uppercase tracking-widest text-blue-300 transition-all font-mono shadow-[0_0_10px_rgba(59,130,246,0.15)] select-none"
                    style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
                  >
                    Blizzard Armory
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-blue-300 uppercase tracking-widest font-black">Mythic+ Weekly Progress</span>
                <div className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded">
                  <div>
                    <div className="text-[8px] text-white/40 uppercase tracking-wider">Seasonal Rating</div>
                    <div className="text-lg font-black text-white">{selectedRaider.mplusRating || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] text-white/40 uppercase tracking-wider">Runs Completed</div>
                    <div className="text-lg font-black text-cyan-400">{(selectedRaider.weeklyKeysCompleted || []).length} Keys</div>
                  </div>
                </div>

                {/* Keystone List */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="text-[9px] text-white/50 uppercase tracking-wider">Completed Keys (Ranked):</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedRaider.weeklyKeysCompleted || []).map((keyLvl, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border
                          ${keyLvl >= 15 ? 'bg-orange-500/25 border-orange-500/50 text-orange-300' : ''}
                          ${keyLvl >= 10 && keyLvl < 15 ? 'bg-purple-500/25 border-purple-500/50 text-purple-300' : ''}
                          ${keyLvl >= 5 && keyLvl < 10 ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : ''}
                          ${keyLvl < 5 ? 'bg-gray-800 border-gray-700 text-gray-400' : ''}
                        `}
                      >
                        +{keyLvl}
                      </span>
                    ))}
                    {(selectedRaider.weeklyKeysCompleted || []).length === 0 && (
                      <span className="text-[10px] text-white/20 italic">[ No completed keystones detected ]</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gear Audit Details */}
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4 mt-2">
                <span className="text-[10px] text-blue-300 uppercase tracking-widest font-black">Enchants & Gem Sockets Audit</span>

                {/* Empty Sockets alert */}
                <div className="flex justify-between items-center border-b border-white/5 py-1.5">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">Empty Sockets</span>
                  {selectedRaider.gearAudit?.emptySockets > 0 ? (
                    <span className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5 bg-red-950/20 px-2 py-0.5 border border-red-500/20 rounded">
                      <ErrorIcon sx={{ fontSize: 14 }} /> {selectedRaider.gearAudit.emptySockets} Empty
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-1.5">
                      <CheckCircleIcon sx={{ fontSize: 14 }} /> Optimized
                    </span>
                  )}
                </div>

                {/* Missing Enchants alert */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center border-b border-white/5 py-1.5">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest">Missing Enchants</span>
                    {selectedRaider.gearAudit?.missingEnchants?.length > 0 ? (
                      <span className="text-xs font-bold text-red-400 uppercase flex items-center gap-1.5 bg-red-950/20 px-2 py-0.5 border border-red-500/20 rounded">
                        <ErrorIcon sx={{ fontSize: 14 }} /> {selectedRaider.gearAudit.missingEnchants.length} Slots
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-1.5">
                        <CheckCircleIcon sx={{ fontSize: 14 }} /> Optimized
                      </span>
                    )}
                  </div>

                  {selectedRaider.gearAudit?.missingEnchants?.length > 0 && (
                    <div className="flex flex-col gap-1 pl-2 border-l border-red-500/40 text-[9px] text-red-300 bg-red-950/5 p-2 rounded">
                      {selectedRaider.gearAudit.missingEnchants.map((slot, idx) => (
                        <div key={idx}>• {slot}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Low Tier Enchants alert */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center border-b border-white/5 py-1.5">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest">Low-Tier Enchants</span>
                    {selectedRaider.gearAudit?.lowTierEnchants?.length > 0 ? (
                      <span className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1.5 bg-yellow-950/20 px-2 py-0.5 border border-yellow-500/20 rounded font-mono">
                        <WarningIcon sx={{ fontSize: 14 }} /> {selectedRaider.gearAudit.lowTierEnchants.length} Warnings
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-1.5">
                        <CheckCircleIcon sx={{ fontSize: 14 }} /> Optimized
                      </span>
                    )}
                  </div>

                  {selectedRaider.gearAudit?.lowTierEnchants?.length > 0 && (
                    <div className="flex flex-col gap-1 pl-2 border-l border-yellow-500/40 text-[9px] text-yellow-300 bg-yellow-950/5 p-2 rounded">
                      {selectedRaider.gearAudit.lowTierEnchants.map((enchant, idx) => (
                        <div key={idx}>• {enchant}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="text-[8px] text-white/20 uppercase tracking-wider text-right font-mono mt-2">
                Last Audited: {selectedRaider.lastAuditTime ? new Date(selectedRaider.lastAuditTime).toLocaleString() : "Never"}
              </div>
            </div>
          ) : (
            <div className="bg-black/50 border border-white/10 rounded-lg p-10 flex flex-col items-center justify-center text-center text-white/20 min-h-[300px]">
              <ShieldIcon sx={{ fontSize: 48 }} className="animate-pulse mb-3 opacity-60 text-blue-500/50" />
              <div className="text-xs uppercase tracking-widest font-mono">Select a raider in the table to display detail audit reports.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
