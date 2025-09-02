import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, TextField, Typography, Container, Paper, useMediaQuery } from "@mui/material";
import LeftNav from "@/components/LeftNav";
import { useThemeContext } from "@/context/ThemeContext";
import { useTheme } from "@mui/material/styles";

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { loginUser } = useAuth();
    const { darkMode, setDarkMode } = useThemeContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    const textFieldStyles = {
        mb: 2,
        '& .MuiInputLabel-root': {
            color: darkMode ? '#fff' : '#000',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: darkMode ? '#fff' : '#000',
        },
        '& .MuiInputBase-input': {
            color: darkMode ? '#fff' : '#000',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: darkMode ? '#fff' : '#000',
            },
            '&:hover fieldset': {
                borderColor: darkMode ? '#fff' : '#000',
            },
            '&.Mui-focused fieldset': {
                borderColor: darkMode ? '#fff' : '#000',
            },
        },
    };

    return (
        <Box sx={{ display: "flex", ...(!isMobile && { ml: 7 }) }}>
            {!isMobile && (
                <Box sx={{ width: 240, flexShrink: 0 }}>
                    <LeftNav />
                </Box>
            )}
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Typography variant="h5" textAlign={"center"} sx={{ mb: 2, color: darkMode ? '#fff' : '#000' }}>
                    This page is only for Officers.
                </Typography>
                <Typography variant="h5" textAlign={"center"} sx={{ mb: 5, color: darkMode ? '#fff' : '#000' }}>
                    Please Login to view this page.
                </Typography>
                <Paper sx={{ p: 4, border: '1px solid', borderColor: darkMode ? '#fff' : '#000' }}>
                    <Typography variant="h5" sx={{ mb: 2, color: darkMode ? '#fff' : '#000' }}>
                        Officer Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Officer ID"
                            fullWidth
                            sx={textFieldStyles}
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            sx={textFieldStyles}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="outlined"
                            fullWidth
                            sx={{
                                backgroundColor: darkMode ? '#1E1E1E' : '#fff',
                                color: darkMode ? '#fff' : '#000',
                                borderColor: darkMode ? '#fff' : '#000',
                                '&:hover': {
                                    backgroundColor: darkMode ? '#c9c9c9ff' : '#e0e0e0',
                                    color: darkMode ? '#111' : '#000',
                                    borderColor: darkMode ? '#fff' : '#000',
                                },
                            }}
                        >
                            Log In
                        </Button>
                    </form>
                </Paper>
            </Container>
            {isMobile && <LeftNav />}
        </Box>
    );
}