import { useEffect, useState } from "react";
import { Box, CircularProgress, Container, Divider, Button, Dialog, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import LeftNav from "../components/LeftNav";
import AddRaider from "../components/AddRaider";
import RaidRoster from "../components/RaidRoster";
import { getRoster } from "../utils/api/roster";
import ProtectedRoute from "../components/ProtectedRoute";

export default function CurrentGuildRoster() {
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false)

  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        <Box sx={{ display: "flex", ...(!isMobile && { ml: 7 }) }}>
          <Box sx={{ width: isMobile ? 200 : 240, flexShrink: 0 }}>
            <LeftNav />
          </Box>
          <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Container>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", ...(!isMobile && { ml: 7 }) }}>
        {!isMobile && (
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <LeftNav />
          </Box>
        )}
        <Container sx={{ mb: 5, mt: 5 }}>
          <Divider />

          {/* Add Raider Button */}
          <Button
            variant="outlined"
            onClick={() => setAddModalOpen(true)}
            sx={{
              mt: 2,
              mb: 2,
              border: "2px solid",
              backgroundColor: "#1E1E1E",
              color: "#fff",
              "&:hover": { backgroundColor: "#c9c9c9ff", color: "#111" },
            }}
            fullWidth>
            Add Raider
          </Button>

          {/* Add Raider Modal */}
          <Dialog
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <AddRaider
              onAdd={(newRaider) => {
                setRoster(prev => {
                  if (prev.some(r => r.id === newRaider.id)) return prev;
                  return [newRaider, ...prev];
                });
                setAddModalOpen(false);
              }}
            />
          </Dialog>

          <Divider />

          {/* Roster list & details */}
          <RaidRoster
            roster={roster}
            onDelete={(id) => setRoster(prev => prev.filter(r => r.id !== id))}
          />
        </Container>
        {isMobile && <LeftNav />}
      </Box>
    </ProtectedRoute>
  );
}