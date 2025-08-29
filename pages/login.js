import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, TextField, Typography, Container, Paper } from "@mui/material";
import LeftNav from "@/components/LeftNav";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { loginUser } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        // officer login check
        if (id === "AwakenOfficer" && password === "AwOf1234") {
            // sets loggedIn = true
            loginUser();
            // redirect to protected page
            router.replace("/");
        } else {
            setError("Invalid officer credentials.");
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <LeftNav />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Officer Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Officer ID"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" sx={{
                            backgroundColor: '#1E1E1E',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#c9c9c9ff', color: '#111' }
                        }}
                            fullWidth>
                            Log In
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}
