import { useEffect, useState } from "react";
import { Box, Container, Stack, Typography, Button, Dialog, Divider, TextField, Pagination, useMediaQuery } from "@mui/material";
import ProtectedRoute from "../components/ProtectedRoute";
import { useThemeContext } from "@/context/ThemeContext";
import { useTheme } from "@mui/material/styles";

import OfficerPostForm from "@/components/OfficerPostForm";
import OfficerPostItem from "@/components/OfficerPostItem";


export default function RaidLog() {
    const { darkMode } = useThemeContext();
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await fetch(`/api/officer-posts/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to delete post:", text);
                return;
            }
            fetchPosts();
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingPost(null);
    };

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
        <ProtectedRoute>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Divider />

                {/* Add New Post Button */}
                <Button
                    variant="contained"
                    onClick={handleOpenModal}
                    fullWidth
                    sx={{
                        mt: 2,
                        mb: 2,
                        border: "2px solid",
                        backgroundColor: "#1E1E1E",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#c9c9c9ff", color: "#111" },
                    }}
                >
                    Add New Video / Log
                </Button>

                <Divider />

                {/* Modal */}
                <Dialog open={modalOpen || !!editingPost} onClose={handleCloseModal} fullWidth maxWidth="md">
                    <OfficerPostForm
                        darkMode={darkMode}
                        editingPost={editingPost}
                        onSaved={() => {
                            handleCloseModal();
                            fetchPosts();
                        }}
                        onCancel={handleCloseModal}
                    />
                </Dialog>

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
                                onEdit={(post) => {
                                    setEditingPost(post);
                                    setModalOpen(true);
                                }}
                                onDelete={handleDelete}
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
                            variant="outlined"
                            shape="rounded"
                        />
                    </Box>
                )}
            </Container>
        </ProtectedRoute>
    );
}