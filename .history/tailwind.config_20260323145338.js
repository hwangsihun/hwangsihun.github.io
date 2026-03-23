/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './html/**/*.html',
        './html/**/*.jsp',
        './src/**/*.js',
        './src/**/*.css',
    ],
    theme: {
        screens: {
            // 커스텀 브레이크포인트
            sm_tablet: '576px',
            tablet: '768px',
            laptop: '992px',
            desktop: '1200px',
        },
        extend: {},
    },
    plugins: [],
};

module.exports = {
    plugins: [require('@tailwindcss/line-clamp')],
};
