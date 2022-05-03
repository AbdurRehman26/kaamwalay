import CheckIcon from '@mui/icons-material/CheckRounded';
import ErrorIcon from '@mui/icons-material/PriorityHighRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import styled from '@mui/styles/styled';
import { useSharedSelector } from '../../hooks/useSharedSelector';

export function LoadingModal() {
    const open = useSharedSelector((state) => state.modals.instances.loading?.isOpen);
    const state = useSharedSelector((state) => state.modals.instances.loading?.data?.state);
    const message = useSharedSelector((state) => state.modals.instances.loading?.data?.message);

    return (
        <Dialog
            open={!!open}
            disableEscapeKeyDown
            TransitionProps={{
                exit: false,
            }}
        >
            <Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} p={6}>
                {state === 'loading' ? (
                    <CircularProgress size={64} thickness={3} />
                ) : state === 'loaded' ? (
                    <CircleBox>
                        <CheckIcon className={'LoadingModal-icon'} />
                    </CircleBox>
                ) : state === 'error' ? (
                    <CircleBox className={'error'}>
                        <ErrorIcon className={'LoadingModal-icon'} />
                    </CircleBox>
                ) : null}
                <Typography variant={'body2'} color={'textSecondary'} mt={3}>
                    {message}
                </Typography>
            </Grid>
        </Dialog>
    );
}

const CircleBox = styled('div')(
    ({ theme }) => ({
        border: `3px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        width: 64,
        height: 64,
        borderRadius: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&.error': {
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main,
        },

        '& .LoadingModal-icon': {
            width: 36,
            height: 36,
            fontSize: 36,
        },
    }),
    {
        name: 'CircleBox',
    },
);
