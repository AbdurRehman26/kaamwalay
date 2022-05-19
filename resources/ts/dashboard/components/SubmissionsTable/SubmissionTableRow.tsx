import MoreIcon from '@mui/icons-material/MoreVert';
import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Moment } from 'moment';
import React, { MouseEvent, MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderDeleteDialog from '@shared/components/Orders/OrderDeleteDialog';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import ShipmentDialog from '@shared/components/ShipmentDialog/ShipmentDialog';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { deleteOrder, setOrderCustomerShipment } from '@shared/redux/slices/ordersSlice';
import PayNowStatusNotice from '@dashboard/components/PayNowStatusNotice';
import PaymentStatusNotice from '@dashboard/components/PaymentStatusNotice';
import { SubmissionStatusChip } from '@dashboard/components/SubmissionStatusChip';
import { useAppDispatch } from '@dashboard/redux/hooks';

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
    datePlaced?: Date | null;
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
    PayNow,
}

const useStyles = makeStyles(
    (theme) => {
        return {
            submissionHolder: {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: '12px',
                paddingBottom: '12px',
                alignItems: 'flex-start',
            },
            submissionLeftSide: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                textAlign: 'start',
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
                [theme.breakpoints.down('sm')]: {
                    letterSpacing: '0',
                },
            },
            submissionPropertyValue: {
                fontWeight: 'normal',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.87)',
            },
            orderNumber: {
                letterSpacing: '0.2px',
                color: '#20BFB8',
                fontSize: '0.875rem',

                [theme.breakpoints.down('sm')]: {
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    marginBottom: '6px',
                },
            },
            closeIconContainer: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            },
            closeIconBtn: {
                paddingTop: 0,
            },
            unpaidOrderTableCell: {
                border: 'none',
            },
            clickable: {
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        };
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
    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );
    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);
    const dispatch = useAppDispatch();

    const endTime = datePlaced ? new Date(new Date(datePlaced).getTime() + 86400000) : 0;
    const timeInMs = datePlaced && new Date() <= endTime ? new Date(datePlaced).getTime() + 86400000 : 0;

    const handleOption = useCallback(
        (option: Options) => async (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
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
                case Options.PayNow:
                    navigate(`/submissions/${id}/pay`);
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

    const handleRowClick = useCallback<MouseEventHandler>(
        (e) => {
            if ((e.target as Element).getAttribute('aria-hidden') !== 'true') {
                navigate(submissionViewUrl);
            }
        },
        [navigate, submissionViewUrl],
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
                    <TableRow
                        className={`${classes.clickable} ${isPaid ? '' : classes.unpaidOrderTableCell}`}
                        onClick={handleRowClick}
                    >
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <Typography variant={'body1'} className={classes.orderNumber}>
                                {orderNumber}
                            </Typography>
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            {datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <PaymentStatusChip
                                color={paymentStatus || PaymentStatusEnum.PENDING}
                                label={PaymentStatusMap[paymentStatus || PaymentStatusEnum.PENDING]}
                                mode={'customer'}
                            />
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            {`${formatCurrency(serviceLevel)} / Card`}
                        </TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>{cardsNumber}</TableCell>
                        <TableCell className={isPaid ? '' : classes.unpaidOrderTableCell}>
                            <SubmissionStatusChip color={status} label={OrderStatusEnum[status]} />
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
                                {!isPaid ? <MenuItem onClick={handleOption(Options.PayNow)}>Pay Now</MenuItem> : null}
                            </Menu>
                        </TableCell>
                    </TableRow>
                    {timeInMs !== 0 ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <PayNowStatusNotice
                                    id={id}
                                    countdownTimestampMs={timeInMs}
                                    hasConfirmationPage={false}
                                    hasPay={false}
                                />
                            </TableCell>
                        </TableRow>
                    ) : null}
                    {!isPaid && timeInMs === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <PaymentStatusNotice
                                    id={id}
                                    paymentStatus={paymentStatus || PaymentStatusEnum.PENDING}
                                    hasWidth={false}
                                />
                            </TableCell>
                        </TableRow>
                    ) : null}
                </>
            ) : (
                <>
                    <ButtonBase className={classes.submissionHolder} onClick={handleRowClick}>
                        <div className={classes.submissionLeftSide}>
                            <Typography variant={'subtitle1'} className={classes.orderNumber}>
                                {orderNumber}
                            </Typography>

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
                                                {orderCustomerShipment === null ? 'Add' : 'Edit'}&nbsp;Shipment Tracking
                                                #
                                            </MenuItem>
                                            {!isPaid ? (
                                                <MenuItem onClick={handleOption(Options.PayNow)}>Pay Now</MenuItem>
                                            ) : null}
                                        </>
                                    )}
                                </Menu>
                            </div>
                        </div>
                    </ButtonBase>
                    <Grid container justifyContent={'space-between'} pb={3} sx={{ borderBottom: '1px solid #ccc' }}>
                        <Grid onClick={handleRowClick}>
                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Payment:
                            </Typography>
                            <PaymentStatusChip
                                color={paymentStatus || PaymentStatusEnum.PENDING}
                                label={PaymentStatusMap[paymentStatus || PaymentStatusEnum.PENDING]}
                                mode={'customer'}
                            />
                        </Grid>
                        <Grid onClick={handleRowClick}>
                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Status:
                            </Typography>
                            <SubmissionStatusChip color={status} label={OrderStatusEnum[status]} />
                        </Grid>
                        {timeInMs !== 0 ? (
                            <Grid mt={3}>
                                <PayNowStatusNotice
                                    id={id}
                                    countdownTimestampMs={timeInMs}
                                    hasConfirmationPage={false}
                                    hasPay={false}
                                />
                            </Grid>
                        ) : null}
                        {!isPaid && timeInMs === 0 ? (
                            <Grid mt={3}>
                                <PaymentStatusNotice
                                    id={id}
                                    paymentStatus={paymentStatus || PaymentStatusEnum.PENDING}
                                />
                            </Grid>
                        ) : null}
                    </Grid>
                </>
            )}
        </>
    );
}
