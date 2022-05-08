import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { useRepository } from '@shared/hooks/useRepository';
import { UserRepository } from '@shared/repositories/UserRepository';
import { SettingsSection } from './SettingsSection';

export function AccountInfo() {
    const userRepository = useRepository(UserRepository);
    const confirm = useConfirmation();
    const { logout } = useAuth();

    const [loading, setLoading] = useState('');

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
                await userRepository.deleteAccount();
                logout();
            }
        } finally {
            setLoading('');
        }
    }, [confirm, logout, userRepository]);

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
                await userRepository.deactivateAccount();
                logout();
            }
        } finally {
            setLoading('');
        }
    }, [confirm, logout, userRepository]);

    return (
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
    );
}
