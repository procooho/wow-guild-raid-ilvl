import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { Stack, Typography, Button, Switch, FormControlLabel, IconButton } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useThemeContext } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function LeftNav() {
    const { loggedIn, logoutUser } = useAuth();
    const router = useRouter();
    const themeContext = useThemeContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const darkMode = mounted && themeContext ? themeContext.darkMode : false;
    const toggleDarkMode = themeContext?.toggleDarkMode || (() => { });

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        logoutUser();
        router.push("/");
    };

    const drawerContent = (
        <Box sx={{ color: "#fff" }}>
            <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <Link href={"/"}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={180}
                        height={60}
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Link>
            </Box>

            <Box sx={{ overflow: 'auto' }}>
                <Divider />

                {/* Dark Mode Switch */}
                <Box sx={{ p: 2 }}>
                    <FormControlLabel
                        control={<Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            color="default"
                        />}
                        label="Dark Mode"
                    />
                </Box>

                {/* Home Link */}
                <Link href={"/"}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                    >
                        <HomeFilledIcon />
                        <Typography sx={{ ml: 2 }}>Home</Typography>
                    </Stack>
                </Link>

                {/* Notice Link */}
                <Link href={"/raidNotice"}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                    >
                        <CampaignIcon />
                        <Typography sx={{ ml: 2 }}>Notice</Typography>
                    </Stack>
                </Link>

                {/* Roster Summary */}
                <Link href={"/rosterSummaryPage"}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                    >
                        <ListAltIcon />
                        <Typography sx={{ ml: 2 }}>Roster Summary</Typography>
                    </Stack>
                </Link>

                {/* Video & Log */}
                <Link href={"/raidLogCommon"}>
                    <Stack
                        direction='row'
                        alignItems='center'
                        sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                    >
                        <OndemandVideoIcon />
                        <Typography sx={{ ml: 2 }}>Video & Log</Typography>
                    </Stack>
                </Link>

                {/* Officer Only Section */}
                <Divider
                    variant="middle"
                    sx={{
                        mt: 4,
                        mb: 2,
                        "&::before, &::after": { borderColor: "white" },
                        color: "white"
                    }}
                >
                    Officer Only
                </Divider>

                {loggedIn ? (
                    <>
                        <Link href={"/currentGuildRoster"}>
                            <Stack
                                direction='row'
                                alignItems='center'
                                sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                            >
                                <ChecklistIcon />
                                <Typography sx={{ ml: 2 }}>Manage Raid Roster</Typography>
                            </Stack>
                        </Link>

                        <Link href={"/raidLog"}>
                            <Stack
                                direction='row'
                                alignItems='center'
                                sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                            >
                                <OndemandVideoIcon />
                                <Typography sx={{ ml: 2 }}>Manage Video & Log</Typography>
                            </Stack>
                        </Link>

                        <Link href={"/updateLog"}>
                            <Stack
                                direction='row'
                                alignItems='center'
                                sx={{ p: 2, '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                            >
                                <UpgradeIcon />
                                <Typography sx={{ ml: 2 }}>Update Log</Typography>
                            </Stack>
                        </Link>
                    </>
                ) : (
                    <>
                        <Typography sx={{ px: 2, fontStyle: "italic", color: "#ccc", textAlign: "center" }}>
                            Login as Officer
                        </Typography>
                        <Typography sx={{ px: 2, fontStyle: "italic", color: "#ccc", textAlign: "center" }}>
                            to view this menu
                        </Typography>
                    </>
                )}

                {/* Login / Logout */}
                <Box sx={{ p: 2, mt: 2 }}>
                    {loggedIn ? (
                        <>
                            <Typography sx={{ mb: 1, fontSize: "0.9rem" }}>
                                Logged in as: <b>Officer</b>
                            </Typography>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleLogout}
                                sx={{
                                    border: "2px solid",
                                    backgroundColor: "#1E1E1E",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#c9c9c9ff", color: "#111" },
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href={"/login"}>
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    border: "2px solid",
                                    backgroundColor: "#1E1E1E",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#c9c9c9ff", color: "#111" },
                                }}
                            >
                                Officer Login
                            </Button>
                        </Link>
                    )}
                </Box>

                <Divider
                    variant="middle"
                    sx={{ mt: 2, borderColor: "white" }}
                />

                <Typography textAlign={"center"} sx={{ mt: 4 }}>
                    Made by:
                </Typography>
                <Typography textAlign={"center"} sx={{ mb: 4 }}>
                    Angrybites - Tichondrius
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Hamburger Button on Mobile */}
            {isMobile && (
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={handleDrawerToggle}
                    size="large"
                    sx={{
                        position: "fixed",
                        top: 10,
                        left: 20,
                        zIndex: 1300,
                        color: darkMode ? "#fff" : "gray",
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Drawer */}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                <Box
                    sx={{
                        height: "100%",
                        backgroundColor: "#1E1E1E",
                        color: "#fff",
                    }}
                >
                    {drawerContent}
                </Box>
            </Drawer>
        </>
    );
}
