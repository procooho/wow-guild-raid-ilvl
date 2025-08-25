import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function NavBar() {
  return <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link href={"/"}>
            <Typography variant="h6" component="div" sx={{ cursor: "pointer" }}>
              Home
            </Typography>
          </Link>
        </Box>
        <Link href={"/currentGuildRoster"}>
          <Typography variant="h6" component="div" sx={{ cursor: "pointer", pr: 2 }}>
            Current Roster
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  </Box>
}