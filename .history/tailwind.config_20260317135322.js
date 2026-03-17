/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./html/**/*.html', './html/**/*.jsp'],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',

            // 커스텀
            tablet: '768px',
            laptop: '1024px',
            desktop: '1280px',
        },
        extend: {},
    },
    plugins: [],
};
