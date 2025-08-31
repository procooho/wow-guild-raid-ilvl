import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Autocomplete, Divider, Paper } from '@mui/material';
import { useState } from 'react';
import { useThemeContext } from "@/context/ThemeContext";

//Component for add raider

export default function AddRaider({ onAdd }) {
    const [name, setName] = useState("");
    const [server, setServer] = useState("");
    const [role, setRole] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { darkMode } = useThemeContext();

    //All US server lists
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

    //validate form when submit
    const validateField = (field, value) => {
        switch (field) {
            case 'name': return value.trim() ? '' : 'Character name is required';
            case 'server': return value && usServers.includes(value) ? '' : 'Please select a valid server';
            case 'role': return value ? '' : 'Role is required';
            default: return '';
        }
    };

    //validate form when user leaves field
    const handleBlur = (field, value) => {
        setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    };

    //validate form when submit
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
        setSuccess("");

        try {
            const res = await fetch("/api/roster", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, server, role }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setErrors({ form: data.error || "Failed to add raider" });
            } else {
                setSuccess(`Raider "${data.raider.name}" added as Role "${data.raider.role}" successfully!`);
                setErrors({});

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (err) {
            setErrors({ form: err.message || "Unexpected error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 2, px: 5, mb: 5 }}>
                <TextField
                    label="Character Name (Case Insensitive)"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name', name)}
                    error={!!errors.name}
                    helperText={errors.name}
                    disabled={loading || !!success}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:hover:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& input': {
                            color: darkMode ? '#fff' : '#000',
                        },
                    }}
                />
                <Autocomplete
                    options={usServers}
                    value={server}
                    onChange={(event, newValue) => setServer(newValue)}
                    onBlur={() => handleBlur('server', server)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Server"
                            variant="standard"
                            fullWidth
                            error={!!errors.server}
                            helperText={errors.server}
                        />
                    )}
                    freeSolo
                    disabled={loading || !!success}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:hover:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& input': {
                            color: darkMode ? '#fff' : '#000',
                        },
                    }}
                />
                <FormControl
                    fullWidth
                    error={!!errors.role}
                    disabled={loading || !!success}
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiSelect-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: darkMode ? '#fff' : '#000',
                        },
                    }}
                >
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        onBlur={() => handleBlur('role', role)}
                    >
                        <MenuItem value="TANK">Tank</MenuItem>
                        <MenuItem value="MELEEDPS">MELEE DPS</MenuItem>
                        <MenuItem value="RANGEDPS">RANGE DPS</MenuItem>
                        <MenuItem value="HEALER">Healer</MenuItem>
                    </Select>
                </FormControl>

                {/* Error message */}
                {errors.form && (
                    <Paper sx={{ color: 'red', p: 2, mt: 2 }}>
                        {errors.form}
                    </Paper>
                )}

                {/* Submit button hidden after success */}
                {!success && (
                    <Button
                        type="submit"
                        variant="outlined"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#1E1E1E',
                            color: '#fff',
                            border: `2px solid ${darkMode ? '#fff' : '#000'}`,
                            '&:hover': {
                                backgroundColor: '#c9c9c9ff',
                                color: '#111',
                                border: `2px solid ${darkMode ? '#fff' : '#000'}`,
                            },
                        }}
                    >
                        {loading ? "Adding..." : "Add New Raider"}
                    </Button>
                )}

                {/* Success message */}
                {success && (
                    <Paper sx={{ color: 'green', p: 2, mt: 2 }}>
                        {success}
                    </Paper>
                )}
            </Stack>
            <Divider />
        </form>
    );
}