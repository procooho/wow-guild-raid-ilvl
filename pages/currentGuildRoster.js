import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTheme } from '@mui/material/styles';

import LeftNav from "../components/LeftNav";
import AddRaider from "../components/AddRaider";
import RaidRoster from "../components/RaidRoster";
import { getRoster } from "../utils/api/roster";
import ProtectedRoute from "../components/ProtectedRoute";

export default function CurrentGuildRoster() {
  const [roster, setRoster] = useState([]);
  const [addRaider, setAddRaider] = useState(false);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    fetchRoster();
  }, []);

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const data = await getRoster();
      setRoster(data);
    } catch (error) {
      console.error('Error Fetching Roster:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box sx={{ display: 'flex' }}>
          <LeftNav />
          <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Container>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        <LeftNav />
        <Container sx={{ mb: 5, mt: 5 }}>
          <Divider />

          <Button
            variant="outlined"
            onClick={() => setAddRaider(prev => !prev)}
            sx={{
              mt: 2,
              mb: 2,
              border: "2px solid",
              backgroundColor: "#1E1E1E",
              color: "#fff",
              "&:hover": { backgroundColor: "#c9c9c9ff", color: "#111" },
            }}
            fullWidth
          >
            {addRaider ? (
              <>
                <ExpandLessIcon sx={{ mr: 1 }} />
                Add Raider
                <ExpandLessIcon sx={{ ml: 1 }} />
              </>
            ) : (
              <>
                <ExpandMoreIcon sx={{ mr: 1 }} />
                Add Raider
                <ExpandMoreIcon sx={{ ml: 1 }} />
              </>
            )}
          </Button>

          {addRaider && (
            <Paper>
              <AddRaider
                onAdd={(newRaider) => {
                  setRoster(prev => [newRaider, ...prev]);
                  fetchRoster();
                }}
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
    </ProtectedRoute>
  );
}