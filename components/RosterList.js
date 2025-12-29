import { useState } from 'react';
import Image from 'next/image';
import ClearIcon from '@mui/icons-material/Clear'; // Keeping Icon for now, wrapping in standard button
import { useThemeContext } from "@/context/ThemeContext";

import TechConfirmModal from './TechConfirmModal';

//Show simple information of the raider

export default function RosterList({ raider, onDelete, selected, showToast }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { darkMode } = useThemeContext();

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

  const getClassIcon = (className) => classIconMap[className] || "/unknown.png";

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setConfirmOpen(true);
  };

  const proceedDelete = async () => {
    setConfirmOpen(false);

    if (typeof onDelete === "function") onDelete(raider.id, true);

    setDeleting(true);

    try {
      const res = await fetch(`/api/roster?id=${raider.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({ message: 'Raider deleted successfully' }));

      if (!res.ok) {
        if (showToast) showToast(data.error || 'Failed to delete raider', 'error');
      } else {
        if (showToast) showToast('Raider deleted successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to delete raider', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`
        relative flex items-center justify-between p-3 mb-2 cursor-pointer transition-all duration-300 border-l-4 group overflow-hidden
        ${selected
          ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
          : 'bg-black/40 border-white/10 hover:bg-white/5 hover:border-white/30'}
      `}
    >
      {/* Background Accents */}
      <div className={`absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-black/50 to-transparent pointer-events-none`} />

      {/* Left Section: Icon & Name */}
      <div className="flex items-center gap-4 z-10">
        <button
          onClick={handleDeleteClick}
          disabled={deleting}
          className="text-red-500/50 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-500/10"
          title="Delete Unit"
        >
          <ClearIcon fontSize="small" />
        </button>

        <div className="relative">
          <Image
            src={getClassIcon(raider.characterClass)}
            alt={raider.characterClass}
            width={32}
            height={32}
            className="drop-shadow-md"
          />
          {/* Active Indicator Dot */}
          {selected && <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_5px_#60a5fa] animate-pulse" />}
        </div>

        <div className="flex flex-col">
          <span className={`text-sm font-bold uppercase tracking-wider ${selected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
            {raider.name}
          </span>
        </div>
      </div>

      {/* Right Section: ILVL */}
      <div className="flex flex-col items-end z-10">
        <span className="text-[9px] text-blue-400/80 font-mono uppercase tracking-widest">
          Item Lvl
        </span>
        <span className={`font-mono font-bold text-lg ${selected ? 'text-blue-300' : 'text-gray-400'}`}>
          {raider.currentIlvl ?? 0}
        </span>
      </div>

      <TechConfirmModal
        isOpen={confirmOpen}
        title="TERMINATE UNIT?"
        message={`Are you sure you want to permanently delete ${raider.name} from the database? This action cannot be undone.`}
        onConfirm={proceedDelete}
        onCancel={(e) => { e.stopPropagation(); setConfirmOpen(false); }}
        confirmText="TERMINATE"
      />
    </div>
  );
}
