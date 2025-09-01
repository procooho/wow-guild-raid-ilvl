import { useEffect, useState } from "react";
import { Box, Container, Stack, Typography, Divider, TextField, Pagination } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";

import OfficerPostItem from "@/components/OfficerPostItem";
import LeftNav from "@/components/LeftNav";

export default function RaidLogCommon() {
    const { darkMode } = useThemeContext();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 3;

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
        <Box sx={{ display: "flex" }}>
            <LeftNav />
            <Container maxWidth="md" sx={{ py: 4 }}>

                <Typography variant="h4" textAlign={"center"} sx={{ my: 3 }}>
                    Raid Recordings & Logs
                </Typography>

                {/* Search */}
                <TextField
                    label="Search by Title, Description, Date"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    fullWidth
                    sx={{
                        my: 2,
                        backgroundColor: darkMode ? "#333" : "#fff",
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputBase-input': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: darkMode ? '#fff' : '#000',
                            },
                            '&:hover fieldset': {
                                borderColor: darkMode ? '#fff' : '#000',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: darkMode ? '#fff' : '#000',
                            },
                        },
                    }}
                />

                <Typography variant="subtitle1" textAlign="center" sx={{ mb: 2 }}>
                    Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
                </Typography>

                {/* List of Posts */}
                <Stack spacing={2}>
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
                        <Typography variant="h6" textAlign="center">
                            No Logs found
                        </Typography>
                    )}
                </Stack>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(e, page) => setCurrentPage(page)}
                            color="primary"
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
}
