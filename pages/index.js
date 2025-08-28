import { useEffect, useState } from "react";
import { Box } from "@mui/material";
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

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 20 }}>
          <Image src="/logo.png" alt="Logo" width={600} height={300} />
          {showSummary && (
            <Box sx={{ mt: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <RosterSummary roster={roster} />
            </Box>
          )}
        </Box>
      </Box>
    </main>
  );
}
