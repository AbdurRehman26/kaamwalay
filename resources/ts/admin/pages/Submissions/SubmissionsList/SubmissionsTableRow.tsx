import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';
import React, { MouseEventHandler, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from '@shared/components/StatusChip';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';
import SubmissionActionButton from '@admin/components/SubmissionActionButton';

interface SubmissionsTableRowProps {
    order: OrderEntity;
}

enum Options {
    Download,
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
            }
        },
        [handleCloseOptions, notifications, order.invoice],
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
                <StatusChip label={order.orderStatus?.name} color={order.orderStatus?.code as any} />
            </TableCell>
            <TableCell>{formatCurrency(order.totalDeclaredValue)}</TableCell>
            <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
            <TableCell align={'right'}>
                <SubmissionActionButton orderId={order.id} orderStatus={order.orderStatus} size={'small'} />
            </TableCell>
            <TableCell align={'right'} className={classes.optionsCell}>
                <IconButton onClick={handleClickOptions}>
                    <MoreIcon />
                </IconButton>

                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                    <MenuItem onClick={handleOption(Options.Download)} disabled={!order.invoice}>
                        {order.invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                    </MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}

export default SubmissionsTableRow;
