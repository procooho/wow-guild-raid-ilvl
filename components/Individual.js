import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Individual({ raider }) {
    const [charInfo, setCharInfo] = useState(null);
    const [progress, setProgress] = useState(null);
    const [lastChecked, setLastChecked] = useState(null);

    useEffect(() => {
        if (raider?.name && raider?.server) fetchCharacterInfo();
    }, [raider]);

    async function fetchCharacterInfo() {
        try {
            //get blizzard api
            const res = await fetch('/api/characterInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: raider.name, server: raider.server, role: raider.role }),
            });

            //show error if failed
            if (!res.ok) {
                const data = await res.json();
                console.error(`Error fetching ${raider.name}:`, data.error);
                return;
            }

            const data = await res.json();
            setCharInfo(data.profile);
            setLastChecked(new Date(data.raider.lastChecked));

            // Calculate item level progress
            if (data.raider.history?.length >= 2) {
                const diff = data.raider.history[0].ilvl - data.raider.history[1].ilvl;
                setProgress(diff);
            }
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    }

    //if noting provided, do nothing
    if (!raider) return null;

    return (
        <Card variant="outlined" sx={{ marginBottom: 2, width: "40%" }}>
            <Box sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{raider.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{raider.server}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Stack direction="column" alignItems="center">
                        <Typography variant="body1">Role</Typography>
                        <Typography variant="body2" color="text.secondary">{raider.role}</Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>Class</Typography>
                        <Typography variant="body2" color="text.secondary">{charInfo?.characterClass || "Unknown"}</Typography>
                    </Stack>
                    <Stack direction="column" alignItems="center">
                        <Typography variant="body1" sx={{ mt: 1 }}>Race</Typography>
                        <Typography variant="body2" color="text.secondary">{charInfo?.race || "Unknown"}</Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>Faction</Typography>
                        <Typography variant="body2" color="text.secondary">{charInfo?.faction || "Unknown"}</Typography>
                    </Stack>

                    <Stack direction="column" alignItems="center">
                        <Typography variant="h5">Item Level</Typography>
                        <Typography variant="body2" color="text.secondary">{raider.currentIlvl ?? 0}</Typography>
                        
                        {progress !== null && (
                            <>
                                <Typography variant="body2" sx={{ mt: 1 }}>Since last check:</Typography>
                                <Typography variant="body2" color={progress >= 0 ? "green" : "red"}>
                                    {progress >= 0 ? `+${progress}` : progress}
                                </Typography>
                            </>
                        )}

                        {lastChecked && (
                            <Typography variant="caption" sx={{ mt: 1 }}>
                                Last checked: {new Date(lastChecked).toLocaleString()}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Card>
    );
}
