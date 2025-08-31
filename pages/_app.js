import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import CssBaseline from "@mui/material/CssBaseline";

function ThemeConsumerWrapper({ children }) {
  const { darkMode } = useThemeContext();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>;
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider> {/* your context */}
      <AuthProvider>
        <ThemeConsumerWrapper>
          <Component {...pageProps} />
        </ThemeConsumerWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}

