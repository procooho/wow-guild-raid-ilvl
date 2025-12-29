import React from 'react';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import LoadingScreen from './LoadingScreen';
import { useRouter } from 'next/router';

// Reusable Corner Component for perfect alignment
const HudCorner = ({ position }) => {
    // Classes based on position
    const positionClasses = {
        'tl': 'top-0 left-0',
        'tr': 'top-0 right-0 transform rotate-90',
        'bl': 'bottom-0 left-0 transform -rotate-90',
        'br': 'bottom-0 right-0 transform rotate-180',
    };

    return (
        <div className={`absolute w-16 h-16 md:w-24 md:h-24 pointer-events-none z-50 ${positionClasses[position]}`}>
            {/* Outer Glow Line */}
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                {/* The main thick corner bracket */}
                <path
                    d="M 2 100 V 32 Q 2 2 32 2 H 100"
                    className="stroke-cyan-400 stroke-[4px] md:stroke-[6px]"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' }}
                />
                {/* The thin inner decorative line */}
                <path
                    d="M 12 100 V 32 Q 12 12 32 12 H 100"
                    className="stroke-blue-300/50 stroke-[1px]"
                />
            </svg>
        </div>
    );
};

export default function Layout({ children }) {
    const router = useRouter();
    const isHome = router.pathname === '/';

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center pb-24 text-white font-mono">

            {/* --- BACKGROUND LAYERS --- */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        animation: 'gridScroll 20s linear infinite'
                    }} />
                </div>
                {/* Vignette & Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)]" />
            </div>

            {/* --- UI LAYERS --- */}
            <TopHeader />
            <BottomNav />

            {/* --- MAIN MONITOR FRAME --- */}
            <main className={`relative top-2.5 md:top-6 z-10 w-full h-full md:w-[98vw] md:h-[77vh] md:max-w-[95vw] pt-24 md:pt-0 flex flex-col transition-all duration-500 box-border mt-20 md:mt-0 ${isHome ? 'animate-turn-on' : ''}`}>

                {/* CORNERS */}
                <div className="absolute inset-[-2px] pointer-events-none z-50">
                    <HudCorner position="tl" />
                    <HudCorner position="tr" />
                    <HudCorner position="bl" />
                    <HudCorner position="br" />
                </div>

                {/* THE GLOWING BORDER FRAME */}
                <div className="absolute inset-0 z-0 rounded-[32px] p-[2px] bg-gradient-to-br from-blue-600/40 via-blue-500/20 to-blue-600/40 shadow-[0_0_50px_rgba(59,130,246,0.3)]">

                    {/* Inner Frame Shadow/Stroke */}
                    <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_0_20px_rgba(59,130,246,0.4)] pointer-events-none" />

                    {/* THE ACTUAL CONTENT AREA */}
                    <div className="relative w-full h-full bg-black/90 rounded-[30px] overflow-hidden flex flex-col">

                        {/* Decorative Mid-point markers */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-16 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20" />
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-16 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-32 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-32 bg-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20" />

                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent animate-scanline pointer-events-none z-10" />

                        <LoadingScreen />

                        {/* Scrollable Content */}
                        <div className={`relative z-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 ${isHome ? 'no-scrollbar' : ''} custom-scrollbar`}>
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes gridScroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(50px); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scanline {
                    animation: scanline 8s linear infinite;
                }
                @keyframes turnOn {
                    0% { transform: scale(1, 0.01); opacity: 0; filter: brightness(30); }
                    30% { transform: scale(1, 0.01); opacity: 1; filter: brightness(30); }
                    60% { transform: scale(1, 1); filter: brightness(5); }
                    100% { transform: scale(1, 1); filter: brightness(1); }
                }
                .animate-turn-on {
                    animation: turnOn 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </div>
    );
}