import { useEffect, useState } from 'react';
import Image from 'next/image';

//Show Individual Radier's Details

export default function Individual({ raider, showToast }) {
  const [raiderState, setRaider] = useState(raider);
  const [charInfo, setCharInfo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editingRole, setEditingRole] = useState(false);
  const [newRole, setNewRole] = useState(raider.role || '');

  useEffect(() => {
    setRaider(raider);
    setNewRole(raider.role || '');
  }, [raider]);

  // Custom image loader to skip domain configuration for now
  const customLoader = ({ src }) => {
    return src;
  };

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

  const roleDisplayMap = {
    TANK: "This Unit is a TANK",
    HEALER: "This Unit is a HEALER",
    MELEEDPS: "This Unit is MELEE DPS",
    RANGEDPS: "This Unit is RANGED DPS",
  };

  const shortRoleMap = {
    TANK: "TANK",
    HEALER: "HEALER",
    MELEEDPS: "MELEE",
    RANGEDPS: "RANGED",
  };

  const roleOptions = [
    { value: "TANK", label: "Tank" },
    { value: "HEALER", label: "Healer" },
    { value: "MELEEDPS", label: "Melee DPS" },
    { value: "RANGEDPS", label: "Ranged DPS" },
  ];

  const getClassIcon = (className) => classIconMap[className] || "/unknown.png";

  // Fetch character info from API
  useEffect(() => {
    if (!raider?.name || !raider?.server) return;

    let isActive = true;

    async function fetchCharacterInfo() {
      try {
        const res = await fetch('/api/characterInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: raider.name,
            server: raider.server,
          }),
        });

        if (!res.ok) {
          let errorMsg = `Failed to fetch character info (${res.status})`;
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // Failed to parse error JSON
          }
          console.error(`Error fetching ${raider.name}:`, errorMsg);
          setCharInfo(null);
          return;
        }

        const data = await res.json();

        if (!data || !data.raider || !data.profile) {
          console.error(`Invalid data structure for ${raider.name}`);
          setCharInfo(null);
          return;
        }

        if (!isActive) return;

        // Ensure the raider has a role
        setRaider(prev => ({
          ...prev,
          history: data.raider.history,
          role: prev.role || 'DPS',
        }));
        setCharInfo(data.profile);

        // Calculate ilvl progress
        if (data.raider.history?.length >= 2) {
          const diff = data.raider.history[0].ilvl - data.raider.history[1].ilvl;
          setProgress(diff);
        } else {
          setProgress(null);
        }
      } catch (err) {
        if (!isActive) return;
        console.error('Fetch failed:', err);
        setCharInfo(null);
      }
    }

    fetchCharacterInfo();

    return () => { isActive = false };
  }, [raider]);

  //change role and update database
  const handleRoleChange = async () => {
    if (!newRole) return;

    try {
      const res = await fetch(`/api/raider/${raiderState.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Error updating role:', text);
        if (showToast) showToast(`Failed to update role: ${text}`, 'error');
        return;
      }

      const updatedRaider = await res.json();
      setRaider(prev => ({ ...prev, role: updatedRaider.role }));
      setEditingRole(false);
      if (showToast) showToast('Role updated successfully', 'success');
    } catch (err) {
      console.error('Error updating role:', err);
      if (showToast) showToast('Error updating role. See console for details.', 'error');
    }
  };

  //failed to get data doesn't cause error, show unknown instead

  if (!raiderState) return null;

  const faction = charInfo?.faction || 'Unknown';
  const characterClass = charInfo?.characterClass || 'Unknown';
  const race = charInfo?.race || 'Unknown';

  //show last check date

  const lastCheckedDate = (() => {
    const recentHistory = raiderState?.history?.[0];
    if (!recentHistory?.recordedAt) return 'Unknown';
    return new Date(recentHistory.recordedAt).toLocaleString();
  })();

  // Link for related sites
  const armoryLink = `https://worldofwarcraft.com/en-us/character/us/${raiderState.server.toLowerCase()}/${raiderState.name.toLowerCase()}`;
  const wclLink = `https://www.warcraftlogs.com/character/us/${raiderState.server.toLowerCase()}/${raiderState.name.toLowerCase()}`;
  const raiderIoLink = `https://raider.io/characters/us/${raiderState.server.toLowerCase()}/${raiderState.name.toLowerCase()}`;

  const StatRow = ({ label, value, subValue }) => (
    <div className="flex justify-between items-center border-b border-white/5 py-2 hover:bg-white/5 px-2 transition-colors">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{label}</span>
      <div className="text-right">
        <div className="text-sm font-bold text-gray-200">{value}</div>
        {subValue && <div className="text-[10px] text-blue-400 font-mono">{subValue}</div>}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-black/40 border border-white/10 relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-500" />

      {/* Header Section */}
      <div className="p-6 pb-0 relative">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 border-2 border-blue-500/30 rounded-full overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Image
                src={getClassIcon(characterClass)}
                alt={characterClass}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                {raiderState.name}
              </h2>
              <div className="text-xs text-blue-400 font-mono tracking-[0.2em] bg-blue-900/10 inline-block px-2 py-1 mt-1 border border-blue-500/20">
                {/* {raiderState.server.toUpperCase()} */}
              </div>
            </div>
          </div>

          {/* ILVL Big Display */}
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-1">Current Item Level</div>
            <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {raiderState.currentIlvl ?? 0}
            </div>
            {progress !== null && (
              <div className={`font-mono text-xs font-bold mt-1 ${progress >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {progress > 0 ? '+' : ''}{progress} VARIANCE
              </div>
            )}
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </div>

      {/* Info Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

        {/* Column 1: Core Stats */}
        <div className="space-y-1">
          <div className="text-xs text-blue-300 font-black uppercase tracking-widest mb-3 pl-2 border-l-2 border-blue-500">
            Core Metadata
          </div>
          <StatRow label="Class" value={characterClass} />
          <StatRow label="Combat Role" value={shortRoleMap[raiderState.role]} />
          <StatRow label="Race" value={race} />
          <StatRow label="Faction" value={faction} />
        </div>

        {/* Column 2: Actions & Links */}
        <div className="space-y-4">
          <div className="text-xs text-blue-300 font-black uppercase tracking-widest mb-3 pl-2 border-l-2 border-blue-500">
            Protocol Links
          </div>
          <div className="grid grid-cols-1 gap-2">
            <a href={armoryLink} target="_blank" rel="noreferrer"
              className="block text-center px-4 py-2 border border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-blue-600/20 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white transition-all">
              Blizzard Armory
            </a>
            <a href={wclLink} target="_blank" rel="noreferrer"
              className="block text-center px-4 py-2 border border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-blue-600/20 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white transition-all">
              Warcraft Logs
            </a>
            <a href={raiderIoLink} target="_blank" rel="noreferrer"
              className="block text-center px-4 py-2 border border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-blue-600/20 text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white transition-all">
              Raider.IO
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-blue-300 font-black uppercase tracking-widest pl-2 border-l-2 border-blue-500">
                Role Override
              </div>
            </div>

            {!editingRole ? (
              <button
                onClick={() => setEditingRole(true)}
                className="w-full text-center px-4 py-2 border border-dashed border-gray-600 hover:border-white text-gray-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-all"
              >
                Modify Combat Role
              </button>
            ) : (
              <div className="space-y-2 animate-fade-in">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-black border border-blue-500 text-white text-xs p-2 font-mono focus:outline-none uppercase"
                >
                  <option value="TANK">TANK</option>
                  <option value="MELEEDPS">MELEE DPS</option>
                  <option value="RANGEDPS">RANGED DPS</option>
                  <option value="HEALER">HEALER</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleRoleChange}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 uppercase tracking-wider"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingRole(false)}
                    className="border border-white/20 hover:bg-white/10 text-gray-300 text-xs font-bold py-2 uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black/80 p-3 border-t border-white/10 flex justify-between items-center">
        <div className="text-[9px] text-gray-600 font-mono uppercase">
          Secure Connection Established
        </div>
        <div className="text-[9px] text-blue-500/60 font-mono uppercase">
          Last Sync: {lastCheckedDate}
        </div>
      </div>
    </div>
  );
}
