/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#ff61d2',
                    DEFAULT: '#e91e63',
                    dark: '#ad1457',
                },
                secondary: {
                    light: '#7c4dff',
                    DEFAULT: '#651fff',
                    dark: '#6200ea',
                },
                dark: {
                    lighter: '#1f1f23',
                    DEFAULT: '#121214',
                    darker: '#0a0a0c',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
