import { useState } from "react";
import { Stack, Typography, Paper, IconButton, Collapse, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Image from "next/image";

// For main page roster summary

export default function RosterSummary({ roster }) {

    //Collapsable individually
    const [collapsed, setCollapsed] = useState({
        TANK: true,
        HEALER: true,
        DPS: true,
    });

    //Toggle individually
    const toggleCollapse = (role) => {
        setCollapsed((prev) => ({ ...prev, [role]: !prev[role] }));
    };

    const roles = ["TANK", "HEALER", "DPS"];

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
        DPS: "/1.png",
    };

    const getClassIcon = (className) => classIconMap[className] || "/unknown.png";

    // Group raiders by role
    const groupedRaiders = roles.reduce((acc, role) => {
        acc[role] = roster.filter((r) => r.role.toUpperCase() === role);
        return acc;
    }, {});

    // Count raiders per class
    const classCounts = Object.keys(classIconMap).reduce((acc, className) => {
        acc[className] = roster.filter((r) => r.characterClass === className).length;
        return acc;
    }, {});

    // Calculate average item level
    const averageIlvl =
        roster.length > 0
            ? roster.reduce((sum, r) => sum + (r.currentIlvl || 0), 0) / roster.length
            : 0;

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

            {/* Class Summary */}
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
                {Object.entries(classCounts).map(([className, count]) => (
                    <Stack
                        key={className}
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{ mr: 2, mb: 1 }}
                    >
                        <Image
                            src={getClassIcon(className)}
                            alt={className}
                            width={20}
                            height={20}
                        />
                        <Typography variant="body2" sx={{ color: 'black' }}>{count}</Typography>
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
                                    alt={[role]}
                                    width={24}
                                    height={24}
                                />
                                <Typography variant="h6">
                                    {role} ({groupedRaiders[role].length})
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
        </Stack>
    );
}
