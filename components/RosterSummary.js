import { useState, useEffect } from "react";
import { Stack, Typography, Paper, IconButton, Collapse, Grid, Button, Snackbar, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Image from "next/image";

// For roster summary

export default function RosterSummary({ roster }) {
    //Collapsable individually
    const [collapsed, setCollapsed] = useState({ TANK: true, HEALER: true, MELEEDPS: true, RANGEDPS: true });
    const [updatedRoster, setUpdatedRoster] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    const roles = ["TANK", "HEALER", "MELEEDPS", "RANGEDPS"];

    //Icons
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

    const roleIconMap = {
        TANK: "/2.png",
        HEALER: "/3.png",
        MELEEDPS: "/1.png",
        RANGEDPS: "/4.png",
    };

    const getClassIcon = (className) => classIconMap[className] || "/unknown.png";

    // show info snackbar on initial load
    useEffect(() => {
        setUpdatedRoster(roster);
        setSnackbar({
            open: true,
            message: "Displaying saved data. Press 'Refresh All Item Level' to get the latest data.",
            severity: "info",
        });
    }, [roster]);

    //Toggle individually
    const toggleCollapse = (role) => setCollapsed((prev) => ({ ...prev, [role]: !prev[role] }));

    const roleDisplayMap = {
        TANK: "TANK",
        HEALER: "HEALER",
        MELEEDPS: "MELEE DPS",
        RANGEDPS: "RANGE DPS",
    };

    const groupedRaiders = roles.reduce((acc, role) => {
        acc[role] = updatedRoster.filter((r) => r.role.trim().toUpperCase() === role);
        return acc;
    }, {});

    const classCounts = Object.keys(classIconMap).reduce((acc, className) => {
        acc[className] = updatedRoster.filter((r) => r.characterClass === className).length;
        return acc;
    }, {});

    const averageIlvl =
        updatedRoster.length > 0
            ? updatedRoster.reduce((sum, r) => sum + (r.currentIlvl || 0), 0) / updatedRoster.length
            : 0;

    const fetchRosterItemLevels = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rosterItemLevels");
            if (!res.ok) throw new Error(`Failed with status ${res.status}`);
            const data = await res.json();
            setUpdatedRoster(data);
            setSnackbar({ open: true, message: "Roster item levels refreshed!", severity: "success" });
        } catch (err) {
            console.error("Failed to fetch item levels:", err);
            setSnackbar({ open: true, message: "Failed to refresh item levels.", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2} sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ color: 'black' }}>
                Guild Roster Summary - Avg. Item Level: {averageIlvl.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>
                Showing the average item level of the character has in the bag.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                The actual equipped item level may be lower.
            </Typography>

            <Button
                variant="outlined"
                sx={{ mt: 2, border: "2px solid", backgroundColor: "#1E1E1E", color: "#fff", "&:hover": { backgroundColor: "#c9c9c9ff", color: "#111" } }}
                fullWidth
                onClick={fetchRosterItemLevels}
                disabled={loading}
            >
                {loading ? "Refreshing..." : "Refresh All Item Level"}
            </Button>

            <Typography variant="body2" sx={{ mb: 2, color: 'black', textAlign: 'center' }}>
                (Item Level only refreshes once a day)
            </Typography>

            {/* Class Summary */}
            <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent={"center"} sx={{ mt: 1, mb: 2 }}>
                {Object.entries(classCounts).map(([className, count]) => (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        key={className}
                        sx={{ mr: 2, mb: 1 }}>
                        <Image
                            src={getClassIcon(className)}
                            alt={className}
                            width={24}
                            height={24}
                        />
                        <Typography variant="body1" sx={{ color: 'black' }}>{count}</Typography>
                    </Stack>
                ))}
            </Stack>

            {/* Role Panels */}
            <Grid container spacing={2}>
                {roles.map((role) => (
                    <Grid key={role}>
                        <Paper sx={{ p: 2 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Image
                                    src={roleIconMap[role]}
                                    alt={role}
                                    width={24}
                                    height={24}
                                />
                                <Typography variant="h6" sx={{ml:2}}>
                                    {roleDisplayMap[role]} ({groupedRaiders[role].length})
                                </Typography>
                                <IconButton size="small" onClick={() => toggleCollapse(role)}>
                                    {collapsed[role] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                </IconButton>
                            </Stack>

                            <Collapse in={!collapsed[role]}>
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {groupedRaiders[role].map((raider) => (
                                        <Stack direction="row" alignItems="center" spacing={1} key={raider.id}>
                                            <Image
                                                src={getClassIcon(raider.characterClass)}
                                                alt={raider.characterClass || "Unknown"}
                                                width={24}
                                                height={24}
                                            />
                                            <Typography>
                                                {raider.name} (ILvl: {raider.currentIlvl || 0})
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Collapse>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={10000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "80vw" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
