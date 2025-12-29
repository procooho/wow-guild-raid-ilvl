import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProtectedRoute from "@/components/ProtectedRoute";
import OfficerPostForm from "@/components/OfficerPostForm";
import OfficerPostItem from "@/components/OfficerPostItem";
import NoticeForm from "@/components/NoticeForm";
import NoticeItem from "@/components/NoticeItem";
import { Switch } from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import CampaignIcon from '@mui/icons-material/Campaign';
import HistoryIcon from '@mui/icons-material/History';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import CurrentGuildRoster from "./currentGuildRoster";
import TechConfirmModal from '@/components/TechConfirmModal';

export default function ManagePage() {
    const { darkMode } = useThemeContext();
    const { logoutUser } = useAuth();

    // Mounted state for Portal safety
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize activeTab from localStorage, default to "video"
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('managePageTab') || 'video';
        }
        return 'video';
    });

    // --- Video/Log State ---
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [postModalOpen, setPostModalOpen] = useState(false);

    // --- Notice State ---
    const [notices, setNotices] = useState([]);
    const [editingNotice, setEditingNotice] = useState(null);
    const [noticeModalOpen, setNoticeModalOpen] = useState(false);
    const [showHiddenNotices, setShowHiddenNotices] = useState(true);

    // Save activeTab to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('managePageTab', activeTab);
        }
    }, [activeTab]);

    // --- Update Log State ---
    const [logContent, setLogContent] = useState("");

    // --- Fetch Data ---
    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/officer-posts");
            if (res.ok) setPosts(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchNotices = async () => {
        try {
            const res = await fetch(`/api/notice?showAll=true`); // Always fetch all for manage
            if (res.ok) setNotices(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchUpdateLog = async () => {
        try {
            const res = await fetch("/api/readme");
            if (res.ok) {
                const data = await res.json();
                setLogContent(data.content);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (activeTab === "video") fetchPosts();
        if (activeTab === "notice") fetchNotices();
        if (activeTab === "update") fetchUpdateLog();
    }, [activeTab]);

    // --- Confirmation Modal State ---
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // 'post' or 'notice'
        id: null,
        title: "",
        message: ""
    });

    // --- Handlers ---
    const handleDeletePost = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'post',
            id,
            title: "DELETE LOG?",
            message: "Are you sure you want to delete this video/log entry? Data loss is permanent."
        });
    };

    const handleDeleteNotice = (id) => {
        setConfirmModal({
            isOpen: true,
            type: 'notice',
            id,
            title: "DELETE NOTICE?",
            message: "Are you sure you want to remove this briefing? It will be removed from all terminals."
        });
    };

    const handleProceedDelete = async () => {
        const { type, id } = confirmModal;
        setConfirmModal({ ...confirmModal, isOpen: false });

        if (type === 'post') {
            await fetch(`/api/officer-posts/${id}`, { method: "DELETE" });
            fetchPosts();
        } else if (type === 'notice') {
            await fetch(`/api/notice/${id}`, { method: "DELETE" });
            fetchNotices();
        }
    };

    // --- Tab Component ---
    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                flex items-center gap-2 px-6 py-4 relative group transition-all duration-300
                ${activeTab === id ? 'bg-blue-600/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}
            `}
            style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
        >
            <Icon className={`w-5 h-5 ${activeTab === id ? 'text-blue-400' : 'text-white/30 group-hover:text-blue-400'}`} />
            <span className="text-sm font-bold tracking-widest uppercase pr-6">{label}</span>
            {activeTab === id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
        </button>
    );

    return (
        <ProtectedRoute>
            <div className="min-h-full pt-10 pb-10 px-4 md:px-8 bg-transparent">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                                Command Center
                            </h1>
                            <p className="text-blue-400/60 font-mono text-xs mt-1 tracking-[0.2em] uppercase">
                                {/* ADMIN_ACCESS_GRANTED // SESSION_ACTIVE */}
                            </p>
                        </div>
                        <button
                            onClick={logoutUser}
                            className="px-4 py-2 pl-6 border border-red-500/30 text-red-600 bg-red-500/10 hover:bg-red-600/10 hover:text-red-300 text-xs font-bold uppercase tracking-widest transition-all clip-path-polygon backdrop-blur-sm"
                            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
                        >
                            LOGOUT Session
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pl-4">
                        <TabButton id="video" label="Video & Logs" icon={VideocamIcon} />
                        <TabButton id="notice" label="Notifications" icon={CampaignIcon} />
                        <TabButton id="roster" label="Roster Management" icon={GroupsIcon} />
                        <TabButton id="update" label="System Update Log" icon={HistoryIcon} />
                    </div>

                    {/* Content Area */}
                    <div className="animate-fade-in relative min-h-[500px]">

                        {/* --- VIDEO TAB --- */}
                        {activeTab === "video" && (
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center bg-black/40 p-4 border border-white/10 rounded-lg">
                                    <span className="text-xs text-blue-300 font-mono uppercase tracking-widest">
                                        Active Records: {posts.length}
                                    </span>
                                    <button
                                        onClick={() => setPostModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all clip-path-polygon"
                                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
                                    >
                                        <AddIcon fontSize="small" /> Add New Log
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {posts.map(post => (
                                        <OfficerPostItem
                                            key={post.id}
                                            post={post}
                                            darkMode={darkMode}
                                            onEdit={(p) => { setEditingPost(p); setPostModalOpen(true); }}
                                            onDelete={handleDeletePost}
                                            showActions={true}
                                        />
                                    ))}
                                    {posts.length === 0 && <p className="text-white/30 italic text-center py-10">No records found.</p>}
                                </div>
                            </div>
                        )}

                        {/* --- NOTICE TAB --- */}
                        {activeTab === "notice" && (
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center bg-black/40 p-4 border border-white/10 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-blue-300 font-mono uppercase tracking-widest">
                                            Total Briefings: {notices.length}
                                        </span>
                                        <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5">
                                            <span className="text-[10px] text-white/50 uppercase font-bold">Show Archived</span>
                                            <Switch
                                                checked={showHiddenNotices}
                                                onChange={(e) => setShowHiddenNotices(e.target.checked)}
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNoticeModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all"
                                        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
                                    >
                                        <AddIcon fontSize="small" /> Create Briefing
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {notices
                                        .filter(n => showHiddenNotices || n.view)
                                        .map(notice => (
                                            <NoticeItem
                                                key={notice.id}
                                                notice={notice}
                                                darkMode={darkMode}
                                                onEdit={(n) => { setEditingNotice(n); setNoticeModalOpen(true); }}
                                                onDelete={handleDeleteNotice}
                                                showActions={true}
                                                showViewStatus={true}
                                            />
                                        ))}
                                    {notices.length === 0 && <p className="text-white/30 italic text-center py-10">No briefings found.</p>}
                                </div>
                            </div>
                        )}

                        {/* --- ROSTER TAB --- */}
                        {activeTab === "roster" && (
                            <div className="bg-black/40 border border-white/10 rounded-lg overflow-hidden min-h-[600px]">
                                <CurrentGuildRoster />
                            </div>
                        )}

                        {/* --- UPDATE LOG TAB --- */}
                        {activeTab === "update" && (
                            <div className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-xl font-mono text-sm text-gray-300 leading-relaxed shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {logContent}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>

                    {/* Modals using Portal to break out of Layout stacking context */}

                    {/* Post Modal */}
                    {mounted && (postModalOpen || !!editingPost) && createPortal(
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                            onClick={() => { setPostModalOpen(false); setEditingPost(null); }}>
                            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}>
                                <OfficerPostForm
                                    darkMode={darkMode}
                                    editingPost={editingPost}
                                    onSaved={() => { setPostModalOpen(false); setEditingPost(null); fetchPosts(); }}
                                    onCancel={() => { setPostModalOpen(false); setEditingPost(null); }}
                                />
                            </div>
                        </div>
                        , document.body)}

                    {/* Notice Modal */}
                    {mounted && (noticeModalOpen || !!editingNotice) && createPortal(
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
                            onClick={() => { setNoticeModalOpen(false); setEditingNotice(null); }}>
                            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}>
                                <NoticeForm
                                    darkMode={darkMode}
                                    editingNotice={editingNotice}
                                    onSaved={() => { setNoticeModalOpen(false); setEditingNotice(null); fetchNotices(); }}
                                    onCancel={() => { setNoticeModalOpen(false); setEditingNotice(null); }}
                                />
                            </div>
                        </div>
                        , document.body)}

                    {/* Delete Confirmation Modal (Self-Portaled) */}
                    <TechConfirmModal
                        isOpen={confirmModal.isOpen}
                        title={confirmModal.title}
                        message={confirmModal.message}
                        onConfirm={handleProceedDelete}
                        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                        confirmText="DELETE"
                        cancelText="ABORT"
                    />

                </div>
            </div>
        </ProtectedRoute>
    );
}
