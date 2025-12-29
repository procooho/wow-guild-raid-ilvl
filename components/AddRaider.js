import { useState } from 'react';

export default function AddRaider({ onAdd }) {
    const [name, setName] = useState("");
    const [server, setServer] = useState("Tichondrius");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverListOpen, setServerListOpen] = useState(false);

    // All US server lists
    const usServers = [
        "Aegwynn", "Aerie Peak", "Agamaggan", "Aggramar", "Akama", "Alexstrasza", "Alleria", "Altar of Storms",
        "Alterac Mountains", "Andorhal", "Anetheron", "Antonidas", "Anub’arak", "Anvilmar", "Arathor",
        "Archimonde", "Area 52", "Argent Dawn", "Arthas", "Arygos", "Auchindoun", "Azgalor", "Azjol-Nerub",
        "Azralon", "Azshara", "Azuremyst", "Baelgun", "Balnazzar", "Barthilas", "Black Dragonflight",
        "Blackhand", "Blackrock", "Blackwater Raiders", "Blackwing Lair", "Blade’s Edge", "Bladefist",
        "Bleeding Hollow", "Blood Furnace", "Bloodhoof", "Bloodscalp", "Bonechewer", "Borean Tundra",
        "Boulderfist", "Bronzebeard", "Burning Blade", "Burning Legion", "Caelestrasz", "Cairne", "Cenarion Circle",
        "Cenarius", "Cho’gall", "Chromaggus", "Coilfang", "Crushridge", "Daggerspine", "Dalaran", "Dalvengyr",
        "Dark Iron", "Darkspear", "Darrowmere", "Dath’Remar", "Dawnbringer", "Deathwing", "Demon Soul",
        "Dentarg", "Destromath", "Dethecus", "Detheroc", "Doomhammer", "Draenor", "Dragonblight", "Dragonmaw",
        "Drak’tharon", "Drak’thul", "Draka", "Drenden", "Dunemaul", "Durotan", "Duskwood", "Earthen Ring",
        "Echo Isles", "Eitrigg", "Eldre’Thalas", "Elune", "Emerald Dream", "Eonar", "Eredar", "Executus",
        "Exodar", "Farstriders", "Feathermoon", "Fenris", "Firetree", "Fizzcrank", "Frostmane", "Frostmourne",
        "Frostwolf", "Galakrond", "Gallywix", "Garithos", "Garona", "Garrosh", "Ghostlands", "Gilneas",
        "Gnomeregan", "Goldrinn", "Gorefiend", "Gorgonnash", "Greymane", "Grizzly Hills", "Gul’dan",
        "Gundrak", "Gurubashi", "Hakkar", "Haomarush", "Hellscream", "Hydraxis", "Hyjal", "Icecrown",
        "Illidan", "Jaedenar", "Jubei’Thos", "Kael’thas", "Kalecgos", "Kargath", "Kel’Thuzad", "Khadgar",
        "Khaz Modan", "Khaz’goroth", "Kil’jaeden", "Kilrogg", "Kirin Tor", "Korgath", "Korialstrasz",
        "Kul Tiras", "Laughing Skull", "Lethon", "Lightbringer", "Lightning’s Blade", "Lightninghoof",
        "Llane", "Lothar", "Madoran", "Maelstrom", "Magtheridon", "Maiev", "Mal’Ganis", "Malfurion",
        "Malorne", "Malygos", "Mannoroth", "Medivh", "Misha", "Mok’Nathal", "Moon Guard", "Moonrunner",
        "Mug’thol", "Muradin", "Nagrand", "Nathrezim", "Nazgrel", "Nazjatar", "Nemesis", "Ner’zhul",
        "Nesingwary", "Nordrassil", "Norgannon", "Onyxia", "Perenolde", "Proudmoore", "Quel’dorei",
        "Quel’Thalas", "Ragnaros", "Ravencrest", "Ravenholdt", "Rexxar", "Rivendare", "Runetotem",
        "Sargeras", "Saurfang", "Scarlet Crusade", "Scilla", "Sen’jin", "Sentinels", "Shadow Council",
        "Shadowmoon", "Shadowsong", "Shandris", "Shattered Halls", "Shattered Hand", "Shu’halo",
        "Silver Hand", "Silvermoon", "Sisters of Elune", "Skullcrusher", "Skywall", "Smolderthorn",
        "Spinebreaker", "Spirestone", "Staghelm", "Steamwheedle Cartel", "Stonemaul", "Stormrage",
        "Stormreaver", "Stormscale", "Suramar", "Tanaris", "Terenas", "Terokkar", "Thaurissan", "The Forgotten Coast",
        "The Scryers", "The Underbog", "The Venture Co", "Thorium Brotherhood", "Thrall", "Thunderhorn",
        "Thunderlord", "Tichondrius", "Tol Barad", "Tortheldrin", "Trollbane", "Turalyon", "Twisting Nether",
        "Uldaman", "Uldum", "Undermine", "Ursin", "Uther", "Vashj", "Vek’nilash", "Velen", "Warsong",
        "Whisperwind", "Wildhammer", "Windrunner", "Winterhoof", "Wyrmrest Accord", "Ysera", "Ysondre",
        "Zangarmarsh", "Zul’jin", "Zuluhed"
    ];

    const validateField = (field, value) => {
        switch (field) {
            case 'name': return value.trim() ? '' : 'Character name is required';
            case 'server': return value && usServers.includes(value) ? '' : 'Please select a valid server';
            case 'role': return value ? '' : 'Role is required';
            default: return '';
        }
    };

    const handleBlur = (field, value) => {
        setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    };

    const validateAll = () => {
        const newErrors = {
            name: validateField('name', name),
            server: validateField('server', server),
            role: validateField('role', role),
        };
        setErrors(newErrors);
        return Object.values(newErrors).every(err => !err);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateAll()) return;

        setLoading(true);
        try {
            const res = await fetch("/api/roster", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, server, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors({ form: data.error || "Failed to add raider" });
            } else {
                onAdd(data.raider);
                setName("");
                setRole("");
                setServer("Tichondrius");
                setErrors({});
            }
        } catch (err) {
            setErrors({ form: err.message || "Unexpected error" });
        } finally {
            setLoading(false);
        }
    };

    // Filter servers for autocomplete feel
    const filteredServers = usServers.filter(s => s.toLowerCase().includes(server.toLowerCase()));

    return (
        <div className="bg-black/95 border border-blue-500/30 p-6 relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

            <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="border-b border-blue-500/20 pb-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">
                        Initialize New Unit
                    </h2>
                    <p className="text-xs text-blue-400/60 font-mono mt-1 uppercase tracking-wider">
                        // Unit Registration Protocol
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Character Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                            Unit Identification (Name) *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => handleBlur('name', name)}
                            className={`
                                w-full bg-black/50 border text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors tracking-wider
                                ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}
                            `}
                            placeholder="Enter character name..."
                        />
                        {errors.name && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.name}</span>}
                    </div>

                    {/* Server Selection (Custom Autocomplete) */}
                    <div className="space-y-2 relative">
                        <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                            Realm Assignment (Server) *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={server}
                                onChange={(e) => {
                                    setServer(e.target.value);
                                    setServerListOpen(true);
                                }}
                                onFocus={() => setServerListOpen(true)}
                                onBlur={() => {
                                    handleBlur('server', server);
                                    setTimeout(() => setServerListOpen(false), 200);
                                }}
                                className={`
                                    w-full bg-black/50 border text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors tracking-wider
                                    ${errors.server ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}
                                `}
                                placeholder="Select or type server name..."
                            />
                            {serverListOpen && filteredServers.length > 0 && (
                                <div className="absolute top-full left-0 w-full max-h-48 overflow-y-auto bg-black border border-blue-500/30 z-50 mt-1 custom-scrollbar">
                                    {filteredServers.map(s => (
                                        <div
                                            key={s}
                                            onClick={() => { setServer(s); setServerListOpen(false); }}
                                            className="px-4 py-2 hover:bg-blue-900/50 cursor-pointer text-xs text-gray-300 font-mono uppercase border-b border-white/5 last:border-b-0"
                                        >
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.server && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.server}</span>}
                    </div>

                    {/* Role Allocation */}
                    <div className="space-y-3">
                        <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                            Combat Role Allocation *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'TANK', label: 'Tank' },
                                { id: 'HEALER', label: 'Healer' },
                                { id: 'MELEEDPS', label: 'Melee DPS' },
                                { id: 'RANGEDPS', label: 'Ranged DPS' }
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setRole(r.id)}
                                    className={`
                                        px-4 py-3 border text-xs font-bold uppercase tracking-widest transition-all
                                        ${role === r.id
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                            : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/5 hover:text-white hover:border-blue-500/30'}
                                    `}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                        {errors.role && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.role}</span>}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                    {/* Error Banner */}
                    {errors.form && (
                        <div className="bg-red-500/10 border border-red-500/50 p-3 text-center animate-pulse">
                            <span className="text-red-200 text-xs font-mono uppercase tracking-wide">⚠ {errors.form}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 uppercase tracking-[0.2em] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ clipPath: "polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)" }}
                    >
                        {loading ? "PROCESSING..." : "REGISTER UNIT"}
                    </button>

                </form>
            </div>
        </div>
    );
}