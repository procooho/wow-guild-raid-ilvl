import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Image from "next/image";

export default function OfficerPostItem({ post, darkMode, onEdit, onDelete, showActions = true }) {

    const formatDate = (date) => new Date(date).toLocaleDateString('en-CA');

    return (
        <div
            className="bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden relative group transition-all hover:border-blue-500/30"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
        >
            {/* Left Accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 to-transparent" />

            <div className="p-5 pl-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-4">
                    <h3 className="text-xl text-white font-black tracking-wide uppercase drop-shadow-md">
                        {post.title}
                    </h3>
                    <span className="text-xs text-blue-300 font-mono tracking-widest bg-blue-900/20 px-2 py-1 rounded border border-blue-500/20">
                        LOG_DATE: {formatDate(post.createdAt)}
                    </span>
                </div>

                {/* Description */}
                <div className="mb-6 text-gray-300 font-sans text-sm leading-relaxed whitespace-pre-line border-l border-white/5 pl-4 ml-1">
                    {post.description}
                </div>

                {/* Links Section */}
                <div className="space-y-3">
                    {/* Youtube */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-red-600/20 rounded border border-red-500/20">
                            <Image src="/youtube.png" alt="Youtube" width={20} height={20} className="rounded-sm opacity-80" />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center flex-1">
                            {post.youtubeLinks.length > 0 ? (
                                post.youtubeLinks.map((y, index) => (
                                    <a
                                        key={y.id}
                                        href={y.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-900/10 border border-red-500/30 text-red-200 text-xs font-mono hover:bg-red-500/20 transition-colors rounded-sm group/link"
                                    >
                                        <LinkIcon className="w-3 h-3 text-red-400 group-hover/link:text-white" />
                                        <span>VIDEO_FEED_{index + 1}</span>
                                    </a>
                                ))
                            ) : (
                                <span className="text-xs text-white/20 italic">NO_VIDEO_DATA</span>
                            )}
                        </div>
                    </div>

                    {/* WCL */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-600/20 rounded border border-blue-500/20">
                            <Image src="/wcl.png" alt="WCL" width={20} height={20} className="rounded-sm opacity-80" />
                        </div>
                        <div className="flex flex-wrap gap-2 items-center flex-1">
                            {post.wclLinks.length > 0 ? (
                                post.wclLinks.map((w, index) => (
                                    <a
                                        key={w.id}
                                        href={w.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/10 border border-blue-500/30 text-blue-200 text-xs font-mono hover:bg-blue-500/20 transition-colors rounded-sm group/link"
                                    >
                                        <LinkIcon className="w-3 h-3 text-blue-400 group-hover/link:text-white" />
                                        <span>COMBAT_LOG_{index + 1}</span>
                                    </a>
                                ))
                            ) : (
                                <span className="text-xs text-white/20 italic">NO_LOG_DATA</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
                        <button
                            onClick={() => onEdit(post)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/20 text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            <EditIcon fontSize="small" /> Edit Data
                        </button>
                        <button
                            onClick={() => onDelete(post.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500/20 text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            <DeleteForeverIcon fontSize="small" /> Delete Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
