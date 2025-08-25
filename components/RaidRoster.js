import { useState, useEffect } from 'react';
import { Typography, TextField, Grid, Paper, Container } from '@mui/material';
import RosterList from './RosterList';
import Individual from './Individual';

export default function RaidRoster({ roster }) {
  const [search, setSearch] = useState('');
  const [selectedRaider, setSelectedRaider] = useState(null);
  const [updatedRoster, setUpdatedRoster] = useState([]);

  useEffect(() => {
    async function fetchRosterItemLevels() {
      try {
        const res = await fetch('/api/rosterItemLevels');
        const data = await res.json();
        setUpdatedRoster(data);
      } catch (err) {
        console.error("Failed to fetch item levels:", err);
        setUpdatedRoster(roster);
      }
    }
    fetchRosterItemLevels();
  }, [roster]);

  // Function to delete raider
  const handleDeleteRaider = (id) => {
    setUpdatedRoster(prev => prev.filter(r => r.id !== id));

    // Reset right panel if the deleted raider is selected
    setSelectedRaider(prev => (prev?.id === id ? null : prev));
  };

  // Search function
  const filteredRoster = updatedRoster
    .filter((raider) => {
      if (!search) return true;
      return raider.name.toLowerCase().includes(search.toLowerCase());
    })
    //alphabetical order
    .sort((a, b) => a.name.localeCompare(b.name));

  // Average Item Level
  const averageItemLevel = updatedRoster.length > 0
    ? updatedRoster.reduce((sum, r) => sum + (r.currentIlvl || 0), 0) / updatedRoster.length
    : 0;

  return (
    <Container sx={{ width: "80%", display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Typography variant="h4" sx={{ paddingTop: 2, paddingBottom: 2, color: 'black' }}>
        Manage Current Guild Roster
      </Typography>

      <TextField
        label="Search"
        fullWidth
        sx={{ width: '40%', marginBottom: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Typography variant="h6" align="center" sx={{ mb: 2, color: 'black' }}>
        Average Item Level of {updatedRoster.length} Raiders: {averageItemLevel.toFixed(2)}
      </Typography>
      <Typography variant="body2" sx={{ color: 'black' }}>
        Showing the average item level of the character has in the bag.
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
        The actual equipped item level may be lower.
      </Typography>

      <Grid container spacing={2}>
        {/* Left: Roster list */}
        <Grid item xs={4}>
          {filteredRoster.map((raider) => (
            <div
              key={raider.id}
              onClick={() => setSelectedRaider(raider)}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: '8px',
                transform: selectedRaider?.id === raider.id ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                boxShadow: selectedRaider?.id === raider.id ? '0 4px 12px #3d51e6ff' : '0 2px 6px #414247ff',
              }}
            >
              <RosterList raider={raider} onDelete={handleDeleteRaider} />
            </div>
          ))}
        </Grid>

        {/* Right: Detail panel */}
        <Grid item xs={8}>
          {selectedRaider ? (
            <Paper sx={{ padding: 2 }}>
              <Individual raider={selectedRaider} />
            </Paper>
          ) : (
            <Typography variant="body1" sx={{ padding: 2, color: 'black' }}>
              Select a raider to see details
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}