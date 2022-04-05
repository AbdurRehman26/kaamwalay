import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Moment } from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { PaymentStatusChip } from '@shared/components/PaymentStatusChip';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { PaymentStatusEnum, PaymentStatusMap } from '@shared/constants/PaymentStatusEnum';
import { ShipmentEntity } from '@shared/entities/ShipmentEntity';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { SubmissionStatusChip } from '@dashboard/components/SubmissionStatusChip';

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
export function VaultShipmentTableRow(props: SubmissionTableRowProps) {
    const { id, orderNumber, datePlaced, dateArrived, cardsNumber, status, isSm, paymentStatus } = props;

    const submissionViewUrl = `/submissions/${id}/view`;
    const classes = useStyles();

    return (
        <>
            {!isSm ? (
                <>
                    <TableRow>
                        <TableCell>
                            <Link to={submissionViewUrl} className={classes.linkText}>
                                {orderNumber}
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
                            <PaymentStatusChip
                                color={paymentStatus || PaymentStatusEnum.PENDING}
                                label={PaymentStatusMap[paymentStatus || PaymentStatusEnum.PENDING]}
                                mode={'customer'}
                            />
                        </TableCell>
                        <TableCell>
                            <Link to={submissionViewUrl} className={classes.linkText}>
                                {cardsNumber}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <MuiLink component={Link} to={submissionViewUrl}>
                                {cardsNumber}
                            </MuiLink>
                        </TableCell>
                    </TableRow>
                </>
            ) : (
                <div className={classes.submissionHolder}>
                    <div className={classes.submissionLeftSide}>
                        <Typography variant={'subtitle1'} className={classes.submissionPropertyLabel}>
                            {orderNumber}
                        </Typography>

                        <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                            Date Created:{' '}
                            <span className={classes.submissionPropertyValue}>
                                {datePlaced ? formatDate(datePlaced, 'MM/DD/YYYY') : '-'}
                            </span>
                        </Typography>

                        <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                            Date Shipped:{' '}
                            <span className={classes.submissionPropertyValue}>
                                {dateArrived ? formatDate(dateArrived, 'MM/DD/YYYY') : '-'}
                            </span>
                        </Typography>

                        <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                            # Cards: <span className={classes.submissionPropertyValue}>{cardsNumber}</span>
                        </Typography>
                        <Link to={`/submissions/${id}/view`} style={{ textDecoration: 'none' }}>
                            <Typography variant={'caption'} className={classes.submissionPropertyLabel}>
                                Tracking #: <span className={classes.orderNumber}>{cardsNumber}</span>
                            </Typography>
                        </Link>
                    </div>

                    <div className={classes.submissionRightSide}>
                        <Stack spacing={2}>
                            <SubmissionStatusChip color={status} label={OrderStatusEnum[status]} />
                        </Stack>
                    </div>
                </div>
            )}
        </>
    );
}
