import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { deactivateProfile, deleteProfile } from '@shared/redux/slices/userSlice';
import { ConfirmUserPasswordDialog } from './ConfirmUserPasswordDialog';
import { SettingsSection } from './SettingsSection';

export function ProfileActions() {
    const confirm = useConfirmation();
    const { logout } = useAuth();
    const notifications = useNotifications();
    const [loading, setLoading] = useState('');
    const dispatch = useSharedDispatch();
    const HTTP_AGS_UNAUTHORIZED = 400;
    const [showAskForPasswordDialog, setShowAskForPasswordDialog] = useState<boolean>(false);
    const [passwordConfirmCallback, setPasswordConfirmCallback] = useState<any>(() => {});

    const toggleAskForPasswordDialog = useCallback(() => {
        setShowAskForPasswordDialog((prev) => !prev);
    }, []);

    const dispatchProfileAction = useCallback(
        async (action: any, callback: any) => {
            const data: any = await action;
            if (data?.payload?.response?.status === HTTP_AGS_UNAUTHORIZED) {
                setShowAskForPasswordDialog(true);
                setPasswordConfirmCallback(() => async () => {
                    try {
                        const success: boolean = await dispatchProfileAction(dispatch(callback()), callback);
                        if (success) {
                            logout();
                        }
                    } catch (e) {
                        notifications.exception(e as Error);
                    }
                });

                return false;
            }

            return true;
        },
        [logout, notifications, dispatch],
    );

    const handleDeleteClick = useCallback(async () => {
        setLoading('delete');
        const result = await confirm({
            title: 'Delete account',
            message:
                "Are you sure you want to delete your account? This is a permanent action, you'll be unable to recover your account. You can deactivate your account instead.",
            confirmText: 'I understand, delete my account',
            cancelButtonProps: {
                color: 'inherit',
            },
            confirmButtonProps: {
                variant: 'contained',
                color: 'error',
            },
        });

        try {
            if (result) {
                await dispatchProfileAction(dispatch(deleteProfile()), deleteProfile);
            }
        } catch (e) {
            notifications.exception(e as Error);
        } finally {
            setLoading('');
        }
    }, [confirm, notifications, dispatch, dispatchProfileAction]);

    const handleDeactivateClick = useCallback(async () => {
        setLoading('deactivate');
        const result = await confirm({
            message:
                "Your account will be deactivated, you'll be able to activate it again later with help from our support.",
            confirmText: 'Deactivate my account',
            cancelButtonProps: {
                color: 'inherit',
            },
            confirmButtonProps: {
                variant: 'contained',
                color: 'error',
            },
        });

        try {
            if (result) {
                await dispatchProfileAction(dispatch(deactivateProfile()), deactivateProfile);
            }
        } catch (e) {
            notifications.exception(e as Error);
        } finally {
            setLoading('');
        }
    }, [confirm, notifications, dispatch, dispatchProfileAction]);

    return (
        <>
            <ConfirmUserPasswordDialog
                open={showAskForPasswordDialog}
                onClose={toggleAskForPasswordDialog}
                afterSaveCallback={passwordConfirmCallback}
            />
            <SettingsSection headline={'Account'}>
                <Stack alignItems={'flex-start'} justifyContent={'flex-start'} px={2} pb={3}>
                    <Typography variant={'subtitle1'} fontWeight={500}>
                        Deactivate Account
                    </Typography>
                    <Typography variant={'caption'} color={'textSecondary'} maxWidth={400} mb={1}>
                        Your account will be deactivated, you'll be able to activate it again later with a help of our
                        support.
                    </Typography>
                    <LoadingButton
                        loading={loading === 'deactivate'}
                        disabled={!!loading}
                        variant={'outlined'}
                        color={'error'}
                        onClick={handleDeactivateClick}
                    >
                        Deactivate Account
                    </LoadingButton>

                    <Divider flexItem sx={{ my: 3 }} />

                    <Typography variant={'subtitle1'} fontWeight={500}>
                        Delete Account
                    </Typography>
                    <Typography variant={'caption'} color={'textSecondary'} maxWidth={400} mb={1}>
                        This is a permanent action, you'll be unable to recover your account. You can deactivate your
                        account instead.
                    </Typography>
                    <LoadingButton
                        loading={loading === 'delete'}
                        disabled={!!loading}
                        variant={'contained'}
                        color={'error'}
                        onClick={handleDeleteClick}
                    >
                        Delete Account
                    </LoadingButton>
                </Stack>
            </SettingsSection>
        </>
    );
}
