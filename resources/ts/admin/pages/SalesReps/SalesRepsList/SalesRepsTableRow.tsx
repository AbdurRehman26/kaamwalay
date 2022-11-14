import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { MouseEvent, MouseEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SalesRepStatusChip } from '@shared/components/SalesRepStatusChip';
import { SalesRapStatusEnum } from '@shared/constants/SalesRapStatusEnum';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { useNotifications } from '@shared/hooks/useNotifications';
import { removeSalesRepRoleFromUser, setSalesRep, setSalesRepActive } from '@shared/redux/slices/adminSalesRepSlice';
import { SalesRepUpdateDialog } from '@admin/pages/SalesReps/SalesRepUpdateDialog';
import { useAppDispatch } from '@admin/redux/hooks';

interface SalesRepsTableRowProps {
    salesRep: SalesRepEntity;
}

const styles = {
    TableRow: {
        '&:hover': {
            cursor: 'pointer',
            background: '#F9F9F9',
        },
    },
};

enum RowOption {
    EditSalesRep,
    RemoveSalesRep,
    SetActive,
}

export function SalesRepsTableRow({ salesRep }: SalesRepsTableRowProps) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const confirm = useConfirmation();
    const notifications = useNotifications();
    const [updateDialog, setUpdateDialog] = useState(false);

    const setRemoveDialog = useCallback(
        async (id: number) => {
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
                    await dispatch(removeSalesRepRoleFromUser(id));
                    navigate(`/salesreps`);
                }
            } catch (e) {
                notifications.exception(e as Error);
            }
        },
        [dispatch, navigate, notifications, confirm],
    );

    const toggleActive = useCallback(
        async (data: SalesRepEntity) => {
            await dispatch(
                setSalesRepActive({
                    userId: data.id,
                    active: !data?.status,
                }),
            );
            window.location.reload();
        },
        [dispatch],
    );

    const handleRowClick = useCallback(
        (e, id: number) => {
            if ((e.target as Element).getAttribute('aria-hidden') !== 'true') {
                navigate(`/salesreps/${id}/view/overview`);
            }
        },
        [navigate],
    );

    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );

    const handleOption = useCallback(
        (option: RowOption, salesRep: SalesRepEntity) => async (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            handleCloseOptions();
            switch (option) {
                case RowOption.EditSalesRep:
                    dispatch(setSalesRep(salesRep));
                    setUpdateDialog(true);
                    break;
                case RowOption.RemoveSalesRep:
                    setRemoveDialog(salesRep.id);
                    break;
                case RowOption.SetActive:
                    toggleActive(salesRep);
                    break;
            }
        },
        [dispatch, handleCloseOptions, setRemoveDialog, toggleActive],
    );

    const handleUpdateDialogClose = useCallback(() => {
        setUpdateDialog(false);
    }, []);

    const handleUpdate = useCallback(() => {
        window.location.reload();
        setUpdateDialog(false);
    }, []);

    return (
        <>
            <TableRow key={salesRep.id} onClick={(e) => handleRowClick(e, salesRep.id)} sx={styles.TableRow}>
                <TableCell variant={'body'}>
                    <Grid container>
                        <Avatar src={salesRep.profileImage ?? ''}>{salesRep.getInitials()}</Avatar>
                        <Grid item xs container direction={'column'} pl={2}>
                            <Typography variant={'body2'}>{salesRep.fullName}</Typography>
                            <Typography variant={'caption'} color={'textSecondary'}>
                                {salesRep.email}
                            </Typography>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell align="center" variant={'body'}>
                    {salesRep.customers ?? '-'}
                </TableCell>
                <TableCell align="center" variant={'body'}>
                    {salesRep.orders ?? '-'}
                </TableCell>
                <TableCell align="center" variant={'body'}>
                    {salesRep.commissionEarned ?? '-'}
                </TableCell>
                {/* <TableCell variant={'body'}>{salesRep.commissionPaid}</TableCell> */}
                <TableCell variant={'body'} align={'center'}>
                    {salesRep.status !== null ? (
                        <SalesRepStatusChip color={salesRep.status} label={SalesRapStatusEnum[salesRep.status]} />
                    ) : (
                        '-'
                    )}
                </TableCell>
                <TableCell variant={'body'} align={'center'}>
                    {salesRep.sales || 0}
                </TableCell>
                <TableCell variant={'body'} align={'right'}>
                    <IconButton onClick={handleClickOptions} size="large">
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <MenuItem onClick={handleOption(RowOption.EditSalesRep, salesRep)}>Edit User</MenuItem>
                        <MenuItem onClick={handleOption(RowOption.RemoveSalesRep, salesRep)}>Remove Sales Rep</MenuItem>
                        <MenuItem onClick={handleOption(RowOption.SetActive, salesRep)}>
                            Mark {salesRep.status ? 'Inactive' : 'Active'}
                        </MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
            <SalesRepUpdateDialog open={updateDialog} onSubmit={handleUpdate} onClose={handleUpdateDialogClose} />
        </>
    );
}
