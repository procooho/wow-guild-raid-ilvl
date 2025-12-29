import Link from 'next/link';
import WarningIcon from '@mui/icons-material/Warning';

export default function Custom404() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 relative overflow-hidden">
            {/* Decorative Grid Background specific to 404 area */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,0,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,0,0,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />


            <div className="relative z-10 flex flex-col items-center animate-fade-in">
                {/* Glitching Icon Container */}
                <div className="relative mb-6">
                    <WarningIcon className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse" style={{ fontSize: '6rem' }} />
                    <WarningIcon className="absolute top-0 left-0 text-red-500 active-glitch opacity-50" style={{ fontSize: '6rem', clipPath: 'inset(0 0 50% 0)' }} />
                </div>

                <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-black tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] font-mono glitch-text" data-text="404">
                    404
                </h1>

                <div className="h-0.5 w-24 bg-red-500/50 my-8 shadow-[0_0_15px_#ef4444]" />

                <h2 className="text-3xl text-red-100 font-black uppercase tracking-[0.5em] mb-4 drop-shadow-md">
                    Signal Lost
                </h2>

                <p className="text-red-300/60 font-mono text-sm max-w-lg mb-10 leading-relaxed tracking-wide">
                    {`// SYSTEM ERROR: TARGET COORDINATES NOT FOUND.`}<br />
                    The requested vector leads to void space. Rerouting navigation protocols recommended.
                </p>

                <Link href="/" className="group relative px-10 py-4 bg-red-950/30 border border-red-500/30 text-red-400 font-bold uppercase tracking-[0.2em] hover:bg-red-500/20 hover:text-white hover:border-red-400 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="text-xl">«</span> Return to Command
                    </span>
                    {/* Button Scan Line */}
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent group-hover:animate-shine pointer-events-none" />
                </Link>
            </div>

            {/* Decorative Error Codes */}
            <div className="absolute top-20 right-10 text-red-900/30 font-mono text-[10px] hidden lg:block text-right select-none">
                ERR::NAV_FAILURE<br />
                VECTOR::NULL<br />
                STATUS::CRITICAL<br />
                RETRY::FALSE
            </div>

            <div className="absolute bottom-20 left-10 text-red-900/30 font-mono text-[10px] hidden lg:block text-left select-none">
                [SYSTEM LOG]<br />
                &gt; SEARCHING...<br />
                &gt; FAILED.<br />
            </div>
        </div>
    );
}
