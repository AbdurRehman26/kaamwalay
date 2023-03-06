import UploadIcon from '@mui/icons-material/FileUploadOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import dummyLargeAvatar from '@shared/assets/dummyLargeAvatar.png';
import { AuthDialog } from '@shared/components/AuthDialog';
import { AuthenticationEnum } from '@shared/constants/AuthenticationEnum';
import { RolesEnum } from '@shared/constants/RolesEnum';
import { useAuth } from '@shared/hooks/useAuth';
import { cx } from '@shared/lib/utils/cx';
import SubmissionButton from '../SubmissionButton/SubmissionButton';

const useStyles = makeStyles(
    (theme) => ({
        button: {
            color: theme.palette.primary.light,
            borderRadius: 24,
            padding: theme.spacing(1.25, 2.5),
            fontWeight: 500,
            fontSize: 14,
            [theme.breakpoints.down('sm')]: {
                minWidth: 40,
                width: 40,
                height: 40,
                overflow: 'hidden',
                padding: theme.spacing(1),
                '& .AuthControls-buttonLabel': {
                    display: 'none',
                },
                '& .MuiButton-startIcon': {
                    marginRight: -3,
                },
            },
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
    const { checking, authenticated, openAuthDialog, authDialogProps, user } = useAuth();
    const classes = useStyles();
    const isRedirect = localStorage.getItem('logged-in-user:redirect');

    function redirection(redirectUrl: string) {
        window.location.assign(redirectUrl);
        localStorage.setItem('logged-in-user:redirect', 'false');
    }

    if (checking) {
        return null;
    }

    if (authenticated && isRedirect !== 'false') {
        if (user.hasRole(RolesEnum.Admin)) {
            redirection(AuthenticationEnum.AdminRoute);
        } else if (user.hasRole(RolesEnum.Salesman)) {
            redirection(AuthenticationEnum.SalesRepDashboardRoute);
        } else {
            redirection(AuthenticationEnum.DashboardRoute);
        }
    }
    if (!authenticated) {
        localStorage.removeItem('logged-in-user:redirect');
    }

    return (
        <>
            <SubmissionButton
                color={'primary'}
                variant={'outlined'}
                className={cx(classes.button, classes.buttonHighlighted, classes.space)}
                startIcon={<UploadIcon />}
            >
                <span className={'AuthControls-buttonLabel'}>Submit</span>
            </SubmissionButton>
            {authenticated ? (
                <ButtonBase
                    href={
                        user.hasRole(RolesEnum.Admin)
                            ? '/admin'
                            : user.hasRole(RolesEnum.Salesman)
                            ? '/salesrep'
                            : '/dashboard'
                    }
                >
                    <Avatar src={user?.profileImage ?? dummyLargeAvatar} />
                </ButtonBase>
            ) : (
                <Button
                    color={'primary'}
                    className={cx(classes.button)}
                    startIcon={<PersonIcon />}
                    onClick={openAuthDialog}
                >
                    <span className={'AuthControls-buttonLabel'}>Log in</span>
                </Button>
            )}

            <AuthDialog {...authDialogProps} />
        </>
    );
}

export default AuthControls;
