import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditCustomerDetailsDialog from '@shared/components/EditCustomerDetailsDialog';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { useNotifications } from '@shared/hooks/useNotifications';
import { cancelOrder, generateOrderLabel } from '@shared/redux/slices/adminOrdersSlice';
import SubmissionPaymentActionsModal from '@admin/pages/Submissions/SubmissionsView/SubmissionPaymentActionsModal';
import { DialogStateEnum } from '@admin/pages/Submissions/SubmissionsView/SubmissionTransactionDialogEnum';
import { useAppDispatch } from '@admin/redux/hooks';
import { CustomerCreditDialog } from '../../../components/CustomerCreditDialog';
import MarkAsPaidDialog from './MarkAsPaidDialog';

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
    EditCustomerDetails,
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
    const [showPaymentActionsModal, setShowPaymentActionsModal] = useState<DialogStateEnum | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const [showMarkPaidDialog, setShowMarkPaidDialog] = useState(false);
    const [editCustomerDialog, setEditCustomerDialog] = useState(false);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();

    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const handleOrderPaid = useCallback(() => {
        setShowMarkPaidDialog(false);
        window.location.reload();
    }, []);

    const handleViewGrades = useCallback(() => {
        navigate(`/submissions/${orderId}/grade`);
    }, [navigate, orderId]);

    const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    const handleEditCustomerDialogClose = useCallback(() => {
        setEditCustomerDialog(false);
    }, []);

    const handleEditCustomerSubmit = useCallback(() => {
        setEditCustomerDialog(false);
        window.location.reload();
    }, []);

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
                case Options.AddExtraCharge:
                    setShowPaymentActionsModal(DialogStateEnum.ShowAddExtraCharge);
                    break;
                case Options.IssueRefund:
                    setShowPaymentActionsModal(DialogStateEnum.ShowIssueRefund);
                    break;
                case Options.CustomerCredit:
                    setCreditDialog(true);
                    break;
                case Options.ViewGrades:
                    handleViewGrades();
                    break;
                case Options.CancelOrder:
                    await setCancelDialog();
                    break;
                case Options.MarkAsPaid:
                    await setShowMarkPaidDialog(true);
                    break;
                case Options.GenerateLabel:
                    await setGenerateLabelDialog();
                    break;
                case Options.EditCustomerDetails:
                    setEditCustomerDialog(true);
                    break;
            }
        },
        [handleClose, handleViewGrades, setCancelDialog, setGenerateLabelDialog],
    );

    return (
        <>
            <IconButton size={'medium'} onClick={handleClick} className={classes.menuButton}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleOption(Options.AddExtraCharge)}>Add Extra Charge</MenuItem>
                <MenuItem onClick={handleOption(Options.IssueRefund)}>Issue Refund</MenuItem>
                <MenuItem onClick={handleOption(Options.CustomerCredit)}>Customer Credit</MenuItem>
                <MenuItem onClick={handleOption(Options.CancelOrder)}>Cancel Submission</MenuItem>
                {orderStatus.isAny([OrderStatusEnum.GRADED, OrderStatusEnum.ASSEMBLED, OrderStatusEnum.SHIPPED]) ? (
                    <MenuItem onClick={handleOption(Options.GenerateLabel)}>Generate Label</MenuItem>
                ) : null}
                {paymentStatus !== PaymentStatusEnum.PAID ? (
                    <MenuItem onClick={handleOption(Options.MarkAsPaid)}>Mark As Paid</MenuItem>
                ) : null}
                {orderStatus.isAny([OrderStatusEnum.GRADED, OrderStatusEnum.ASSEMBLED, OrderStatusEnum.SHIPPED]) ? (
                    <MenuItem onClick={handleOption(Options.ViewGrades)}>View Grades</MenuItem>
                ) : null}
                <MenuItem onClick={handleOption(Options.EditCustomerDetails)}>Edit Customer Details</MenuItem>
            </Menu>
            <SubmissionPaymentActionsModal
                openState={showPaymentActionsModal}
                orderId={orderId}
                setShowPaymentActionsModal={setShowPaymentActionsModal}
            />
            {customer ? (
                <>
                    <CustomerCreditDialog
                        customer={customer}
                        wallet={customer.wallet}
                        open={creditDialog}
                        onClose={handleCreditDialogClose}
                    />
                    <EditCustomerDetailsDialog
                        customer={customer}
                        endpointUrl={`admin/customer/${customer.id}`}
                        endpointVersion={'v3'}
                        open={editCustomerDialog}
                        onSubmit={handleEditCustomerSubmit}
                        onClose={handleEditCustomerDialogClose}
                    />
                </>
            ) : null}
            <MarkAsPaidDialog
                orderId={orderId}
                onSubmit={handleOrderPaid}
                open={showMarkPaidDialog}
                onClose={() => setShowMarkPaidDialog(false)}
            />
            <MarkAsPaidDialog
                orderId={orderId}
                onSubmit={handleOrderPaid}
                open={showMarkPaidDialog}
                onClose={() => setShowMarkPaidDialog(false)}
            />
        </>
    );
}
