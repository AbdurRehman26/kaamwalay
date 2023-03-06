import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEvent, useCallback, useState } from 'react';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';
import { UserEntity } from '@shared/entities/UserEntity';
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
    CustomerCredit,
}

interface SubmissionHeaderMoreButtonProps {
    orderId: number;
    orderStatus: OrderStatusEntity;
    customer: UserEntity | null;
    paymentStatus?: number;
}

export default function SubmissionHeaderMoreButton({ customer }: SubmissionHeaderMoreButtonProps) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [creditDialog, setCreditDialog] = useState(false);
    const open = Boolean(anchorEl);

    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

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
                case Options.CustomerCredit:
                    setCreditDialog(true);
                    break;
            }
        },
        [handleClose],
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
