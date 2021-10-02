import MoreIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Moment } from 'moment';
import { MouseEventHandler, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { setOrderCustomerShipment } from '@shared/redux/slices/ordersSlice';
import { useAppDispatch } from '@dashboard/redux/hooks';

interface SubmissionTableRowProps {
    id: number;
    orderNumber: string;
    serviceLevel: number;
    cardsNumber: number;
    status: string;
    invoice?: string;
    invoiceNumber?: string;
    disabled?: boolean;
    orderCustomerShipment: null | ShipmentEntity;
    datePlaced?: Date | Moment | null;
    dateArrived?: Date | Moment | null;
}

enum Options {
    View,
    Edit,
    Download,
    Delete,
    ViewInstructions,
    ToggleShipmentTrackingModal,
}

const useStyles = makeStyles(
    {
        submissionHolder: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '12px',
            marginBottom: '12px',
        },
        submissionLeftSide: {
            display: 'flex',
            flexDirection: 'column',
        },
        submissionRightSide: {
            display: 'flex',
            flexDirection: 'row',
        },
        submissionPropertyLabel: {
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        submissionPropertyValue: {
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        orderNumber: {
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.2px',
            color: '#20BFB8',
            marginBottom: '6px',
        },
        closeIconContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
        orderLink: {
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            textDecorationLine: 'underline',
            color: '#20BFB8',
        },
        closeIconBtn: {
            paddingTop: 0,
        },
        linkText: {
            textDecoration: 'none',
            color: '#000',
        },
    },
    { name: 'OrderMobileRow' },
);
export function SubmissionTableRow(props: SubmissionTableRowProps) {
    const {
        id,
        orderNumber,
        datePlaced,
        dateArrived,
        serviceLevel,
        cardsNumber,
        invoice,
        invoiceNumber,
        status,
        orderCustomerShipment,
    } = props;

    const history = useHistory();
    const confirm = useConfirmation();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const classes = useStyles();
    const [showShipmentTrackingModal, setShowShipmentTrackingModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const dispatch = useAppDispatch();

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleCloseOptions();

            switch (option) {
                case Options.View:
                    history.push(`/submissions/${id}/view`);
                    break;
                case Options.ViewInstructions:
                    history.push(`/submissions/${id}/confirmation`);
                    break;
                case Options.Edit:
                    history.push(`/submissions/${id}/edit`);
                    break;
                case Options.ToggleShipmentTrackingModal:
                    setShowShipmentTrackingModal(!showShipmentTrackingModal);
                    break;
                case Options.Delete:
                    const result = await confirm();
                    if (result) {
                        console.log('Delete submission');
                    }
                    break;
                case Options.Download:
                    downloadFromUrl(invoice!, `robograding-${invoiceNumber}.pdf`);
                    break;
            }
        },
        [handleCloseOptions, history, id, confirm, invoice, invoiceNumber, showShipmentTrackingModal],
    );

    const handleShipmentSubmit = useCallback(
        async ({ trackingNumber, shippingProvider }: Record<any, string>) => {
            await dispatch(setOrderCustomerShipment({ trackingNumber, shippingProvider, orderId: id }));
        },
        [dispatch, id],
    );

    const submissionViewUrl = `submissions/${id}/view`;
    return (
        <>
            <ShipmentDialog
                open={showShipmentTrackingModal}
                onClose={handleOption(Options.ToggleShipmentTrackingModal)}
                trackingNumber={orderCustomerShipment?.trackingNumber}
                shippingProvider={orderCustomerShipment?.shippingProvider}
                onSubmit={handleShipmentSubmit}
            />

            {!isMobile ? (
                <TableRow>
                    <TableCell>
                        <Link to={submissionViewUrl}>
                            <Typography variant={'subtitle2'} className={classes.orderLink}>
                                {orderNumber}
                            </Typography>
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link to={submissionViewUrl} className={classes.linkText}>
                            {datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link to={submissionViewUrl} className={classes.linkText}>
                            {dateArrived ? formatDate(dateArrived, 'MM/DD/YYYY') : '-'}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link to={submissionViewUrl} className={classes.linkText}>
                            {`${formatCurrency(serviceLevel)} / Card`}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link to={submissionViewUrl} className={classes.linkText}>
                            {cardsNumber}
                        </Link>
                    </TableCell>
                    <TableCell>
                        <Link to={submissionViewUrl} className={classes.linkText}>
                            {status}
                        </Link>
                    </TableCell>
                    <TableCell align={'right'}>
                        <IconButton onClick={handleClickOptions} size="large">
                            <MoreIcon />
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                            <MenuItem onClick={handleOption(Options.Download)} disabled={!invoice}>
                                {invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                            </MenuItem>
                            <MenuItem onClick={handleOption(Options.ViewInstructions)}>View Instructions</MenuItem>
                            <MenuItem onClick={handleOption(Options.ToggleShipmentTrackingModal)}>
                                {orderCustomerShipment === null ? 'Add' : 'Edit'}&nbsp;Shipment Tracking #
                            </MenuItem>
                        </Menu>
                    </TableCell>
                </TableRow>
            ) : (
                <>
                    <div className={classes.submissionHolder}>
                        <div className={classes.submissionLeftSide}>
                            <Link to={`submissions/${id}/view`} style={{ textDecoration: 'none' }}>
                                <Typography variant={'subtitle1'} className={classes.orderNumber}>
                                    {orderNumber}
                                </Typography>
                            </Link>

                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Date Placed:{' '}
                                <span className={classes.submissionPropertyValue}>
                                    {datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}
                                </span>
                            </Typography>

                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Date Arrived:{' '}
                                <span className={classes.submissionPropertyValue}>
                                    {dateArrived ? formatDate(dateArrived, 'MM/DD/YYYY') : '-'}
                                </span>
                            </Typography>

                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Service Level:{' '}
                                <span className={classes.submissionPropertyValue}>
                                    {`${formatCurrency(serviceLevel)} / Card`}
                                </span>
                            </Typography>

                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                # Cards: <span className={classes.submissionPropertyValue}>{cardsNumber}</span>
                            </Typography>
                        </div>

                        <div className={classes.submissionRightSide}>
                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Status: <span className={classes.submissionPropertyValue}>{status}</span>
                            </Typography>
                            <div className={classes.closeIconContainer}>
                                <IconButton onClick={handleClickOptions} className={classes.closeIconBtn} size="large">
                                    <MoreIcon />
                                </IconButton>

                                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                                    <MenuItem onClick={handleOption(Options.Download)} disabled={!invoice}>
                                        {invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                                    </MenuItem>
                                    <MenuItem onClick={handleOption(Options.ViewInstructions)}>
                                        View Instructions
                                    </MenuItem>
                                    <MenuItem onClick={handleOption(Options.ToggleShipmentTrackingModal)}>
                                        {orderCustomerShipment === null ? 'Add' : 'Edit'}&nbsp;Shipment Tracking #
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <Divider />
                </>
            )}
        </>
    );
}
