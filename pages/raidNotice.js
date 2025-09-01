import { useEffect, useState } from "react";
import { Box, Container, Stack, Typography, Button, Dialog, Divider, TextField, Pagination, FormControlLabel, Switch } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";

import NoticeForm from "@/components/NoticeForm";
import NoticeItem from "@/components/NoticeItem";
import LeftNav from "@/components/LeftNav";
import { useAuth } from "@/context/AuthContext";

export default function RaidNotice() {
    const { darkMode } = useThemeContext();
    const { loggedIn } = useAuth();
    const [notices, setNotices] = useState([]);
    const [editingNotice, setEditingNotice] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const noticesPerPage = 5;

    const fetchNotices = async (showAll = false) => {
        try {
            const res = await fetch(`/api/notice${showAll ? "?showAll=true" : ""}`);
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
        fetchNotices(loggedIn ? showAll : false);
    }, [loggedIn, showAll]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this notice?")) return;
        try {
            const res = await fetch(`/api/notice/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to delete notice:", text);
                return;
            }
            fetchNotices(loggedIn ? showAll : false);
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingNotice(null);
    };

    // Filter notices by search and view
    const filteredNotices = notices.filter((n) => {
        const query = searchQuery.trim().toLowerCase();

        const matchesQuery =
            n.title.toLowerCase().includes(query) ||
            (n.note && n.note.toLowerCase().includes(query)) ||
            new Date(n.createdAt).toLocaleDateString("en-CA").includes(query);

        // showAll switch only for logged-in users
        const matchesView = !loggedIn || showAll || n.view;

        return matchesQuery && matchesView;
    });

    // Pagination
    const indexOfLastNotice = currentPage * noticesPerPage;
    const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
    const currentNotices = filteredNotices.slice(indexOfFirstNotice, indexOfLastNotice);
    const totalPages = Math.ceil(filteredNotices.length / noticesPerPage);

    return (
        <Box sx={{ display: "flex" }}>
            <LeftNav />
            <Container maxWidth="md" sx={{ py: 4 }}>

                {/* Add New Notice Button (only for logged-in users) */}
                {loggedIn && (
                    <>
                        <Divider />
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
                            Add New Notice
                        </Button>
                        <Divider />
                    </>
                )}

                {/* Modal */}
                <Dialog open={modalOpen || !!editingNotice} onClose={handleCloseModal} fullWidth maxWidth="md">
                    <NoticeForm
                        darkMode={darkMode}
                        editingNotice={editingNotice}
                        onSaved={() => {
                            handleCloseModal();
                            fetchNotices();
                        }}
                        onCancel={handleCloseModal}
                    />
                </Dialog>

                <Typography variant="h4" textAlign={"center"} sx={{ mt: 3 }}>
                    Notices
                </Typography>

                {/* Search */}
                <TextField
                    label="Search by Title, Note, Date"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    fullWidth
                    sx={{
                        my: 2,
                        backgroundColor: darkMode ? "#333" : "#fff",
                        '& .MuiInputLabel-root': { color: darkMode ? '#fff' : '#000' },
                        '& .MuiInputLabel-root.Mui-focused': { color: darkMode ? '#fff' : '#000' },
                        '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                            '&:hover fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                            '&.Mui-focused fieldset': { borderColor: darkMode ? '#fff' : '#000' },
                        },
                    }}
                />

                {/* Show all / filter switch for logged-in users */}
                {loggedIn && (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showAll}
                                onChange={(e) => setShowAll(e.target.checked)}
                                color="default"
                            />
                        }
                        label="Show hidden post(s)"
                    />
                )}

                <Typography variant="subtitle1" textAlign={"center"}>
                    Showing {filteredNotices.length} result{filteredNotices.length !== 1 ? "s" : ""}
                </Typography>

                <Typography variant="body1" textAlign={"center"}  sx={{ mb: 2 }}>
                    ( Click post to expand )
                </Typography>

                {/* List of Notices */}
                <Stack spacing={2}>
                    {currentNotices.length > 0 ? (
                        currentNotices.map((n) => (
                            <NoticeItem
                                key={n.id}
                                notice={n}
                                darkMode={darkMode}
                                showActions={loggedIn}
                                onEdit={(n) => {
                                    setEditingNotice(n);
                                    setModalOpen(true);
                                }}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <Typography variant="h6" textAlign="center">
                            No Notices found
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
        </Box>
    );
}
