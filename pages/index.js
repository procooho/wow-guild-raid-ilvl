import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import LeftNav from "@/components/LeftNav";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <main>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: "100vh",
          ...(!isMobile && { ml: 7 })
        }}
      >

        <Box sx={{ width: isMobile ? 200 : 240, flexShrink: 0 }}>
          <LeftNav />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: isMobile ? 2 : 10,
            p: isMobile ? 2 : 0,
            width: "100%",
          }}
        >
          <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
            Guild Raid Information
          </Typography>

          <Image src="/logo.png" alt="Logo" width={600} height={300} style={{ maxWidth: "100%", height: "auto" }} />

          <Typography variant="h4" sx={{ mt: 3, textAlign: "center" }}>
            TWW S3
          </Typography>
          <Typography variant="h4" sx={{ mt: 2, textAlign: "center" }}>
            Roster Updated!
          </Typography>
          <Typography variant="h4" sx={{ mt: 2, textAlign: "center" }}>
            Raid Log Page Updated!
          </Typography>
        </Box>
      </Box>
    </main>
  );
}