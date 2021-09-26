import { purple } from '@mui/material/colors';
import { createTheme, adaptV4Theme } from '@mui/material/styles';

// TODO: Pick right colors over here
export const materialUiTheme = createTheme(
    adaptV4Theme({
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
    }),
);

export default materialUiTheme;
