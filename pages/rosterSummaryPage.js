import LeftNav from "@/components/LeftNav";
import RosterSummary from "@/components/RosterSummary";
import { Box, Container, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function RosterSummaryPage() {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <Box sx={{ display: 'flex' }}>
                    <LeftNav />
                    <Container>
                        <Box sx={{ display: 'flex', paddingTop: 4, justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    </Container>
                </Box>
            </main>
        );
    }

    return (
        <main>
            <Box sx={{ display: 'flex' }}>
                <LeftNav />
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <RosterSummary roster={roster} />
                </Box>
            </Box>
        </main>
    );
}
