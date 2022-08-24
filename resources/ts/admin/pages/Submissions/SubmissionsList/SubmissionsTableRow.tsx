import MoreIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderDeleteDialog from '@shared/components/Orders/OrderDeleteDialog';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { StatusChip } from '@shared/components/StatusChip';
import { SafeSquare } from '@shared/components/icons/SafeSquare';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { deleteOrder } from '@shared/redux/slices/ordersSlice';
import { font } from '@shared/styles/utils';
import { useOrderStatus } from '@admin/hooks/useOrderStatus';
import { useAppDispatch } from '@admin/redux/hooks';
import { CustomerCreditDialog } from '../../../components/CustomerCreditDialog';
import { SubmissionActionButton } from '../../../components/SubmissionActionButton';
import DialogMarkAsPaid from '../SubmissionsView/DialogMarkAsPaid';

interface SubmissionsTableRowProps {
    order: OrderEntity;
    isCustomerDetailPage: boolean;
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

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionsTableRow
 * @date: 15.09.2021
 * @time: 04:42
 */
export function SubmissionsTableRow({ order, isCustomerDetailPage }: SubmissionsTableRowProps) {
    const notifications = useNotifications();
    const classes = useStyles();
    const [creditDialog, setCreditDialog] = useState(false);
    const [markPaidDialog, setMarkPaidDialog] = useState(false);
    const [displayOrderDeleteDialog, setDisplayOrderDeleteDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const navigate = useNavigate();
    const [statusType, statusLabel] = useOrderStatus(order?.orderStatus);
    const dispatch = useAppDispatch();

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
                    setMarkPaidDialog(!markPaidDialog);
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
            markPaidDialog,
        ],
    );

    const handleOrderPaid = useCallback(() => {
        setMarkPaidDialog(false);
    }, []);

    const handleOrderDeleteSubmit = useCallback(
        async ({ orderId }: Record<any, number>) => {
            await dispatch(deleteOrder(orderId));
            window.location.href = '/admin/submissions/incomplete/list';
        },
        [dispatch],
    );

    const inVault = order?.shippingMethod?.code === ShippingMethodType.VaultStorage;

    return (
        <>
            <TableRow>
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
                <TableCell>{order.createdAt ? formatDate(order.createdAt, 'MM/DD/YYYY') : 'N/A'}</TableCell>
                {isCustomerDetailPage ? (
                    <>
                        <TableCell>{order.arrivedAt ? formatDate(order.arrivedAt, 'MM/DD/YYYY') : 'N/A'}</TableCell>
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
                    </>
                ) : null}
                <TableCell>{order.numberOfCards}</TableCell>
                <TableCell>
                    <StatusChip label={statusLabel} color={statusType} />
                </TableCell>
                <TableCell>
                    <PaymentStatusChip
                        color={order?.paymentStatus}
                        label={PaymentStatusMap[order?.paymentStatus]}
                        mode={'admin'}
                    />
                </TableCell>
                <TableCell>{formatCurrency(order.totalDeclaredValue)}</TableCell>
                <TableCell>
                    {order?.orderStatus.is(OrderStatusEnum.INCOMPLETE) ? 'N/A' : formatCurrency(order.grandTotal)}
                </TableCell>
                <TableCell align={'right'}>
                    <SubmissionActionButton
                        orderId={order.id}
                        orderStatus={order.orderStatus}
                        size={'small'}
                        buttonOnly
                        trackingNumber={order.orderShipment?.trackingNumber}
                        shippingProvider={order.orderShipment?.shippingProvider}
                    />
                </TableCell>
                <TableCell align={'right'} className={classes.optionsCell}>
                    <Grid container alignItems={'center'} justifyContent={'flex-end'}>
                        {inVault ? <SafeSquare color={'primary'} sx={{ mr: 1 }} /> : null}
                        <IconButton onClick={handleClickOptions} size="large">
                            <MoreIcon />
                        </IconButton>
                    </Grid>

                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        {order?.orderStatus.is(OrderStatusEnum.INCOMPLETE) ? (
                            <>
                                <MenuItem onClick={() => navigate(`/submissions/${order.id}/view`)}>
                                    View Submission
                                </MenuItem>

                                <MenuItem onClick={handleOption(Options.Delete)}>Delete</MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={handleOption(Options.Download)} disabled={!order.invoice}>
                                    {order.invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                                </MenuItem>

                                <MenuItem onClick={handleOption(Options.CreditCustomer)}>Credit Customer</MenuItem>
                                <MenuItem onClick={handleOption(Options.MarkAsPaid)}>Mark As Paid</MenuItem>

                                {order?.orderStatus.is(OrderStatusEnum.GRADED) ||
                                order?.orderStatus.is(OrderStatusEnum.ASSEMBLED) ||
                                order?.orderStatus.is(OrderStatusEnum.SHIPPED)
                                    ? [
                                          <MenuItem key={Options.ViewGrades} onClick={handleOption(Options.ViewGrades)}>
                                              View Grades
                                          </MenuItem>,
                                          <MenuItem
                                              key={Options.DownloadOrderLabel}
                                              onClick={handleOption(Options.DownloadOrderLabel)}
                                              disabled={!order.orderLabel}
                                          >
                                              Print Stickers
                                          </MenuItem>,
                                      ]
                                    : null}
                            </>
                        )}
                    </Menu>
                </TableCell>
            </TableRow>
            <CustomerCreditDialog
                customer={order.customer}
                wallet={order.customer?.wallet}
                open={creditDialog}
                onClose={handleCreditDialogClose}
            />

            <OrderDeleteDialog
                open={displayOrderDeleteDialog}
                onClose={handleOption(Options.Delete)}
                orderNumber={order.orderNumber}
                orderId={order.id}
                onSubmit={handleOrderDeleteSubmit}
            />

            <DialogMarkAsPaid
                onSubmit={handleOrderPaid}
                open={markPaidDialog}
                onClose={() => setMarkPaidDialog(false)}
            />
        </>
    );
}

export default SubmissionsTableRow;
