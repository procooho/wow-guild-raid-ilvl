import { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import NavBar from "@/components/NavBar";
import { getRoster } from "@/utils/api/roster";
import RaidRoster from "@/components/RaidRoster";
import { Button, TextField } from "@mui/material";
import AddRaider from "@/components/AddRaider";

export default function CurrentGuildRoster() {
  const [roster, setRoster] = useState([]);
  const [addRaider, setAddRaider] = useState(true);
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

    return <main>

      <NavBar />
      <Container>
        <Button
          variant="contained"
          onClick={() => setAddRaider(prev => !prev)}>
          Add Raider
        </Button>
        {addRaider ? (
          <AddRaider />
        ) : null}
        <Box sx={{ display: 'flex', paddingTop: 4, justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>

    </main>
  }

  return (
    <main>
      <NavBar />
      <Button
        variant="contained"
        onClick={() => setAddRaider(prev => !prev)}>
        Add Raider
      </Button>
      {addRaider ? (
        <AddRaider />
      ) : null}
      <RaidRoster
        roster={roster}
      />
    </main>
  );
}
