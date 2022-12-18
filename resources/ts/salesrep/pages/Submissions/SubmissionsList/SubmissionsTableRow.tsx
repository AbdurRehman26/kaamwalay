import MoreIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import { useOrderStatus } from '@salesrep/hooks/useOrderStatus';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { StatusChip } from '@shared/components/StatusChip';
import { SafeSquare } from '@shared/components/icons/SafeSquare';
import { PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';
import { CustomerCreditDialog } from '../../../components/CustomerCreditDialog';

interface SubmissionsTableRowProps {
    order: OrderEntity;
    headings?: Array<any>;
    isSalesRepDetailPage?: boolean;
}

enum Options {
    Download,
    DownloadOrderLabel,
    ViewGrades,
    CreditCustomer,
    Delete,
    MarkAsPaid,
}

const useStyles = makeStyles(
    (theme) => ({
        optionsCell: {
            width: theme.spacing(12.5),
            paddingLeft: 0,
        },
    }),
    { name: 'SubmissionsTableRow' },
);

export function SubmissionsTableRow({ order, headings }: SubmissionsTableRowProps) {
    const notifications = useNotifications();
    const classes = useStyles();
    const [creditDialog, setCreditDialog] = useState(false);
    const [showMarkPaidDialog, setShowMarkPaidDialog] = useState(false);
    const [displayOrderDeleteDialog, setDisplayOrderDeleteDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const navigate = useNavigate();
    const [statusType, statusLabel] = useOrderStatus(order?.orderStatus);

    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleCloseOptions();

            switch (option) {
                case Options.Download:
                    if (!order.invoice) {
                        notifications.error('Invoice is generating at the moment, try again in some minutes!');
                        return;
                    }

                    await downloadFromUrl(order.invoice.path, `robograding-${order.invoice.invoiceNumber}.pdf`);
                    break;
                case Options.DownloadOrderLabel:
                    if (!order.orderLabel) {
                        notifications.error('Order Label is generating at the moment, try again in some minutes!');
                        return;
                    }

                    await downloadFromUrl(order.orderLabel.path, `${order.orderNumber}_label.xlsx`);
                    break;
                case Options.ViewGrades:
                    navigate(`/submissions/${order.id}/grade`);
                    break;
                case Options.CreditCustomer:
                    setCreditDialog(true);
                    break;
                case Options.Delete:
                    setDisplayOrderDeleteDialog(!displayOrderDeleteDialog);
                    break;
                case Options.MarkAsPaid:
                    setShowMarkPaidDialog(!showMarkPaidDialog);
                    break;
            }
        },
        [
            handleCloseOptions,
            displayOrderDeleteDialog,
            navigate,
            notifications,
            order.id,
            order.invoice,
            order.orderLabel,
            order.orderNumber,
            showMarkPaidDialog,
        ],
    );

    const inVault = order?.shippingMethod?.code === ShippingMethodType.VaultStorage;

    return (
        <>
            <TableRow>
                {!headings ||
                    (headings?.includes('order_number') && (
                        <TableCell>
                            <MuiLink
                                component={Link}
                                color={'primary'}
                                to={`/submissions/${order.id}/view`}
                                className={font.fontWeightMedium}
                            >
                                {order.orderNumber}
                            </MuiLink>
                        </TableCell>
                    ))}

                {!headings ||
                    (headings?.includes('created_at') && (
                        <TableCell>{order.createdAt ? formatDate(order.createdAt, 'MM/DD/YYYY') : 'N/A'}</TableCell>
                    ))}

                {!headings ||
                    (headings?.includes('customer_number') && (
                        <TableCell>
                            {order.customer?.id && order.customer?.customerNumber ? (
                                <MuiLink
                                    component={Link}
                                    color={'primary'}
                                    to={`/customers/${order.customer?.id}/view`}
                                    className={font.fontWeightMedium}
                                >
                                    {order.customer?.customerNumber}
                                </MuiLink>
                            ) : (
                                '-'
                            )}
                        </TableCell>
                    ))}

                {!headings || (headings?.includes('cards') && <TableCell>{order.numberOfCards}</TableCell>)}

                {!headings ||
                    (headings?.includes('status') && (
                        <TableCell>
                            <StatusChip label={statusLabel} color={statusType} />
                        </TableCell>
                    ))}

                {!headings ||
                    (headings?.includes('payment_status') && (
                        <TableCell>
                            <PaymentStatusChip
                                color={order?.paymentStatus}
                                label={PaymentStatusMap[order?.paymentStatus]}
                                mode={'admin'}
                            />
                        </TableCell>
                    ))}

                {!headings ||
                    (headings?.includes('total_declared_value') && (
                        <TableCell>{formatCurrency(order.totalDeclaredValue)}</TableCell>
                    ))}

                {!headings || (headings?.includes('coupon') && <TableCell>{order?.coupon?.code ?? '-'}</TableCell>)}

                {!headings ||
                    (headings?.includes('grand_total') && <TableCell>{formatCurrency(order.grandTotal)}</TableCell>)}

                {!headings ||
                    (headings?.includes('commission') && (
                        <TableCell>{formatCurrency(order.salesmanCommission)}</TableCell>
                    ))}
                <TableCell align={'right'} className={classes.optionsCell}>
                    <Grid container alignItems={'center'} justifyContent={'flex-end'}>
                        {inVault ? <SafeSquare color={'primary'} sx={{ mr: 1 }} /> : null}
                        <IconButton onClick={handleClickOptions} size="large">
                            <MoreIcon />
                        </IconButton>
                    </Grid>

                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <MenuItem onClick={handleOption(Options.CreditCustomer)}>Credit Customer</MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
            <CustomerCreditDialog
                customer={order.customer}
                wallet={order.customer?.wallet}
                open={creditDialog}
                onClose={handleCreditDialogClose}
            />
        </>
    );
}

export default SubmissionsTableRow;
