import { useState, useEffect } from 'react';
import { useThemeContext } from "@/context/ThemeContext";
import RosterList from './RosterList';
import Individual from './Individual';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

// Main template for roster list and details
export default function RaidRoster({ roster, onDelete }) {
  const [search, setSearch] = useState('');
  const [selectedRaider, setSelectedRaider] = useState(null);

  // initialize with passed roster
  const [updatedRoster, setUpdatedRoster] = useState(roster);

  const [loading, setLoading] = useState(false);
  const { darkMode } = useThemeContext();

  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  // Sync with roster immediately
  useEffect(() => {
    setUpdatedRoster(prev => {
      // Create Map of previous state to preserve enriched data (like ilvl)
      const prevMap = new Map(prev.map(r => [r.id, r]));

      // Map authoritative roster prop to new state, merging with preserved data
      // This ensures we never have duplicates and strictly follow the parent list order/membership
      return roster.map(r => {
        const existing = prevMap.get(r.id);
        // If we have local enriched data (like fresh ilvl), preserve it, but prioritize roster's core identity
        return existing ? { ...r, ...existing } : r;
      });
    });
  }, [roster]);

  // Toast Timer
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const fetchRosterItemLevels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rosterItemLevels');
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();
      setUpdatedRoster(data);
      showToast('Roster item levels refreshed!', 'success');
    } catch (err) {
      console.error("Failed to fetch item levels:", err);
      setUpdatedRoster(roster);
      showToast('Failed to refresh item levels.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete raider
  const handleDeleteRaider = (id) => {
    if (onDelete) onDelete(id);
    setUpdatedRoster(prev => prev.filter(r => r.id !== id));
    // Reset right panel if the deleted raider is selected
    setSelectedRaider(prev => (prev?.id === id ? null : prev));
  };

  // Function to select raider
  const handleSelectRaider = (raider) => {
    if (raider.id === selectedRaider?.id) return;
    setSelectedRaider(raider);
  };

  // Search function
  const filteredRoster = updatedRoster
    .filter((raider) => {
      if (!search) return true;
      return raider.name.toLowerCase().includes(search.toLowerCase());
    })
    //alphabetical order
    .sort((a, b) => a.name.localeCompare(b.name));

  // Average Item Level
  const averageItemLevel = updatedRoster.length > 0
    ? updatedRoster.reduce((sum, r) => sum + (r.currentIlvl || 0), 0) / updatedRoster.length
    : 0;

  return (
    <div className="flex flex-col h-full bg-transparent relative">

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
          <div className={`
            flex items-center gap-3 px-6 py-3 border backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]
            ${toast.type === 'success' ? 'bg-green-900/80 border-green-500/50 text-green-100' : ''}
            ${toast.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-100' : ''}
            ${toast.type === 'info' ? 'bg-blue-900/80 border-blue-500/50 text-blue-100' : ''}
          `}
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%, 0% 20%)" }}
          >
            {toast.type === 'success' && <CheckCircleIcon />}
            {toast.type === 'error' && <ErrorIcon />}
            {toast.type === 'info' && <InfoIcon />}
            <span className="font-mono text-sm uppercase tracking-wider font-bold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-white/10 pb-6">
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-2 mb-2">
            <SearchIcon className="text-blue-500" fontSize="small" />
            <span className="text-[10px] text-blue-300 font-mono uppercase tracking-widest">Search Database</span>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ENTER UNIT NAME..."
            className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none transition-all tracking-wider"
          />
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">
            Fleet Average (ILVL)
          </div>
          <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            {averageItemLevel.toFixed(2)}
          </div>
          <div className="text-[9px] text-gray-600 font-mono uppercase mt-1">
            Based on {updatedRoster.length} Active Units
          </div>
        </div>
      </div>

      {/* Refresh Action */}
      <button
        onClick={fetchRosterItemLevels}
        disabled={loading}
        className="mb-8 w-full md:w-auto self-start flex items-center gap-3 px-6 py-3 border border-blue-500/30 bg-blue-900/10 hover:bg-blue-900/30 text-blue-300 font-mono text-xs uppercase tracking-widest transition-all group"
      >
        <RefreshIcon className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        {loading ? 'SYNCING DATA...' : 'SYNC ITEM LEVELS'}
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">

        {/* Left Column: Roster List */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col h-full bg-black/20 border-r border-white/5 pr-2">
          <div className="text-xs text-blue-300 font-black uppercase tracking-widest mb-4 pl-2 border-l-2 border-blue-500">
            Active Units ({filteredRoster.length})
          </div>

          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[700px]">
            {filteredRoster.map((raider) => (
              <div key={raider.id} onClick={() => handleSelectRaider(raider)}>
                <RosterList
                  raider={raider}
                  onDelete={handleDeleteRaider}
                  selected={selectedRaider?.id === raider.id}
                  showToast={showToast}
                />
              </div>
            ))}
            {filteredRoster.length === 0 && (
              <div className="p-8 text-center border border-dashed border-white/10 text-white/30 font-mono text-xs uppercase">
                No matching units found in database.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details Panel */}
        <div className="md:col-span-7 lg:col-span-8">
          <div className="text-xs text-blue-300 font-black uppercase tracking-widest mb-4 pl-2 border-l-2 border-blue-500">
            Unit Detail View
          </div>

          {selectedRaider ? (
            <div className="animate-fade-in">
              <Individual raider={selectedRaider} showToast={showToast} />
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-white/5 bg-white/5 bg-[url('/noise.png')] opacity-50 text-white/20">
              <div className="w-16 h-16 border-2 border-dashed border-current rounded-full flex items-center justify-center mb-4 animate-pulse">
                <SearchIcon fontSize="large" />
              </div>
              <p className="font-mono text-sm uppercase tracking-widest">Select a unit to view dossier</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
