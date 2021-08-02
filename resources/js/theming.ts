import { createTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

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
});

export default theme;
