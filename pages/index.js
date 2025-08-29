import { Box, Typography } from "@mui/material";
import Image from "next/image";
import LeftNav from "@/components/LeftNav";

export default function Home() {

  return (
    <main>
      <Box sx={{ display: 'flex' }}>
        <LeftNav />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <Typography variant="h2" sx={{ mb: 5, color: 'black' }}>
            Raid Roster Manager
          </Typography>
          <Image src="/logo.png" alt="Logo" width={600} height={300} />
          <Typography variant="h2" sx={{ mt: 5, color: 'black' }}>
            TWW S3 Roster Updated!
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
