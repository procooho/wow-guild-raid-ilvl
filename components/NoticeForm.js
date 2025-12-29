import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

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

    const removeLink = (index) => {
        setLinks(prev => prev.filter((_, i) => i !== index));
    };

    const ToggleSwitch = ({ checked, onChange, label }) => (
        <div className="flex items-center justify-between p-3 bg-black/30 border border-white/10 hover:border-blue-500/30 transition-colors">
            <span className="text-xs text-gray-300 font-mono uppercase tracking-wider">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
        </div>
    );

    return (
        <div className="bg-black/95 border border-blue-500/30 p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
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
                            {editingNotice ? "Modify Briefing" : "Create Briefing"}
                        </h2>
                        <p className="text-xs text-blue-400/60 font-mono mt-1 uppercase tracking-wider">
                            {/* Guild Notification System */}
                        </p>
                    </div>
                    <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                        Briefing Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter notification title..."
                        className={`w-full bg-black/50 border text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors tracking-wider
                            ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                    />
                    {errors.title && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.title}</span>}
                </div>

                {/* Note */}
                <div className="space-y-2">
                    <label className="text-[10px] text-blue-300 font-mono uppercase tracking-widest ml-1">
                        Message Content *
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter detailed message..."
                        rows={5}
                        className={`w-full bg-black/50 border text-white px-4 py-3 font-mono text-sm focus:outline-none transition-colors tracking-wider resize-none
                            ${errors.note ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                    />
                    {errors.note && <span className="text-red-400 text-[10px] font-mono uppercase ml-1">{errors.note}</span>}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                {/* Links */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-blue-300 font-black uppercase tracking-widest">
                            Reference Links
                        </label>
                        <button
                            type="button"
                            onClick={() => setLinks([...links, { url: "", description: "" }])}
                            className="flex items-center gap-1 px-3 py-1 border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 text-[10px] font-mono uppercase tracking-wider transition-all"
                        >
                            <AddIcon fontSize="small" /> Add Link
                        </button>
                    </div>
                    {links.map((l, i) => (
                        <div key={i} className="space-y-2 p-3 bg-black/20 border border-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={l.url}
                                    onChange={(e) => updateLink(i, "url", e.target.value)}
                                    placeholder="https://..."
                                    className={`flex-1 bg-black/50 border text-white px-3 py-2 font-mono text-xs focus:outline-none transition-colors
                                        ${errors.links[i]?.url ? 'border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                                />
                                {links.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLink(i)}
                                        className="px-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 transition-all"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                value={l.description}
                                onChange={(e) => updateLink(i, "description", e.target.value)}
                                placeholder="Link description (required if URL provided)"
                                className={`w-full bg-black/50 border text-white px-3 py-2 font-mono text-xs focus:outline-none transition-colors
                                    ${errors.links[i]?.description ? 'border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                {/* Toggles */}
                <div className="space-y-2">
                    <label className="text-xs text-blue-300 font-black uppercase tracking-widest mb-3 block">
                        Briefing Parameters
                    </label>
                    <ToggleSwitch
                        checked={view}
                        onChange={setView}
                        label="Visible to All Members"
                    />
                    <ToggleSwitch
                        checked={important}
                        onChange={setImportant}
                        label="Mark as Critical Priority"
                    />
                    <ToggleSwitch
                        checked={isNew}
                        onChange={setIsNew}
                        label="Flag as New Briefing"
                    />
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
                        {editingNotice ? "Update Briefing" : "Deploy Briefing"}
                    </button>
                    {editingNotice && (
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
