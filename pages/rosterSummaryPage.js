import LeftNav from "@/components/LeftNav";
import RosterSummary from "@/components/RosterSummary";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function RosterSummaryPage() {
    const [roster, setRoster] = useState([]); // define state

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
                <Box sx={{ mt: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <RosterSummary roster={roster} /> {/* safe to use now */}
                </Box>
            </Box>
        </main>
    );
}
