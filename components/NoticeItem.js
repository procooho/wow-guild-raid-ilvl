import { Paper, Typography, Stack, Chip, Box, Divider, Button, Collapse, IconButton } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useState } from "react";

export default function NoticeItem({ notice, darkMode, onEdit, onDelete, showActions = true }) {
    const [expanded, setExpanded] = useState(false);

    const getCollapsedNote = (text) => {
        const lines = text.split("\n");
        return lines.slice(0, 3).join("\n") + (lines.length > 3 ? ". . . . . . . . ." : "");
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-CA');

    const isUpdatedDifferent = formatDate(notice.updatedAt) !== formatDate(notice.createdAt);

    return (
        <Paper
            sx={{
                p: 2,
                backgroundColor: expanded ? (darkMode ? "#333" : "#f5f5f5") : (darkMode ? "#2b2b2b" : "#fafafa"),
                position: "relative",
                cursor: "pointer",
                border: expanded ? "2px solid #1976d2" : "1px solid #ccc",
                transition: "all 0.2s ease",
                opacity: expanded ? 1 : 0.85
            }}
            onClick={() => setExpanded(prev => !prev)}
        >
            {/* Labels in top-left corner */}
            <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 1 }}>
                {notice.important &&
                    <Chip
                        label="Important"
                        size="small"
                        sx={{ backgroundColor: "#d32f2f", color: "#fff", fontWeight: "bold" }}
                    />}
                {notice.isNew &&
                    <Chip
                        label="New"
                        size="small"
                        sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}
                    />}
                {!notice.view &&
                    <Chip
                        label="Removed From View"
                        size="small"
                        sx={{ backgroundColor: "#949494ff", color: "#fff", fontWeight: "bold" }}
                    />}
            </Box>

            {/* Collapsed indicator */}
            {!expanded && (
                <Chip
                    label="Collapsed"
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8, fontStyle: "italic" }}
                />
            )}

            {/* Title and dates */}
            <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                alignItems={"center"}
                justifyContent={"space-between"}
                sx={{ mt: 3 }}
            >
                <Typography variant="h5">{notice.title}</Typography>
                <Stack>
                    <Typography variant="subtitle1">
                        Originally Created: {formatDate(notice.createdAt)}
                    </Typography>
                    {/* Show updated date if it's different with created date */}
                    {notice.updatedAt && isUpdatedDifferent && (
                        <Typography variant="subtitle1">
                            Last Updated: {formatDate(notice.updatedAt)}
                        </Typography>
                    )}
                </Stack>
            </Stack>

            {/* Notes */}
            <Typography
                variant="subtitle1"
                sx={{
                    mt: 1,
                    whiteSpace: 'pre-line',
                    fontStyle: !expanded ? 'italic' : 'normal',
                    color: !expanded ? 'grayText' : 'inherit'
                }}
            >
                {expanded ? notice.note : getCollapsedNote(notice.note)}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setExpanded(prev => !prev); }}
                    sx={{ color: darkMode ? "#fff" : "#000" }}
                >
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Divider sx={{ my: 1 }} />

                <Box sx={{ my: 1 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems={"center"}>
                        <Typography variant="subtitle1">Link(s):</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {notice.links.length > 0 ? (
                                notice.links.map((l, index) => (
                                    <Chip
                                        key={l.id}
                                        label={l.description || `Link ${index + 1}`}
                                        component="a"
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        clickable
                                        variant={darkMode ? "filled" : "outlined"}
                                        icon={<LinkIcon />}
                                        sx={{
                                            mb: 0.5,
                                            fontSize: "0.9rem",
                                            color: "#111",
                                            backgroundColor: darkMode ? "#cdc57b" : "#fff",
                                            "& .MuiChip-icon": { color: darkMode ? "#333" : "#555" },
                                            "&:hover": {
                                                color: darkMode ? "#fff" : "#111",
                                                backgroundColor: darkMode ? "#817b5dff" : "#1976d262",
                                                "& .MuiChip-icon": { color: darkMode ? "#fff" : "#111" },
                                            },
                                        }}
                                    />
                                ))
                            ) : (
                                <Chip
                                    label="No Links"
                                    variant={darkMode ? "filled" : "outlined"}
                                    icon={<ClearIcon />}
                                    sx={{ mb: 0.5, fontSize: "0.9rem" }}
                                />
                            )}
                        </Stack>
                    </Stack>
                </Box>

                {showActions && (
                    <Stack direction="row" justifyContent={"center"} spacing={1} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => onEdit(notice)}
                            sx={{
                                width: '40%',
                                backgroundColor: '#1E1E1E',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' }
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => onDelete(notice.id)}
                            sx={{
                                width: '40%',
                                backgroundColor: '#1E1E1E',
                                color: '#fff',
                                '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' }
                            }}
                        >
                            Delete (Remove From Database)
                        </Button>
                    </Stack>
                )}
            </Collapse>
        </Paper>
    );
}
