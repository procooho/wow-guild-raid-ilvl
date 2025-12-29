/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                foreground: "#ffffff",
            },
            animation: {
                'glow': 'glow 3s ease-in-out infinite alternate',
                'slide-up': 'slide-up 0.5s ease-out forwards',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fade-in 0.5s ease-out forwards',
            },
            keyframes: {
                glow: {
                    '0%': { opacity: 0.8, filter: 'brightness(1)' },
                    '100%': { opacity: 1, filter: 'brightness(1.2)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(100%)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                }
            }
        },
    },
    plugins: [],
}
