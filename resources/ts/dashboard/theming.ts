import { purple } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

//TODO: Pick right colors over here
const theme = createTheme({
    palette: {
        primary: {
            main: '#20BFB8',
            contrastText: '#fff',
        },
        secondary: {
            main: purple[500],
        },
    },

    overrides: {
        MuiButton: {
            root: {},
        },
    },
});

export type DashboardTheme = typeof theme;

export default theme;
