import MoreIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Moment } from 'moment';
import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { deleteOrder, setOrderCustomerShipment } from '@shared/redux/slices/ordersSlice';
import { useAppDispatch } from '@dashboard/redux/hooks';
import PaymentStatusNotice from '@dashboard/components/PaymentStatusNotice';
import { PaymentStatusChip } from '@dashboard/components/PaymentStatusChip';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { SubmissionStatusChip } from '@dashboard/components/SubmissionStatusChip';
import OrderDeleteDialog from '@shared/components/Orders/OrderDeleteDialog';

interface SubmissionTableRowProps {
    id: number;
    orderNumber: string;
    serviceLevel: number;
    cardsNumber: number;
    status: OrderStatusEnum;
    invoice?: string;
    invoiceNumber?: string;
    disabled?: boolean;
    isSm?: boolean;
    orderCustomerShipment: null | ShipmentEntity;
    datePlaced?: Date | Moment | null;
    dateArrived?: Date | Moment | null;
    paymentStatus?: PaymentStatusEnum;
}

enum Options {
    View,
    Edit,
    Download,
    Delete,
    ViewInstructions,
    ToggleShipmentTrackingModal,
    ContinueSubmission,
}

const useStyles = makeStyles(
    {
        submissionHolder: {
            width: '100%',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingBottom: '12px',
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
        closeIconBtn: {
            paddingTop: 0,
        },
        linkText: {
            textDecoration: 'none',
            color: '#000',
        },
        unpaidOrderTableCell: {
            border: 'none',
        },
    },
    { name: 'SubmissionTableRow' },
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
        isSm,
        paymentStatus,
    } = props;

    const submissionViewUrl = `/submissions/${id}/view`;
    const navigate = useNavigate();
    const classes = useStyles();
    const [showShipmentTrackingModal, setShowShipmentTrackingModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const dispatch = useAppDispatch();

    const handleOption = useCallback(
        (option: Options) => async () => {
            handleCloseOptions();
            switch (option) {
                case Options.View:
                    navigate(`/submissions/${id}/view`);
                    break;
                case Options.ViewInstructions:
                    navigate(`/submissions/${id}/confirmation`);
                    break;
                case Options.Edit:
                    navigate(`/submissions/${id}/edit`);
                    break;
                case Options.ToggleShipmentTrackingModal:
                    setShowShipmentTrackingModal(!showShipmentTrackingModal);
                    break;
                case Options.Download:
                    downloadFromUrl(invoice!, `robograding-${invoiceNumber}.pdf`);
                    break;
                case Options.Delete:
                    setShowDeleteModal(!showDeleteModal);
                    break;
                case Options.ContinueSubmission:
                    navigate(`/submissions/new?orderId=${id}`);
                    break;
            }
        },
        [handleCloseOptions, navigate, id, showDeleteModal, showShipmentTrackingModal, invoice, invoiceNumber],
    );

    const isPaid = useMemo(() => paymentStatus === PaymentStatusEnum.PAID, [paymentStatus]);

    const handleShipmentSubmit = useCallback(
        async ({ trackingNumber, shippingProvider }: Record<any, string>) => {
            await dispatch(setOrderCustomerShipment({ trackingNumber, shippingProvider, orderId: id }));
        },
        [dispatch, id],
    );

    const handleOrderDeleteSubmit = useCallback(
        async ({ orderId }: Record<any, number>) => {
            await dispatch(deleteOrder(orderId));
            window.location.href = '/dashboard/submissions';
        },
        [dispatch],
    );

    return (
        <>
            <OrderDeleteDialog
                open={showDeleteModal}
                onClose={handleOption(Options.Delete)}
                orderNumber={orderNumber}
                orderId={id}
                onSubmit={handleOrderDeleteSubmit}
            />

            <ShipmentDialog
                open={showShipmentTrackingModal}
                onClose={handleOption(Options.ToggleShipmentTrackingModal)}
                trackingNumber={orderCustomerShipment?.trackingNumber}
                shippingProvider={orderCustomerShipment?.shippingProvider}
                onSubmit={handleShipmentSubmit}
            />

            {!isSm ? (
                <>
                    <TableRow className={isPaid ? '' : classes.unpaidOrderTableCell}>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <MuiLink component={Link} to={submissionViewUrl}>
                                {orderNumber}
                            </MuiLink>
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <Link to={submissionViewUrl} className={classes.linkText}>
                                {datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}
                            </Link>
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <PaymentStatusChip
                                color={paymentStatus || PaymentStatusEnum.PENDING}
                                label={PaymentStatusMap[paymentStatus || PaymentStatusEnum.PENDING]}
                            />
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <Link to={submissionViewUrl} className={classes.linkText}>
                                {`${formatCurrency(serviceLevel)} / Card`}
                            </Link>
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <Link to={submissionViewUrl} className={classes.linkText}>
                                {cardsNumber}
                            </Link>
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <Link to={submissionViewUrl} className={classes.linkText}>
                                <SubmissionStatusChip color={status} label={OrderStatusEnum[status]} />
                            </Link>
                        </TableCell>
                        <TableCell align={'right'} className={isPaid ? '' : classes.unpaidOrderTableCell}>
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
                                {status === OrderStatusEnum.INCOMPLETE && (
                                    <>
                                        <MenuItem onClick={handleOption(Options.ContinueSubmission)}>
                                            Continue Submission
                                        </MenuItem>
                                        <MenuItem onClick={handleOption(Options.Delete)}>Delete</MenuItem>
                                    </>
                                )}
                            </Menu>
                        </TableCell>
                    </TableRow>
                    {!isPaid ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <PaymentStatusNotice
                                    id={id}
                                    paymentStatus={paymentStatus || PaymentStatusEnum.PENDING}
                                />
                            </TableCell>
                        </TableRow>
                    ) : null}
                </>
            ) : (
                <div className={classes.submissionHolder}>
                    <div className={classes.submissionLeftSide}>
                        <Link to={`/submissions/${id}/view`} style={{ textDecoration: 'none' }}>
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
                            Date Confirmed:{' '}
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
                                {status === OrderStatusEnum.PLACED && (
                                    <>
                                        <MenuItem onClick={handleOption(Options.Download)} disabled={!invoice}>
                                            {invoice ? 'Download' : 'Generating'}&nbsp;Packing Slip
                                        </MenuItem>
                                        <MenuItem onClick={handleOption(Options.ViewInstructions)}>
                                            View Instructions
                                        </MenuItem>
                                        <MenuItem onClick={handleOption(Options.ToggleShipmentTrackingModal)}>
                                            {orderCustomerShipment === null ? 'Add' : 'Edit'}&nbsp;Shipment Tracking #
                                        </MenuItem>
                                    </>
                                )}
                                {status === OrderStatusEnum.INCOMPLETE && (
                                    <>
                                        <MenuItem onClick={handleOption(Options.ContinueSubmission)}>
                                            Continue Submission
                                        </MenuItem>
                                        <MenuItem onClick={handleOption(Options.Delete)}>Delete</MenuItem>
                                    </>
                                )}
                            </Menu>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
