import { purple } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

//TODO: Pick right colors over here
const theme = createTheme({
    palette: {
        primary: {
            main: '#20BFB8',
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

export default theme;
