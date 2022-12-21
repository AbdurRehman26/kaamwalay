import AppBar from '@mui/material/AppBar';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import makeStyles from '@mui/styles/makeStyles';
import Logo from '@shared/assets/robogradingLogo.svg';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            background: 'linear-gradient(106.54deg, #140078 -4.67%, #6C31BC 112.32%)',
            height: 72,
            justifyContent: 'center',
            [theme.breakpoints.down('sm')]: {
                height: 60,
            },
        },
        brand: {
            display: 'block',
        },
        brandImage: {
            display: 'block',
            height: 64,
            [theme.breakpoints.down('sm')]: {
                height: 48,
            },
        },
    }),
    {
        name: 'LayoutHeader',
    },
);

export function LayoutHeader() {
    const classes = useStyles();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
    });

    return (
        <AppBar position="sticky" className={classes.root} elevation={trigger ? 4 : 0}>
            <Toolbar>
                <MuiLink href={'/'} className={classes.brand}>
                    <img src={Logo} alt={'Robograding'} className={classes.brandImage} />
                </MuiLink>
            </Toolbar>
        </AppBar>
    );
}
export default LayoutHeader;
