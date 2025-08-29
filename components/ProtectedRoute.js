import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProtectedRoute({ children }) {
    const { loggedIn, ready } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (ready && !loggedIn) {
            router.replace("/login");
        }
    }, [ready, loggedIn, router]);

    // While loading
    if (!ready) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Only render children if logged in
    if (ready && !loggedIn) return null;

    return children;
}