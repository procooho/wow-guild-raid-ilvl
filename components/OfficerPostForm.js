import { useState, useEffect } from "react";
import { Paper, Stack, TextField, Typography, Button, Divider } from "@mui/material";

export default function OfficerPostForm({ darkMode, onSaved, editingPost, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeLinks, setYoutubeLinks] = useState([""]);
    const [wclLinks, setWclLinks] = useState([""]);

    const [errors, setErrors] = useState({
        title: "",
        description: "",
        youtube: [],
        wcl: [],
    });

    useEffect(() => {
        if (editingPost) {
            setTitle(editingPost.title);
            setDescription(editingPost.description || "");
            setYoutubeLinks(editingPost.youtubeLinks.map(y => y.url) || [""]);
            setWclLinks(editingPost.wclLinks.map(w => w.url) || [""]);
        } else {
            setTitle("");
            setDescription("");
            setYoutubeLinks([""]);
            setWclLinks([""]);
        }
        setErrors({ title: "", description: "", youtube: [], wcl: [] });
    }, [editingPost]);

    const handleSave = async () => {
        const newErrors = { title: "", description: "", youtube: [], wcl: [] };
        let hasError = false;

        // Required fields
        if (!title.trim()) {
            newErrors.title = "Title is required";
            hasError = true;
        }
        if (!description.trim()) {
            newErrors.description = "Description is required";
            hasError = true;
        }

        // Link validation
        youtubeLinks.forEach((url, i) => {
            if (url && !url.startsWith("https://youtu.be")) {
                newErrors.youtube[i] = "Must start with https://youtu.be";
                hasError = true;
            }
        });

        wclLinks.forEach((url, i) => {
            if (url && !url.startsWith("https://www.warcraftlogs.com/")) {
                newErrors.wcl[i] = "Must start with https://www.warcraftlogs.com/";
                hasError = true;
            }
        });

        setErrors(newErrors);
        if (hasError) return;

        const data = {
            title,
            description,
            youtubeLinks: youtubeLinks.filter(Boolean),
            wclLinks: wclLinks.filter(Boolean),
        };

        try {
            let res;
            if (editingPost) {
                res = await fetch(`/api/officer-posts/${editingPost.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            } else {
                res = await fetch("/api/officer-posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            }

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to save post:", text);
                return;
            }

            onSaved();
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    return (
        <Paper sx={{ p: 3, backgroundColor: darkMode ? "#424242" : "#f9f9f9" }}>
            <Stack spacing={2}>
                <Typography variant="h6">
                    {editingPost ? "Edit Post" : "Add New Officer Post"}
                </Typography>

                <Divider />

                <TextField
                    label="Title"
                    placeholder="E.g. TWW - S3 Manaforge 7/8 Heroic"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title}
                    sx={{
                        backgroundColor: darkMode ? "#333" : "#fff",
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:hover:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& input': {
                            color: darkMode ? '#fff' : '#000',
                        },
                    }}
                    required
                />
                <Typography variant="body2">
                    (E.g. TWW S3 - Manaforge 7/8 (Heroic))
                </Typography>

                <TextField
                    label="Description"
                    placeholder="Boss Informations, Other Informations"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.description}
                    helperText={errors.description}
                    sx={{
                        backgroundColor: darkMode ? "#333" : "#fff",
                        '& .MuiInputLabel-root': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:hover:before': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: darkMode ? '#fff' : '#000',
                        },
                        '& input': {
                            color: darkMode ? '#fff' : '#000',
                        },
                    }}
                    required
                />
                <Typography variant="body2">
                    (E.g. Nexus-King Salhadaar(H) - First Kill / Dimensius(H) - Progress)
                </Typography>

                <Typography variant="body2">
                    * Please keep the Title and Description format for easy search in the future.
                </Typography>

                <Divider />

                <Typography variant="subtitle1">Youtube Links</Typography>
                {youtubeLinks.map((link, i) => (
                    <TextField
                        label="Starting with: https://youtu.be"
                        key={i}
                        value={link}
                        onChange={(e) => {
                            const copy = [...youtubeLinks];
                            copy[i] = e.target.value;
                            setYoutubeLinks(copy);
                        }}
                        fullWidth
                        error={!!errors.youtube[i]}
                        helperText={errors.youtube[i] || ""}
                        sx={{
                            backgroundColor: darkMode ? "#333" : "#fff",
                            '& .MuiInputLabel-root': {
                                color: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInput-underline:before': {
                                borderBottomColor: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInput-underline:hover:before': {
                                borderBottomColor: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: darkMode ? '#fff' : '#000',
                            },
                            '& input': {
                                color: darkMode ? '#fff' : '#000',
                            },
                        }}
                    />
                ))}
                <Button
                    onClick={() => setYoutubeLinks([...youtubeLinks, ""])}
                    variant="outlined"
                    sx={{
                        backgroundColor: '#1E1E1E',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#c9c9c9ff',
                            color: '#111',
                        },
                    }}
                >
                    Add More Youtube Link
                </Button>

                <Typography variant="subtitle1">WCL Links</Typography>
                {wclLinks.map((link, i) => (
                    <TextField
                        label="Starting with: https://www.warcraftlogs.com/"
                        key={i}
                        value={link}
                        onChange={(e) => {
                            const copy = [...wclLinks];
                            copy[i] = e.target.value;
                            setWclLinks(copy);
                        }}
                        fullWidth
                        error={!!errors.wcl[i]}
                        helperText={errors.wcl[i] || ""}
                        sx={{
                            backgroundColor: darkMode ? "#333" : "#fff",
                            '& .MuiInputLabel-root': {
                                color: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInput-underline:before': {
                                borderBottomColor: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInput-underline:hover:before': {
                                borderBottomColor: darkMode ? '#fff' : '#000',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: darkMode ? '#fff' : '#000',
                            },
                            '& input': {
                                color: darkMode ? '#fff' : '#000',
                            },
                        }}
                    />
                ))}
                <Button
                    onClick={() => setWclLinks([...wclLinks, ""])}
                    variant="outlined"
                    sx={{
                        backgroundColor: '#1E1E1E',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#c9c9c9ff',
                            color: '#111',
                        },
                    }}
                >
                    Add More WCL Link
                </Button>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#1E1E1E',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#c9c9c9ff',
                                color: '#111',
                            },
                        }}
                    >
                        {editingPost ? "Update Post" : "Create Post"}
                    </Button>
                    {editingPost &&
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            sx={{
                                backgroundColor: '#1E1E1E',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#c9c9c9ff',
                                    color: '#111',
                                },
                            }}
                        >Cancel</Button>}
                </Stack>
            </Stack>
        </Paper>
    );
}
