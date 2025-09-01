import { Paper, Typography, Stack, Chip, Box, Divider, Button } from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image";

export default function OfficerPostItem({ post, darkMode, onEdit, onDelete, showActions = true }) {

    return (
        <Paper sx={{ p: 2, backgroundColor: darkMode ? "#333" : "#f5f5f5" }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems={"center"} justifyContent={"space-between"}>
                <Typography variant="h5">{post.title}</Typography>
                <Typography variant="subtitle1">
                    {new Date(post.createdAt).toLocaleDateString('en-CA')}
                </Typography>
            </Stack>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, whiteSpace: 'pre-line' }}>
                {post.description}
            </Typography>

            <Divider />

            <Box sx={{ my: 1 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems={"center"}>
                    <Image
                        src={"/youtube.png"}
                        alt="Youtube"
                        width={30}
                        height={30}
                    />
                    <Typography variant="subtitle1">Youtube Link(s):</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {post.youtubeLinks.length > 0 ? (
                            post.youtubeLinks.map((y, index) => (
                                <Chip
                                    key={y.id}
                                    label={`Youtube Link ${index + 1}`}
                                    component="a"
                                    href={y.url}
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
                                        "& .MuiChip-icon": {
                                            color: darkMode ? "#333" : "#555",
                                        },
                                        "&:hover": {
                                            color: darkMode ? "#fff" : "#111",
                                            backgroundColor: darkMode ? "#817b5dff" : "#1976d262",
                                            "& .MuiChip-icon": {
                                                color: darkMode ? "#fff" : "#111",
                                            },
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

            <Divider />

            <Box sx={{ my: 1 }}>
                <Stack direction="row" flexWrap="wrap" alignItems={"center"} sx={{ ml: 0.4 }}>
                    <Image
                        src={"/wcl.png"}
                        alt="Youtube"
                        width={24}
                        height={24}
                    />
                    <Typography variant="subtitle1" sx={{ ml: 1.3, mr: 1 }}>WCL(Log) Link(s):</Typography>
                    <Stack direction="column" spacing={1} flexWrap="wrap">
                        {post.wclLinks.length > 0 ? (
                            post.wclLinks.map((w, index) => (
                                <Chip
                                    key={w.id}
                                    label={`WCL Link ${index + 1}`}
                                    component="a"
                                    href={w.url}
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
                                        "& .MuiChip-icon": {
                                            color: darkMode ? "#333" : "#555",
                                        },
                                        "&:hover": {
                                            color: darkMode ? "#fff" : "#111",
                                            backgroundColor: darkMode ? "#817b5dff" : "#1976d262",
                                            "& .MuiChip-icon": {
                                                color: darkMode ? "#fff" : "#111",
                                            },
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

            <Divider />

            {/* Only show edit/delete if NOT readOnly */}
            {showActions && (
                <Stack direction="row" justifyContent={"center"} spacing={1} sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => onEdit(post)}
                        sx={{
                            width: '40%',
                            backgroundColor: '#1E1E1E',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#c9c9c9ff',
                                color: '#111',
                            },
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => onDelete(post.id)}
                        sx={{
                            width: '40%',
                            backgroundColor: '#1E1E1E',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#c9c9c9ff',
                                color: '#111',
                            },
                        }}
                    >
                        Delete
                    </Button>
                </Stack>
            )}
        </Paper>
    );
}
