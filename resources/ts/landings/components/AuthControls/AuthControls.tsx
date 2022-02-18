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
import { AuthDialogHeader } from '../../../auth/pages/Auth/AuthDialogHeader';
import { useAppDispatch, useAppSelector } from '../../../landings/redux/hooks';
import { headerDialogVisibility } from '../../../landings/redux/slices/authDialogSlice';

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
    const isHeaderAuthDialogOpen = useAppSelector((state) => state.authDialogSlice.headerDialogOpened);
    const dispatch = useAppDispatch();

    const handleAuthDialogClose = () => {
        dispatch(headerDialogVisibility(false));
    };

    if (checking) {
        return null;
    }

    return (
        <>
            <Button
                href={'/dashboard/submissions/new'}
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
                    onClick={() => {
                        dispatch(headerDialogVisibility(true));
                    }}
                    color={'primary'}
                    className={cx(classes.button)}
                    startIcon={<PersonIcon />}
                >
                    Log in
                </Button>
            )}
            <AuthDialogHeader
                open={isHeaderAuthDialogOpen}
                onClose={handleAuthDialogClose}
                subTitle="to Access Robograding"
            />
        </>
    );
}

export default AuthControls;
