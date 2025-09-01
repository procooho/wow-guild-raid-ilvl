import { Box, Typography } from "@mui/material";
import Image from "next/image";
import LeftNav from "@/components/LeftNav";

export default function Home() {

  return (
    <main>
      <Box sx={{ display: 'flex' }}>
        <LeftNav />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <Typography variant="h2" sx={{ mb: 5 }}>
            Guild Raid Information
          </Typography>
          <Image src="/logo.png" alt="Logo" width={600} height={300} />
          <Typography variant="h2" sx={{ mt: 5 }}>
            TWW S3
          </Typography>
          <Typography variant="h2" sx={{ mt: 5 }}>
            Roster Updated!
          </Typography>
          <Typography variant="h2" sx={{ mt: 5 }}>
            Raid Log Page Updated!
          </Typography>
        </Box>
      </Box>
    </main>
  );
}
