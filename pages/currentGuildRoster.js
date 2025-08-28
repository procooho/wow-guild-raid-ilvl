import { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import { getRoster } from "@/utils/api/roster";
import RaidRoster from "@/components/RaidRoster";
import { Button, Divider, Paper } from "@mui/material";
import AddRaider from "@/components/AddRaider";
import LeftNav from "@/components/LeftNav";

//Manage Roster Page

export default function CurrentGuildRoster() {
  const [roster, setRoster] = useState([]);
  const [addRaider, setAddRaider] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoster();
  }, []);

  const fetchRoster = async () => {
    try {
      const data = await getRoster();
      setRoster(data);
      setLoading(false);
    } catch (error) {
      console.error('Error Fetching Roster:', error);
    }
  };

  if (loading) {
    return (
      <main>
        <Box sx={{ display: 'flex' }}>
          <LeftNav />
          <Container>
            <Box sx={{ display: 'flex', paddingTop: 4, justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </Container>
        </Box>
      </main>
    );
  }

  return (
    <main>
      <Box sx={{ display: 'flex' }}>
        <LeftNav />
        <Container sx={{ mb: 5, mt: 5 }}>
          <Divider />
          <Button
            variant="outlined"
            onClick={() => setAddRaider(prev => !prev)}
            sx={{
              mt:2, mb:2, border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff', '&:hover': {
                backgroundColor: '#c9c9c9ff',
                color: '#111'
              },
            }}
            fullWidth>
            Add Raider
          </Button>
          {addRaider && (
            <Paper>
              <AddRaider
                onAdd={(newRaider) => setRoster(prev => [newRaider, ...prev])}
              />
            </Paper>
          )}
          <Divider />
          <RaidRoster
            roster={roster}
            onDelete={(id) => setRoster(prev => prev.filter(r => r.id !== id))}
          />
        </Container>
      </Box>
    </main>
  );
}
