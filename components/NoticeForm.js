import { useState, useEffect } from "react";
import { Paper, Stack, TextField, Typography, Button, Divider, FormControlLabel, Checkbox } from "@mui/material";

export default function NoticeForm({ darkMode, editingNotice, onSaved, onCancel }) {
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [links, setLinks] = useState([{ url: "", description: "" }]);
    const [view, setView] = useState(true);
    const [important, setImportant] = useState(false);
    const [isNew, setIsNew] = useState(true);

    const [errors, setErrors] = useState({
        title: "",
        note: "",
        links: [],
    });

    useEffect(() => {
        if (editingNotice) {
            setTitle(editingNotice.title);
            setNote(editingNotice.note || "");
            setLinks(editingNotice.links.length > 0 ? editingNotice.links.map(l => ({ url: l.url, description: l.description || "" })) : [{ url: "", description: "" }]);
            setView(editingNotice.view ?? true);
            setImportant(editingNotice.important ?? false);
            setIsNew(editingNotice.isNew ?? true);
        } else {
            setTitle("");
            setNote("");
            setLinks([{ url: "", description: "" }]);
            setView(true);
            setImportant(false);
            setIsNew(true);
        }
        setErrors({ title: "", note: "", links: [] });
    }, [editingNotice]);

    const handleSave = async () => {
        let hasError = false;
        const newErrors = { title: "", note: "", links: [] };

        if (!title.trim()) {
            newErrors.title = "Title is required";
            hasError = true;
        }

        if (!note.trim()) {
            newErrors.note = "Note is required";
            hasError = true;
        }

        links.forEach((l, i) => {
            newErrors.links[i] = {};
            if (l.url && !/^https?:\/\//.test(l.url)) {
                newErrors.links[i].url = "Must start with http:// or https://";
                hasError = true;
            }
            if (l.url && !l.description.trim()) {
                newErrors.links[i].description = "Description required";
                hasError = true;
            }
        });

        setErrors(newErrors);
        if (hasError) return;

        const payload = {
            title,
            note,
            view,
            important,
            isNew,
            // only include non-empty urls
            links: links.filter(l => l.url),
        };

        try {
            let res;
            if (editingNotice) {
                res = await fetch(`/api/notice/${editingNotice.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch("/api/notice", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to save notice:", text);
                return;
            }

            onSaved();
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    const updateLink = (index, key, value) => {
        const copy = [...links];
        copy[index][key] = value;
        setLinks(copy);
    };

    return (
        <Paper sx={{ p: 3, backgroundColor: darkMode ? "#424242" : "#f9f9f9" }}>
            <Stack spacing={2}>
                <Typography variant="h6">{editingNotice ? "Edit Notice" : "Add New Notice"}</Typography>

                <Divider />

                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title}
                    required
                    sx={{ backgroundColor: darkMode ? "#333" : "#fff" }}
                />

                <TextField
                    label="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    multiline
                    minRows={3}
                    maxRows={10}
                    fullWidth
                    error={!!errors.note}
                    helperText={errors.note}
                    required
                    sx={{ backgroundColor: darkMode ? "#333" : "#fff" }}
                />

                <Divider />

                <Typography variant="subtitle1">Links</Typography>
                {links.map((l, i) => (
                    <Stack key={i} direction="row" spacing={1}>
                        <TextField
                            label="URL"
                            value={l.url}
                            onChange={(e) => updateLink(i, "url", e.target.value)}
                            fullWidth
                            error={!!errors.links[i]?.url}
                            helperText={errors.links[i]?.url}
                            sx={{ backgroundColor: darkMode ? "#333" : "#fff" }}
                        />
                        <TextField
                            label="Description ( Required if URL exists )"
                            value={l.description}
                            onChange={(e) => updateLink(i, "description", e.target.value)}
                            fullWidth
                            error={!!errors.links[i]?.description}
                            helperText={errors.links[i]?.description}
                            sx={{ backgroundColor: darkMode ? "#333" : "#fff" }}
                        />
                    </Stack>
                ))}
                <Button
                    onClick={() => setLinks([...links, { url: "", description: "" }])}
                    variant="outlined"
                    sx={{ backgroundColor: '#1E1E1E', color: '#fff', '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                >
                    Add More Link
                </Button>

                <Divider />

                <FormControlLabel
                    control={<Checkbox checked={view} onChange={(e) => setView(e.target.checked)} />}
                    label="Visible ( Make only logged in officer can see this post )"
                />
                <FormControlLabel
                    control={<Checkbox checked={important} onChange={(e) => setImportant(e.target.checked)} />}
                    label="Important ( Mark as Important )"
                />
                <FormControlLabel
                    control={<Checkbox checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />}
                    label="New ( Mark as New )"
                />

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ backgroundColor: '#1E1E1E', color: '#fff', '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                    >
                        {editingNotice ? "Update Notice" : "Create Notice"}
                    </Button>
                    {editingNotice && (
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            sx={{ backgroundColor: '#1E1E1E', color: '#fff', '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' } }}
                        >
                            Cancel
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}
