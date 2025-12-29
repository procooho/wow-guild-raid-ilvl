import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

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

        if (!title.trim()) {
            newErrors.title = "Title is required";
            hasError = true;
        }
        if (!description.trim()) {
            newErrors.description = "Description is required";
            hasError = true;
        }

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

    const removeLink = (index, type) => {
        if (type === 'youtube') {
            setYoutubeLinks(prev => prev.filter((_, i) => i !== index));
        } else {
            setWclLinks(prev => prev.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="bg-black/95 border border-blue-500/30 p-6 relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500" />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />

            <div className="relative z-10 space-y-6">
                {/* Header */}
                {/* Header */}
                <div className="border-b border-blue-500/20 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">
                            {editingPost ? "Modify Combat Log" : "Initialize Combat Log"}
                        </h2>
                        <p className="text-xs text-blue-400/60 font-mono mt-1 uppercase tracking-wider">
                            // Video & Warcraft Logs Entry
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                        Mission Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="E.g. TWW - S3 Manaforge 7/8 Heroic"
                        className={`w-full bg-black/50 border text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors tracking-wider
                            ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                    />
                    {errors.title && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.title}</span>}
                    <p className="text-[9px] text-gray-500 font-mono ml-1">FORMAT: TWW S3 - Manaforge 7/8 (Heroic)</p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                        Mission Brief *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Boss Information, Strategy Notes, Other Details..."
                        rows={4}
                        className={`w-full bg-black/50 border text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors tracking-wider resize-none
                            ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                    />
                    {errors.description && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.description}</span>}
                    <p className="text-[9px] text-gray-500 font-mono ml-1">E.g. Nexus-King Salhadaar(H) - First Kill / Dimensius(H) - Progress</p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                {/* YouTube Links */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-blue-300 font-black uppercase tracking-widest">
                            YouTube Links
                        </label>
                        <button
                            type="button"
                            onClick={() => setYoutubeLinks([...youtubeLinks, ""])}
                            className="flex items-center gap-1 px-3 py-1 border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-wider transition-all"
                        >
                            <AddIcon fontSize="small" /> Add
                        </button>
                    </div>
                    {youtubeLinks.map((link, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => {
                                    const copy = [...youtubeLinks];
                                    copy[i] = e.target.value;
                                    setYoutubeLinks(copy);
                                }}
                                placeholder="https://youtu.be/..."
                                className={`flex-1 bg-black/50 border text-white px-4 py-2 font-mono text-xs focus:outline-none transition-colors
                                    ${errors.youtube[i] ? 'border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            />
                            {youtubeLinks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLink(i, 'youtube')}
                                    className="px-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-all"
                                >
                                    <DeleteIcon fontSize="small" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* WCL Links */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-blue-300 font-black uppercase tracking-widest">
                            Warcraft Logs Links
                        </label>
                        <button
                            type="button"
                            onClick={() => setWclLinks([...wclLinks, ""])}
                            className="flex items-center gap-1 px-3 py-1 border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-wider transition-all"
                        >
                            <AddIcon fontSize="small" /> Add
                        </button>
                    </div>
                    {wclLinks.map((link, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => {
                                    const copy = [...wclLinks];
                                    copy[i] = e.target.value;
                                    setWclLinks(copy);
                                }}
                                placeholder="https://www.warcraftlogs.com/..."
                                className={`flex-1 bg-black/50 border text-white px-4 py-2 font-mono text-xs focus:outline-none transition-colors
                                    ${errors.wcl[i] ? 'border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            />
                            {wclLinks.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLink(i, 'wcl')}
                                    className="px-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-all"
                                >
                                    <DeleteIcon fontSize="small" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 uppercase tracking-[0.2em] transition-all text-sm"
                        style={{ clipPath: "polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)" }}
                    >
                        {editingPost ? "Update Log" : "Deploy Log"}
                    </button>
                    {editingPost && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 border border-white/20 hover:bg-white/10 text-gray-300 font-bold py-3 uppercase tracking-[0.2em] transition-all text-sm"
                        >
                            Abort
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
