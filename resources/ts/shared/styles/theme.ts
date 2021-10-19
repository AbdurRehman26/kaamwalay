import { purple } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// TODO: Pick right colors over here
export const materialUiTheme = createTheme({
    palette: {
        primary: {
            main: '#20BFB8',
            contrastText: '#fff',
            light: '#42E8E0',
        },
        secondary: {
            main: purple[500],
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    components: {
        MuiLink: {
            defaultProps: {
                underline: 'hover',
            },
        },
    },
});

export default materialUiTheme;
