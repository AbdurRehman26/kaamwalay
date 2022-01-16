const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './resources/views/**/*.blade.php',
        './resources/ts/landings/**/*.ts',
        './resources/ts/landings/**/*.tsx',
    ],
    theme: {
        screens: {
            sm: '600px',
            md: '960px',
            lg: '1280px',
            xl: '1920',
        },
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            fontFamily: {
                sans: ['"Roboto"', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
