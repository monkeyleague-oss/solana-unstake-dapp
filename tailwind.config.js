/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    fontFamily: {
        // default html tailwind family
        sans: [
            '"Poppins"',
            '"Paralucen"',
            '"ui-sans-serif"',
            '"system-ui"',
            '"-apple-system"',
            '"BlinkMacSystemFont"',
            '"Segoe UI"',
            '"Roboto"',
            '"Helvetica Neue"',
            '"Arial"',
            '"Noto Sans"',
            '"sans-serif"',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
        ],
        action: ['"eurostile-condensed"'],
        promt: ['"Bebas Neue"'],
        popp: ['"Poppins"'],
    },
    plugins: [],
};
