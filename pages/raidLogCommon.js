import { useEffect, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import OfficerPostItem from "@/components/OfficerPostItem";

export default function RaidLogCommon() {
    const { darkMode } = useThemeContext();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/officer-posts");
            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch posts:", text);
                return;
            }
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filter posts
    const filteredPosts = posts.filter((post) => {
        const query = searchQuery.trim().toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            (post.description && post.description.toLowerCase().includes(query)) ||
            new Date(post.createdAt).toLocaleDateString("en-CA").includes(query)
        );
    });

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
        <div className="min-h-full pt-10 pb-10 px-4 md:px-8 bg-transparent">
            <div className="max-w-4xl mx-auto">

                {/* Page Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                        Raid Recordings & Logs
                    </h1>
                    <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full shadow-[0_0_15px_#3b82f6] mb-3" />
                    <p className="text-blue-300/50 font-mono text-xs tracking-[0.5em] uppercase">
                        Official Raid Archives
                    </p>
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
                            placeholder="SEARCH DATABASE (TITLE, DESCRIPTION, DATE)..."
                            className="w-full bg-black/50 border border-white/10 focus:border-blue-500/50 text-white font-mono text-sm px-4 py-3 outline-none transition-all placeholder:text-white/20 uppercase tracking-wider"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500/50 animate-pulse rounded-full" />
                    </div>
                </div>

                {/* Results Meta */}
                <div className="flex justify-between items-end mb-4 px-2 border-b border-white/10 pb-2">
                    <span className="text-xs font-mono text-blue-400">
                        {'//'} RECORDS_FOUND: {filteredPosts.length}
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">
                        Click Entry to View Details
                    </span>
                </div>

                {/* List of Posts */}
                <div className="flex flex-col gap-4">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                            <OfficerPostItem
                                key={post.id}
                                post={post}
                                darkMode={darkMode}
                                showActions={false}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                            <p className="text-white/40 font-mono uppercase tracking-widest text-lg">
                                No Records Found
                            </p>
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
