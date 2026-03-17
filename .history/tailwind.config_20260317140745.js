/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./html/**/*.html', './html/**/*.jsp'],
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
