import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { Stack, Typography } from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import Image from 'next/image';

const drawerWidth = 240;

export default function LeftNav() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1E1E1E',
                    color: '#fff',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={180}
                    height={60}
                    style={{ width: '100%', height: 'auto' }}
                />
            </Box>
            <Box sx={{ overflow: 'auto' }}>
                <Divider />
                <Link href={"/"}>
                    <Stack direction={'row'} alignItems={'center'} sx={{ p: 2 }}>
                        <HomeFilledIcon />
                        <Typography sx={{ ml: 2 }}>Home</Typography>
                    </Stack>
                </Link>
                <Link href={"/rosterSummaryPage"}>
                    <Stack direction={'row'} alignItems={'center'} sx={{ p: 2 }}>
                        <HomeFilledIcon />
                        <Typography sx={{ ml: 2 }}>Roster Summary</Typography>
                    </Stack>
                </Link>
                <Link href={"/currentGuildRoster"}>
                    <Stack direction={'row'} alignItems={'center'} sx={{ p: 2 }}>
                        <ChecklistIcon />
                        <Typography sx={{ ml: 2 }}>Manage Raid Roster</Typography>
                    </Stack>
                </Link>
                <Divider />
            </Box>
        </Drawer>
    );
}
