import { useEffect, useState } from "react";
import { Box, Container, Stack, Typography, Pagination, FormControlLabel, Switch, useMediaQuery } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { useTheme } from '@mui/material/styles';

import NoticeItem from "@/components/NoticeItem";

import { useAuth } from "@/context/AuthContext";

export default function RaidNotice() {
    const { darkMode } = useThemeContext();
    const { loggedIn } = useAuth();
    const [notices, setNotices] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const noticesPerPage = 5;

    const fetchNotices = async () => {
        try {
            // Public page always fetches only visible notices
            const res = await fetch("/api/notice");
            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch notices:", text);
                return;
            }
            const data = await res.json();
            setNotices(data);
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // Filter notices by search
    const filteredNotices = notices.filter((n) => {
        const query = searchQuery.trim().toLowerCase();

        // API already filters by view=true, but we double check or just trust API.
        // If API returns only visible, n.view should be true.
        // We'll trust the API default behavior (which returns view: true only unless showAll=true).

        return (
            n.title.toLowerCase().includes(query) ||
            (n.note && n.note.toLowerCase().includes(query)) ||
            new Date(n.createdAt).toLocaleDateString("en-CA").includes(query)
        );
    });

    // Pagination
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);
    const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

    return (
        <div className="min-h-full pt-10 pb-10 px-4 md:px-8 bg-transparent">
            <div className="max-w-4xl mx-auto">

                {/* Page Header */}
                <div className="relative mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        Mission Briefings
                    </h1>
                    <div className="h-1 w-24 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_15px_#3b82f6]" />
                    <p className="text-blue-300/50 font-mono text-xs tracking-[0.5em] mt-2 uppercase">Official Guild Communications</p>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-black/40 backdrop-blur-sm border border-white/5 p-4 rounded-xl">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="SEARCH DATABASE (TITLE, NOTE, DATE)..."
                            className="w-full bg-black/50 border border-white/10 focus:border-blue-500/50 text-white font-mono text-sm px-4 py-3 outline-none transition-all placeholder:text-white/20 uppercase tracking-wider"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500/50 animate-pulse rounded-full" />
                    </div>
                </div>

                {/* Results Meta */}
                <div className="flex justify-between items-end mb-4 px-2 border-b border-white/10 pb-2">
                    <span className="text-xs font-mono text-blue-400">
                        {'//'} RECORDS_FOUND: {filteredNotices.length}
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">
                        Click Entry to Decrypt
                    </span>
                </div>

                {/* List of Notices */}
                <div className="flex flex-col gap-4">
                    {currentNotices.length > 0 ? (
                        currentNotices.map((n) => (
                            <NoticeItem
                                key={n.id}
                                notice={n}
                                darkMode={darkMode}
                                showActions={false}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                            <Typography variant="h6" className="text-white/40 font-mono uppercase tracking-widest">
                                No Records Found
                            </Typography>
                        </div>
                    )}
                </div>

                {/* Pagination (Custom Tech Buttons) */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-12 mb-8">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-2 bg-black/40 border border-white/10 text-white/70 hover:text-white hover:border-blue-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase text-xs font-bold tracking-widest"
                            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
                        >
                            &lt; PREV
                        </button>

                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black text-white italic">
                                {currentPage} <span className="text-sm text-white/30 not-italic font-normal">/ {totalPages}</span>
                            </span>
                            <div className="w-12 h-1 bg-blue-500/20 mt-1 rounded-full">
                                <div
                                    className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-300 relative"
                                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-6 py-2 bg-black/40 border border-white/10 text-white/70 hover:text-white hover:border-blue-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase text-xs font-bold tracking-widest"
                            style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)" }}
                        >
                            NEXT &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
