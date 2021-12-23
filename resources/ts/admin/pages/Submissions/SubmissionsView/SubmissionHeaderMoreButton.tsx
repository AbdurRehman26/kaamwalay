import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useState, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import SubmissionPaymentActionsModal from '@admin/pages/Submissions/SubmissionsView/SubmissionPaymentActionsModal';
import { DialogStateEnum } from '@admin/pages/Submissions/SubmissionsView/SubmissionTransactionDialogEnum';
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
}

interface SubmissionHeaderMoreButtonProps {
    orderId: number;
    orderStatus: OrderStatusEntity;
    orderCustomerId: number | null;
}

export default function SubmissionHeaderMoreButton({
    orderId,
    orderStatus,
    orderCustomerId,
}: SubmissionHeaderMoreButtonProps) {
    const classes = useStyles();
    const [showPaymentActionsModal, setShowPaymentActionsModal] = useState<DialogStateEnum | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const open = Boolean(anchorEl);
    const history = useHistory();

    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const handleViewGrades = useCallback(() => {
        history.push(`/submissions/${orderId}/grade`);
    }, [history, orderId]);

    const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

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
            }
        },
        [handleClose, handleViewGrades],
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
                {orderStatus.is(OrderStatusEnum.GRADED) || orderStatus.is(OrderStatusEnum.SHIPPED) ? (
                    <MenuItem onClick={handleOption(Options.ViewGrades)}>View Grades</MenuItem>
                ) : null}
            </Menu>
            <SubmissionPaymentActionsModal
                openState={showPaymentActionsModal}
                orderId={orderId}
                setShowPaymentActionsModal={setShowPaymentActionsModal}
            />
            {orderCustomerId ? (
                <CustomerCreditDialog
                    customerId={orderCustomerId}
                    open={creditDialog}
                    onClose={handleCreditDialogClose}
                />
            ) : null}
        </>
    );
}
