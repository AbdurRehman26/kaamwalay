import MoreIcon from '@mui/icons-material/MoreVert';
import Checkbox from '@mui/material/Checkbox';
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
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { setCustomer } from '@shared/redux/slices/editCustomerSlice';
import { deleteOrder } from '@shared/redux/slices/ordersSlice';
import { setSubmissionIds } from '@shared/redux/slices/submissionSelection';
import { font } from '@shared/styles/utils';
import { useOrderStatus } from '@admin/hooks/useOrderStatus';
import MarkAbandonedStateDialog from '@admin/pages/Submissions/SubmissionsView/MarkAbandonedStateDialog';
import { useAppDispatch } from '@admin/redux/hooks';
import { CustomerCreditDialog } from '../../../components/CustomerCreditDialog';
import { SubmissionActionButton } from '../../../components/SubmissionActionButton';
import MarkAsPaidDialog from '../SubmissionsView/MarkAsPaidDialog';

interface SubmissionsTableRowProps {
    order: OrderEntity;
    isCustomerDetailPage: boolean;
    isSalesRepDetailPage?: boolean;
    isReferralPage?: boolean;
    onEditCustomer?: any;
    showSubmissionActionButtons?: boolean;
    displayCheckbox?: boolean;
}

enum Options {
    Download,
    DownloadOrderLabel,
    ViewGrades,
    CreditCustomer,
    Delete,
    MarkAsPaid,
    EditCustomerDetails,
    MarkAbandoned,
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
export function SubmissionsTableRow({
    order,
    isCustomerDetailPage,
    onEditCustomer,
    displayCheckbox = false,
    isSalesRepDetailPage = false,
    isReferralPage = false,
    showSubmissionActionButtons = true,
}: SubmissionsTableRowProps) {
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
    const dispatch = useAppDispatch();
    const selectedIds = useAppSelector((state) => state.submissionSelection.selectedIds);
    const isSelected = (selectedRowId: number) => selectedIds.indexOf(selectedRowId) !== -1;
    const handleCreditDialogClose = useCallback(() => setCreditDialog(false), []);
    const [showMarkAbandonedDialog, setShowMarkAbandonedDialog] = useState(false);

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
                case Options.EditCustomerDetails:
                    if (onEditCustomer) {
                        dispatch(setCustomer(order.customer));
                        onEditCustomer();
                    }
                    break;
                case Options.MarkAbandoned:
                    await setShowMarkAbandonedDialog(true);
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
            dispatch,
            order.customer,
            onEditCustomer,
        ],
    );

    const handleOrderPaid = useCallback(() => {
        setShowMarkPaidDialog(false);
        window.location.reload();
    }, []);

    const handleOrderDeleteSubmit = useCallback(
        async ({ orderId }: Record<any, number>) => {
            await dispatch(deleteOrder(orderId));
            window.location.href = '/admin/submissions/incomplete/list';
        },
        [dispatch],
    );

    const inVault = order?.shippingMethod?.code === ShippingMethodType.VaultStorage;
    const handleRowClick = (id: number) => {
        if (selectedIds) {
            const selectedIndex = selectedIds.indexOf(id);
            let newSelected: number[] = [];
            if (selectedIndex === -1) {
                newSelected = newSelected.concat(selectedIds, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(selectedIds.slice(1));
            } else if (selectedIndex === selectedIds.length - 1) {
                newSelected = newSelected.concat(selectedIds.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    selectedIds.slice(0, selectedIndex),
                    selectedIds.slice(selectedIndex + 1),
                );
            }
            dispatch(setSubmissionIds({ ids: newSelected }));
        }
    };

    return (
        <>
            <TableRow style={{ backgroundColor: isSelected(order.id) ? '#F5FEFE' : '' }}>
                <TableCell style={{ minWidth: 200 }}>
                    {displayCheckbox && (
                        <Checkbox
                            color="primary"
                            key={order.id}
                            disabled={order.paymentStatus === PaymentStatusEnum.PAID && !order.isAbandoned}
                            checked={isSelected(order.id)}
                            onClick={() => handleRowClick(order.id)}
                        />
                    )}

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
                {isCustomerDetailPage && !isReferralPage ? (
                    <TableCell>{order.arrivedAt ? formatDate(order.arrivedAt, 'MM/DD/YYYY') : 'N/A'}</TableCell>
                ) : null}
                {isCustomerDetailPage || isReferralPage ? (
                    <TableCell>
                        {order.customer?.id && order.customer?.customerNumber ? (
                            <MuiLink
                                component={Link}
                                color={'primary'}
                                to={`/customers/${order.customer?.id}/view/overview`}
                                className={font.fontWeightMedium}
                            >
                                {order.customer?.getFullName()}
                            </MuiLink>
                        ) : (
                            '-'
                        )}
                    </TableCell>
                ) : null}
                {isCustomerDetailPage || isReferralPage ? (
                    <TableCell>
                        {order?.owner?.fullName ? (
                            <MuiLink
                                component={Link}
                                color={'primary'}
                                to={`/salesreps/${order.owner?.id}/view/overview`}
                                className={font.fontWeightMedium}
                            >
                                {order.owner.fullName}
                            </MuiLink>
                        ) : (
                            '-'
                        )}{' '}
                    </TableCell>
                ) : null}
                {isCustomerDetailPage || isReferralPage ? (
                    <TableCell>
                        {order?.customer?.referredBy ? (
                            <MuiLink
                                component={Link}
                                color={'primary'}
                                to={`/customers/${order.customer?.referredBy?.id}/view/overview`}
                                className={font.fontWeightMedium}
                            >
                                {order.customer?.referredBy?.fullName}
                            </MuiLink>
                        ) : (
                            '-'
                        )}
                    </TableCell>
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
                {isReferralPage || isCustomerDetailPage ? <TableCell>{order.coupon?.code ?? '-'}</TableCell> : null}
                <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
                {isSalesRepDetailPage ? <TableCell>{formatCurrency(order.salesmanCommission)}</TableCell> : null}
                {showSubmissionActionButtons && !isSalesRepDetailPage && !isReferralPage ? (
                    <TableCell align={'right'}>
                        <SubmissionActionButton
                            orderId={order.id}
                            orderStatus={order.orderStatus}
                            size={'small'}
                            buttonOnly
                            trackingNumber={order.orderShipment?.trackingNumber}
                            shippingProvider={order.orderShipment?.shippingProvider}
                            shouldReload={true}
                        />
                    </TableCell>
                ) : null}
                <TableCell align={'right'} className={classes.optionsCell}>
                    <Grid container alignItems={'center'} justifyContent={'flex-end'}>
                        {inVault ? <SafeSquare color={'primary'} sx={{ mr: 1 }} /> : null}
                        <IconButton onClick={handleClickOptions} size="large">
                            <MoreIcon />
                        </IconButton>
                    </Grid>

                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                        <>
                            <MenuItem onClick={handleOption(Options.Download)} disabled={!order.invoice}>
                                {order.invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                            </MenuItem>

                            <MenuItem onClick={handleOption(Options.CreditCustomer)}>Credit Customer</MenuItem>
                            {order.paymentStatus !== PaymentStatusEnum.PAID ? (
                                <MenuItem onClick={handleOption(Options.MarkAsPaid)}>Mark As Paid</MenuItem>
                            ) : null}

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
                                          Export Labels
                                      </MenuItem>,
                                  ]
                                : null}
                            {order?.customer && onEditCustomer ? (
                                <MenuItem onClick={handleOption(Options.EditCustomerDetails)}>
                                    Edit Customer Details
                                </MenuItem>
                            ) : null}
                            {order.paymentStatus !== PaymentStatusEnum.PAID || order.hasTag('abandoned') ? (
                                <MenuItem onClick={handleOption(Options.MarkAbandoned)}>
                                    {order.hasTag('abandoned') ? 'Unmark' : 'Mark'} Abandoned
                                </MenuItem>
                            ) : null}
                        </>
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

            <MarkAsPaidDialog
                orderId={order.id}
                onSubmit={handleOrderPaid}
                open={showMarkPaidDialog}
                onClose={() => setShowMarkPaidDialog(false)}
            />

            <MarkAbandonedStateDialog
                isAbandoned={order.hasTag('abandoned')}
                orderIds={[order.id]}
                onSubmit={() => window.location.reload()}
                open={showMarkAbandonedDialog}
                onClose={() => setShowMarkAbandonedDialog(false)}
            />
        </>
    );
}

export default SubmissionsTableRow;
