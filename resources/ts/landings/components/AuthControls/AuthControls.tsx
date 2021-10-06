import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useAuth } from '@shared/hooks/useAuth';
import { cx } from '@shared/lib/utils/cx';

const useStyles = makeStyles(
    (theme) => ({
        button: {
            color: theme.palette.primary.light,
            borderRadius: 24,
            padding: theme.spacing(1.25, 3.5),
            fontWeight: 500,
            fontSize: 14,
        },
        buttonHighlighted: {
            border: `2px solid ${theme.palette.primary.light} !important`,
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
            },
        },
        dashboardBtn: {
            color: '#fff',
        },
        space: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'AuthControls' },
);

export function AuthControls() {
    const { checking, authenticated } = useAuth();
    const classes = useStyles();

    if (checking) {
        return null;
    }

    if (!authenticated) {
        return (
            <>
                <Button href={'/auth/sign-in'} color={'primary'} className={cx(classes.button, classes.space)}>
                    Log in
                </Button>
                <Button
                    href={'/auth/sign-up'}
                    variant={'outlined'}
                    color={'primary'}
                    className={cx(classes.button, classes.buttonHighlighted)}
                >
                    Sign Up
                </Button>
            </>
        );
    }

    return (
        <Button href={'/dashboard'} className={classes.dashboardBtn}>
            Dashboard
        </Button>
    );
}

export default AuthControls;
