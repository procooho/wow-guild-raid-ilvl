import { useState } from "react";
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function NoticeItem({ notice, darkMode, onEdit, onDelete, showActions = true }) {
    const [expanded, setExpanded] = useState(false);

    const getCollapsedNote = (text) => {
        const lines = text.split("\n");
        return lines.slice(0, 3).join("\n") + (lines.length > 3 ? "..." : "");
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('en-CA');
    const isUpdatedDifferent = formatDate(notice.updatedAt) !== formatDate(notice.createdAt);

    return (
        <div
            className={`
                relative w-full overflow-hidden transition-all duration-300
                bg-black/40 backdrop-blur-md border 
                ${expanded ? 'border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'border-white/10 hover:border-white/30'}
                group
            `}
            style={{
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
                marginBottom: '1rem'
            }}
            onClick={() => setExpanded(prev => !prev)}
        >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${expanded ? 'bg-blue-500' : 'bg-white/10 group-hover:bg-blue-500/50'}`} />

            <div className="p-5 pl-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                        {/* Tags Row */}
                        <div className="flex flex-wrap gap-2 items-center">
                            {notice.important && (
                                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/50 text-red-200 text-[10px] font-bold uppercase tracking-wider rounded-sm animate-pulse">
                                    CRITICAL
                                </span>
                            )}
                            {notice.isNew && (
                                <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-200 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                    NEW ENTRY
                                </span>
                            )}
                            {!notice.view && (
                                <span className="px-2 py-0.5 bg-gray-500/20 border border-gray-500/50 text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                    ARCHIVED
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase leading-tight font-sans drop-shadow-md">
                            {notice.title}
                        </h3>
                    </div>

                    {/* Metadata (Dates) */}
                    <div className="flex flex-col items-end text-xs font-mono text-blue-200/50 gap-0.5 min-w-fit">
                        <span>INIT: {formatDate(notice.createdAt)}</span>
                        {notice.updatedAt && isUpdatedDifferent && (
                            <span className="text-blue-400">UPD: {formatDate(notice.updatedAt)}</span>
                        )}
                    </div>
                </div>

                {/* Content Body */}
                <div className={`
                    text-sm md:text-base leading-relaxed text-gray-300 font-sans border-l-2 border-white/5 pl-4 transition-all duration-300
                    ${expanded ? 'opacity-100 max-h-[1000px]' : 'opacity-70 max-h-[100px] overflow-hidden'}
                `}>
                    <p className="whitespace-pre-line">
                        {expanded ? notice.note : getCollapsedNote(notice.note)}
                    </p>
                </div>

                {/* Expand Toggle & Links Section (Only Visible if Expanded) */}
                <div className={`mt-4 transition-all duration-500 overflow-hidden ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>

                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent my-4" />

                    {/* Links */}
                    <div className="flex flex-col gap-2 mb-6">
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">ATTACHED DATA LINKS</span>
                        <div className="flex flex-wrap gap-3">
                            {notice.links.length > 0 ? (
                                notice.links.map((l, index) => (
                                    <a
                                        key={l.id}
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/20 border border-blue-500/30 text-blue-200 text-xs font-mono hover:bg-blue-500/20 hover:border-blue-400 transition-colors rounded-sm group/link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <LinkIcon fontSize="small" className="text-blue-500 group-hover/link:text-white transition-colors" />
                                        <span>{l.description || `LINK_0${index + 1}`}</span>
                                    </a>
                                ))
                            ) : (
                                <span className="text-xs text-white/30 italic">NO EXTERNAL LINKS DETECTED</span>
                            )}
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {showActions && (
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(notice); }}
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/20 text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                <EditIcon fontSize="small" /> EDIT
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(notice.id); }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                <DeleteForeverIcon fontSize="small" /> DELETE
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Expansion Indicator */}
                <div className="flex justify-center mt-2 group-hover:text-blue-400 text-white/20 transition-colors">
                    {expanded ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
                </div>

            </div>
        </div>
    );
}
