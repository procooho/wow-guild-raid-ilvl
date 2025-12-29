import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useThemeContext } from "@/context/ThemeContext";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { loginUser } = useAuth();
    const { darkMode } = useThemeContext();

<<<<<<< Updated upstream
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                loginUser();
                router.replace("/");
            } else {
                setError(data.message || "Invalid officer credentials.");
            }
        } catch (err) {
            console.error("Login API Error:", err);
            setError("A network error occurred. Please try again.");
=======
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: id, password: password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                loginUser();
                router.replace("/manage"); // Redirect to new Manage dashboard
            } else {
                setError(data.message || "Access Denied");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("System Error: Connection Failed");
        } finally {
            setLoading(false);
>>>>>>> Stashed changes
        }
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-transparent px-4">
            <div className="w-full max-w-sm relative">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                        Officer Access
                    </h1>
                    <div className="h-0.5 w-16 bg-blue-500 mx-auto mt-2 shadow-[0_0_8px_#3b82f6]" />
                    <p className="text-blue-400/60 font-mono text-xs mt-2 tracking-[0.2em] uppercase">Restricted Area</p>
                </div>

                {/* Login Panel */}
                <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 p-8 relative isolate overflow-hidden group"
                    style={{ clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)" }}
                >
                    {/* Background Noise/Grid */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-[-1]" />

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* ID Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-blue-300 tracking-widest font-bold ml-1">Officer ID</label>
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none transition-colors tracking-wider"
                                placeholder="ENTER ID"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-blue-300 tracking-widest font-bold ml-1">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/50 border border-white/10 text-white px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none transition-colors tracking-wider"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-2 text-center animate-pulse">
                                <span className="text-red-200 text-xs font-mono uppercase tracking-wide">⚠ {error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600/80 hover:bg-blue-600 text-white font-bold py-3 uppercase tracking-[0.2em] transition-all border border-blue-400/50 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? "Authenticating..." : "Initialize Session"}
                        </button>
                    </form>

                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/50" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/50" />
                </div>
            </div>
        </div>
    );
}