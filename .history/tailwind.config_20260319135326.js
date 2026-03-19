/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './html/**/*.html', './html/**/*.jsp', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        screens: {
            // 커스텀
            sm_tablet: '576px',
            tablet: '768px',
            laptop: '992px',
            desktop: '1200px',
        },
        extend: {},
    },
    plugins: [],
};
