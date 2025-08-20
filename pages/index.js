import { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import NavBar from "@/components/NavBar";

export default function Home() {
  const [loading, setLoading] = useState(true);

  if (loading) {

    return  <main>
      
      <NavBar />
      <Container>
        <Box sx={{ display: 'flex', paddingTop: 4, justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
      
    </main>
  }

  return (
    <main>
      <NavBar />
    </main>
  );
}
