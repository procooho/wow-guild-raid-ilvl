import LeftNav from "@/components/LeftNav";
import RosterSummary from "@/components/RosterSummary";
import { Box, Container, CircularProgress, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';

export default function RosterSummaryPage() {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        async function fetchRoster() {
            try {
                const res = await fetch("/api/roster");
                const data = await res.json();
                setRoster(data);
            } catch (err) {
                console.error("Failed to fetch roster:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchRoster();
    }, []);

    if (loading) {
        return (
            <main>
                <Box sx={{ display: "flex", ...(!isMobile && { ml: 8 }) }}>
                    {!isMobile && (
                        <Box sx={{ width: 240, flexShrink: 0 }}>
                            <LeftNav />
                        </Box>
                    )}
                    <Container>
                        <Box sx={{ display: 'flex', paddingTop: 4, justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    </Container>
                    {isMobile && <LeftNav />}
                </Box>
            </main>
        );
    }

    return (
        <main>
            <Box sx={{ display: "flex", ...(!isMobile && { ml: 8 }) }}>
                {!isMobile && (
                    <Box sx={{ width: 240, flexShrink: 0 }}>
                        <LeftNav />
                    </Box>
                )}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <RosterSummary roster={roster} />
                </Box>
                {isMobile && <LeftNav />}
            </Box>
        </main>
    );
}
