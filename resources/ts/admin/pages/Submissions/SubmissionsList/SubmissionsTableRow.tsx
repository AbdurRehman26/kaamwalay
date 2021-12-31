import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { StatusChip } from '@shared/components/StatusChip';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';
import { SubmissionActionButton } from '../../../components/SubmissionActionButton';
import { useOrderStatus } from '@admin/hooks/useOrderStatus';
import Box from '@mui/material/Box';

interface SubmissionsTableRowProps {
    order: OrderEntity;
}

enum Options {
    Download,
    DownloadOrderLabel,
    ViewGrades,
}

const useStyles = makeStyles(
    (theme) => ({
        optionsCell: {
            width: theme.spacing(6),
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
export function SubmissionsTableRow({ order }: SubmissionsTableRowProps) {
    const notifications = useNotifications();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const navigate = useNavigate();
    const [statusType, statusLabel] = useOrderStatus(order?.orderStatus);

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
            }
        },
        [handleCloseOptions, navigate, notifications, order.id, order.invoice, order.orderLabel, order.orderNumber],
    );

    return (
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
            <TableCell>{formatDate(order.createdAt, 'MM/DD/YYYY')}</TableCell>
            <TableCell>{formatDate(order.arrivedAt, 'MM/DD/YYYY')}</TableCell>
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
            <TableCell>{order.numberOfCards}</TableCell>
            <TableCell>
                <StatusChip label={statusLabel} color={statusType} />
            </TableCell>
            <TableCell>{formatCurrency(order.totalDeclaredValue)}</TableCell>
            <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
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
                <IconButton onClick={handleClickOptions} size="large">
                    <MoreIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                    <MenuItem onClick={handleOption(Options.Download)} disabled={!order.invoice}>
                        {order.invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                    </MenuItem>
                    {order?.orderStatus.is(OrderStatusEnum.GRADED) || order?.orderStatus.is(OrderStatusEnum.SHIPPED) ? (
                        <Box>
                            <MenuItem onClick={handleOption(Options.ViewGrades)}>View Grades</MenuItem>
                            <MenuItem onClick={handleOption(Options.DownloadOrderLabel)} disabled={!order.orderLabel}>
                                Print Stickers
                            </MenuItem>
                        </Box>
                    ) : null}
                </Menu>
            </TableCell>
        </TableRow>
    );
}

export default SubmissionsTableRow;
