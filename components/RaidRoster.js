import { useState, useEffect } from 'react';
import { Typography, TextField, Grid, Paper, Container, Button, Snackbar, Alert } from '@mui/material';
import RosterList from './RosterList';
import Individual from './Individual';

// Main template for roster list and details
export default function RaidRoster({ roster }) {
  const [search, setSearch] = useState('');
  const [selectedRaider, setSelectedRaider] = useState(null);

  // initialize with passed roster
  const [updatedRoster, setUpdatedRoster] = useState(roster);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Sync with roster immediately
  useEffect(() => {
    setUpdatedRoster(roster);
  }, [roster]);

  // show info snackbar on initial load
  useEffect(() => {
    setSnackbar({
      open: true,
      message: "Displaying saved data. Press 'Refresh All Item Level' to get the latest data.",
      severity: 'info',
    });
  }, []);

  const fetchRosterItemLevels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rosterItemLevels');
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();
      setUpdatedRoster(data);

      setSnackbar({ open: true, message: 'Roster item levels refreshed!', severity: 'success' });
    } catch (err) {
      console.error("Failed to fetch item levels:", err);
      setUpdatedRoster(roster);
      setSnackbar({ open: true, message: 'Failed to refresh item levels.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
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

      <Button
        variant="outlined"
        sx={{
          mt: 2, mb: 2, border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff',
          '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' },
        }}
        fullWidth
        onClick={fetchRosterItemLevels}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh All Item Level'}
      </Button>

      <Typography variant="body2" sx={{ mb: 2, color: 'black', textAlign: 'center' }}>
        (Item Level only refreshes once a day)
      </Typography>

      {/* Left & Right Panels */}
      <Grid container spacing={2}>
        {/* Left: Roster list */}
        <Grid>
          <Paper
            sx={{
              maxHeight: '70vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '10px' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#1E1E1E',
                borderRadius: '5px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#c5c5c5ff',
                borderRadius: '5px',
              },
              padding: 1
            }}
          >
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
                  boxShadow: selectedRaider?.id === raider.id ? '0 8px 12px #1E1E1E' : '0 2px 6px #414247ff',
                }}
              >
                <RosterList raider={raider} onDelete={handleDeleteRaider} />
              </div>
            ))}
          </Paper>
        </Grid>

        {/* Right: Detail panel */}
        <Grid>
          {selectedRaider ? (
            <Paper sx={{ padding: 2 }}>
              <Individual raider={selectedRaider} />
            </Paper>
          ) : (
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h5" sx={{ padding: 2, color: 'black', textAlign: 'center' }}>
                Select a raider to see details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={10000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ width: '100%' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '80vw' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
