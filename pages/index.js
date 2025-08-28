import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import RosterSummary from "@/components/RosterSummary";
import LeftNav from "@/components/LeftNav";

export default function Home() {
  const [roster, setRoster] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function fetchRoster() {
      try {
        const res = await fetch("/api/roster");
        const data = await res.json();
        setRoster(data);
      } catch (err) {
        console.error("Failed to fetch roster:", err);
      }
    }

    fetchRoster();
  }, []);

  return (
    <main>
      <Box sx={{ display: 'flex' }}>
        <LeftNav />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <Typography variant="h2" sx={{ mb: 5, color: 'black' }}>
            Raid Roster Manager
          </Typography>
          <Image src="/logo.png" alt="Logo" width={600} height={300} />
        </Box>
      </Box>
    </main>
  );
}
