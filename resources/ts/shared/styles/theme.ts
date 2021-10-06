import { purple } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

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

    overrides: {
        MuiButton: {
            root: {},
        },
    },
});

export default materialUiTheme;
