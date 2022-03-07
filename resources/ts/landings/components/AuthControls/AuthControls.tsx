import UploadIcon from '@mui/icons-material/FileUploadOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import dummyLargeAvatar from '@shared/assets/dummyLargeAvatar.png';
import { useAuth } from '@shared/hooks/useAuth';
import { cx } from '@shared/lib/utils/cx';
import { AuthDialog } from '@shared/components/Auth/AuthDialog';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import { headerDialogVisibility } from '@shared/redux/slices/authenticationSlice';
import { useCallback } from 'react';

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
                textIndent: -9999,
                overflow: 'hidden',
                padding: theme.spacing(1),
                '& .MuiButton-startIcon': {
                    marginRight: -2,
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
    const { checking, authenticated } = useAuth();
    const classes = useStyles();
    const dispatch = useSharedDispatch();
    const isHeaderAuthDialogOpen = useSharedSelector((state) => state.authentication.headerDialogOpened);

    const handleAuthDialogClose = useCallback(() => {
        dispatch(headerDialogVisibility(false));
    }, [dispatch]);

    const handleChange = () => {
        if (!authenticated) {
            dispatch(headerDialogVisibility(true));
        } else {
            window.location.href = '/dashboard/submissions/new';
        }
    };

    if (checking) {
        return null;
    }

    return (
        <>
            <Button
                onClick={handleChange}
                color={'primary'}
                variant={'outlined'}
                className={cx(classes.button, classes.buttonHighlighted, classes.space)}
                startIcon={<UploadIcon />}
            >
                Submit
            </Button>
            {authenticated ? (
                <ButtonBase href={'/dashboard'}>
                    <Avatar src={dummyLargeAvatar} />
                </ButtonBase>
            ) : (
                <Button
                    onClick={handleChange}
                    color={'primary'}
                    className={cx(classes.button)}
                    startIcon={<PersonIcon />}
                >
                    Log in
                </Button>
            )}
            <AuthDialog
                open={isHeaderAuthDialogOpen}
                onClose={handleAuthDialogClose}
                subTitle="to Access Robograding"
            />
        </>
    );
}

export default AuthControls;
