import RosterSummary from "@/components/RosterSummary";
import { useEffect, useState } from "react";

export default function RosterSummaryPage() {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRoster() {
            try {
                const res = await fetch("/api/roster");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRoster(data);
                } else {
                    console.error("Roster data is not an array:", data);
                    setRoster([]);
                }
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
            <main className="min-h-full flex items-center justify-center bg-transparent text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <span className="font-mono text-sm tracking-widest animate-pulse text-blue-300">LOADING DATABASE...</span>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-full pt-10 pb-12 px-4 bg-transparent">
            <RosterSummary roster={roster} />
        </main>
    );
}
