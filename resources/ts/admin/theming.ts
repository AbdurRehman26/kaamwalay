import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#20BFB8',
            contrastText: '#fff',
        },
    },
    overrides: {
        MuiButton: {
            root: {},
        },
    },
});

export default theme;
