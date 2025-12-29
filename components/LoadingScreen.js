import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const LoadingScreen = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        let progressInterval;

        const startLoading = () => {
            setLoading(true);
            setProgress(0);

            // Simulate progress
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    // Incremental progress with diminishing returns
                    const increment = Math.max(1, (100 - prev) * 0.1);
                    return Math.min(prev + increment, 90);
                });
            }, 100);
        };

        const handleComplete = () => {
            // Complete the progress bar
            setProgress(100);
            // Hide loading after a brief delay
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 300);

            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };

        const handleStart = () => {
            startLoading();
        };

        const handleError = () => {
            handleComplete();
        };

        // Route change event listeners
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleError);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleError);

            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [router]);

    if (!loading) return null;

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden rounded-[32px]">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    animation: 'gridScroll 20s linear infinite'
                }} />
            </div>

            {/* Hexagonal Pattern Overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%233b82f6' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
            }} />

            {/* Radial Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center gap-8">

                {/* Logo with Animation */}
                {/* Large Logo with Blur Effect */}
                <div className="relative flex items-center justify-center w-full animate-glow">
                    <Image
                        src="/logo.png"
                        alt="Loading"
                        width={800}
                        height={400}
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "100%",
                            objectFit: "contain",
                            filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))",
                            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                            maskComposite: "intersect",
                            WebkitMaskComposite: "source-in"
                        }}
                        priority
                    />
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">
                        Loading
                    </h2>
                    <p className="text-xs text-blue-400/60 font-mono uppercase tracking-wider">
                        Initializing Systems...
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-[90vw]">
                    <div className="relative h-6 bg-black/50 border border-blue-500/30 overflow-hidden"
                        style={{ clipPath: "polygon(1% 0, 100% 0, 99% 100%, 0 100%)" }}>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-shimmer"
                            style={{ width: '200%' }} />

                        {/* Progress Fill */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 animate-progress"
                            style={{ width: `${progress}%`, transition: 'width 0.3s ease-out' }} />

                        {/* Scan Line */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-300 shadow-[0_0_10px_#60a5fa] animate-scan" />
                    </div>

                    {/* Percentage Display */}
                    <div className="mt-2 text-center">
                        <span className="text-xs font-mono text-blue-400/80 tracking-widest">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex gap-2 mt-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>

            {/* Global Styles */}
            <style jsx>{`
                @keyframes gridScroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(50px); }
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes progress {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                
                @keyframes scan {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(320px); }
                }
                
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                
                .animate-shimmer {
                    animation: shimmer 2s ease-in-out infinite;
                }
                
                .animate-progress {
                    background-size: 200% 100%;
                    animation: progress 2s linear infinite;
                }
                
                .animate-scan {
                    animation: scan 2s ease-in-out infinite;
                }
                @keyframes glow {
                    0%, 100% { opacity: 1; filter: drop-shadow(0 0 15px rgba(59,130,246,0.4)); }
                    50% { opacity: 0.8; filter: drop-shadow(0 0 30px rgba(59,130,246,0.8)); }
                }

                .animate-glow {
                    animation: glow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
