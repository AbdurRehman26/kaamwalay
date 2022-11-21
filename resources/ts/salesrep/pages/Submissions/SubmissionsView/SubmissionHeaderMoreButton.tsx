import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import { useAppDispatch } from '@salesrep/redux/hooks';
import React, { MouseEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { useNotifications } from '@shared/hooks/useNotifications';
import { cancelOrder, generateOrderLabel } from '@shared/redux/slices/adminOrdersSlice';
import { CustomerCreditDialog } from '../../../components/CustomerCreditDialog';

const useStyles = makeStyles(
    (theme) => ({
        menuButton: {
            marginLeft: theme.spacing(2),
        },
    }),
    { name: 'SubmissionHeaderMoreButton' },
);

enum Options {
    AddExtraCharge,
    IssueRefund,
    CustomerCredit,
    ViewGrades,
    CancelOrder,
    MarkAsPaid,
    GenerateLabel,
}

interface SubmissionHeaderMoreButtonProps {
    orderId: number;
    orderStatus: OrderStatusEntity;
    customer: UserEntity | null;
    paymentStatus?: number;
}

export default function SubmissionHeaderMoreButton({
    orderId,
    orderStatus,
    customer,
    paymentStatus,
}: SubmissionHeaderMoreButtonProps) {
    const confirm = useConfirmation();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();

    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const handleViewGrades = useCallback(() => {
        navigate(`/submissions/${orderId}/grade`);
    }, [navigate, orderId]);

    const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const setCancelDialog = useCallback(async () => {
        const result = await confirm({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel the order?',
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
                await dispatch(cancelOrder(orderId))
                    .unwrap()
                    .then(() => {
                        navigate(`/submissions/all/list`);
                    });
            }
        } catch (e) {
            notifications.exception(e as Error);
        }
    }, [navigate, orderId, notifications, dispatch, confirm]);

    const setGenerateLabelDialog = useCallback(async () => {
        const result = await confirm({
            title: 'Generate Label',
            message: 'Are you sure you want to generate the label for this order?',
            confirmText: 'Yes',
            cancelButtonProps: {
                color: 'inherit',
            },
            confirmButtonProps: {
                variant: 'contained',
                color: 'success',
            },
        });

        try {
            if (result) {
                await dispatch(generateOrderLabel(orderId))
                    .unwrap()
                    .then(() => {
                        window.location.reload();
                    });
            }
        } catch (e) {
            notifications.exception(e as Error);
        }
    }, [orderId, notifications, dispatch, confirm]);

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleClose();

            switch (option) {
                case Options.CustomerCredit:
                    setCreditDialog(true);
                    break;
                case Options.ViewGrades:
                    handleViewGrades();
                    break;
                case Options.CancelOrder:
                    await setCancelDialog();
                    break;
                case Options.GenerateLabel:
                    await setGenerateLabelDialog();
                    break;
            }
        },
        [setCancelDialog, handleClose, handleViewGrades, setGenerateLabelDialog],
    );

    return (
        <>
            <IconButton size={'medium'} onClick={handleClick} className={classes.menuButton}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleOption(Options.CustomerCredit)}>Customer Credit</MenuItem>
            </Menu>
            {customer ? (
                <CustomerCreditDialog
                    customer={customer}
                    wallet={customer.wallet}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                />
            ) : null}
        </>
    );
}
