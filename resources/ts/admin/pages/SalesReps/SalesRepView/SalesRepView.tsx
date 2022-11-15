import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { SalesRepStatusChip } from '@shared/components/SalesRepStatusChip';
import { SalesRapStatusEnum } from '@shared/constants/SalesRapStatusEnum';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { useNotifications } from '@shared/hooks/useNotifications';
import { nameInitials } from '@shared/lib/strings/initials';
import { useAdminSalesRepQuery } from '@shared/redux/hooks/useAdminSalesRepQuery';
import { removeSalesRepRoleFromUser, setSalesRep, setSalesRepActive } from '@shared/redux/slices/adminSalesRepSlice';
import { CustomerCreditDialog } from '@admin/components/CustomerCreditDialog';
import { SalesRepUpdateDialog } from '@admin/pages/SalesReps/SalesRepUpdateDialog';
import SalesRepViewContent from '@admin/pages/SalesReps/SalesRepView/SalesRepViewContent';

enum RowOption {
    EditSalesRep,
    RemoveSalesRep,
    SetActive,
}

const Root = styled(Grid)({
    background: '#F9F9F9',
    padding: '20px',

    '.ImageDiv': {
        maxWidth: '10%!important',
    },
    '.Avatar': {
        background: '#B5CBED',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
        fontWeight: 500,
        fontSize: '50px',
        lineHeight: '59px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerName': {
        fontWeight: 500,
        fontSize: '24px',
        lineHeight: '28px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    '.CustomerHeading': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '2px 0px',
    },
    '.Customer': {
        paddingTop: '10px',
    },
    '.CustomerValue': {
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.25px',
        color: 'rgba(0, 0, 0, 0.87)',
        paddingLeft: '5px',
    },
    '.Actions': {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingTop: '10px',
    },
});

export function SalesRepView() {
    const { id } = useParams<'id'>();
    const { tab } = useParams<{ tab: string }>();
    const [creditDialog, setCreditDialog] = useState(false);
    const [updateDialog, setUpdateDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notifications = useNotifications();
    const confirm = useConfirmation();

    const handleCreditDialogClose = useCallback(() => {
        setCreditDialog(false);
    }, []);

    const handleUpdateDialogClose = useCallback(() => {
        setUpdateDialog(false);
    }, []);

    const createCustomerSubmission = () => {
        navigate(`/submissions/${id}/new`, { state: { from: 'customer' } });
    };

    const salesrep$ = useAdminSalesRepQuery({
        resourceId: Number(id),
    });

    const handleCredit = useCallback(() => {
        window.location.reload();
    }, []);

    const handleUpdate = useCallback(() => {
        salesrep$.request();
        setUpdateDialog(false);
    }, [salesrep$]);

    const { data, isLoading } = salesrep$;

    const setRemoveDialog = useCallback(async () => {
        const result = await confirm({
            title: 'Remove Sales Rep',
            message: 'Are you sure you want to remove this sales rep?',
            confirmText: 'Yes',
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
                await dispatch(removeSalesRepRoleFromUser(Number(id)));
                navigate(`/salesreps`);
            }
        } catch (e) {
            notifications.exception(e as Error);
        }
    }, [dispatch, id, navigate, notifications, confirm]);

    const toggleActive = useCallback(
        async (data) => {
            await dispatch(
                setSalesRepActive({
                    userId: Number(id),
                    active: !data?.status,
                }),
            );
            salesrep$.request();
        },
        [dispatch, id, salesrep$],
    );

    const handleOption = useCallback(
        (action: RowOption) => {
            switch (action) {
                case RowOption.EditSalesRep:
                    dispatch(setSalesRep(data));
                    setUpdateDialog(true);
                    break;
                case RowOption.RemoveSalesRep:
                    setRemoveDialog();
                    break;
                case RowOption.SetActive:
                    toggleActive(data);
                    break;
            }
        },
        [data, dispatch, setRemoveDialog, toggleActive],
    );
    const headerActionButton = useCallback(() => {
        if (tab === 'overview') {
            return (
                <Button
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: '24px', padding: '10px 20px' }}
                    onClick={createCustomerSubmission}
                >
                    ADD COMMISSION PAYMENT
                </Button>
            );
        }
        return (
            <Button
                variant={'contained'}
                color={'primary'}
                sx={{ borderRadius: '24px', padding: '10px 20px' }}
                onClick={createCustomerSubmission}
            >
                CREATE SUBMISSION
            </Button>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    if (isLoading || !data) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Root container>
                <Grid container item xs className={'ImageDiv'} alignItems={'center'}>
                    <Avatar src={data.profileImage ?? ''} variant="square" className={'Avatar'}>
                        {nameInitials(data.fullName)}
                    </Avatar>
                </Grid>
                <Grid container item xs alignItems={'center'} pl={1.5}>
                    <Grid className={'Customer'}>
                        <Grid container item xs direction="row">
                            <Typography className={'CustomerName'}>{data.fullName}</Typography>
                            <Grid item xs pl={2}>
                                {data.status !== null ? (
                                    <SalesRepStatusChip color={data.status} label={SalesRapStatusEnum[data.status]} />
                                ) : null}
                            </Grid>
                        </Grid>
                        <Typography className={'CustomerHeading'}>
                            Email: <span className={'CustomerValue'}>{data.email}</span>
                        </Typography>
                        <Typography className={'CustomerHeading'}>
                            Phone: <span className={'CustomerValue'}>{data.phone ?? '-'}</span>
                        </Typography>
                        <Typography className={'CustomerHeading'}>
                            Commission Structure:
                            <span className={'CustomerValue'}>
                                {data.getCommissionText(data.commissionType, data.commissionValue)}
                            </span>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item xs className={'Actions'}>
                    {headerActionButton()}
                    <OptionsMenu onClick={handleOption}>
                        <OptionsMenuItem action={RowOption.EditSalesRep}>Edit User</OptionsMenuItem>
                        <OptionsMenuItem action={RowOption.RemoveSalesRep}>Remove Sales Rep</OptionsMenuItem>
                        <OptionsMenuItem action={RowOption.SetActive}>
                            Mark {data.status ? 'Inactive' : 'Active'}
                        </OptionsMenuItem>
                    </OptionsMenu>
                </Grid>
                <SalesRepUpdateDialog open={updateDialog} onSubmit={handleUpdate} onClose={handleUpdateDialogClose} />
                <CustomerCreditDialog
                    customer={data}
                    wallet={data?.wallet}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                    onSubmit={handleCredit}
                />
            </Root>
            <SalesRepViewContent salesrep={data} />
        </>
    );
}

export default SalesRepView;
