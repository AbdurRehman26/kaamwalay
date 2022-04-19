import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Moment } from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { VaultShipmentStatusChip } from '@shared/components/VaultShipmentStatusChip';
import { VaultShipmentStatusEnum, VaultShipmentStatusMap } from '@shared/constants/VaultShipmentStatusEnum';
import { formatDate } from '@shared/lib/datetime/formatDate';

interface VaultShipmentTableRowProps {
    id: number;
    shipmentNumber: string;
    cardsNumber: number;
    vaultShipmentStatus: VaultShipmentStatusEnum;
    trackingNumber?: string;
    trackingUrl?: string;
    isSm?: boolean;
    dateCreated?: Date | Moment | null;
    dateShipped?: Date | Moment | null;
}

const useStyles = makeStyles(
    {
        shipmentHolder: {
            width: '100%',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingBottom: '12px',
        },
        shipmentLeftSide: {
            display: 'flex',
            flexDirection: 'column',
        },
        shipmentRightSide: {
            display: 'flex',
            flexDirection: 'row',
        },
        shipmentPropertyLabel: {
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        shipmentPropertyValue: {
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        shipmentNumber: {
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: '#20BFB8',
            marginBottom: '6px',
        },
        linkText: {
            textDecoration: 'none',
            color: '#000',
        },
    },
    { name: 'VaultShipmentTableRow' },
);
export function VaultShipmentTableRow(props: VaultShipmentTableRowProps) {
    const {
        id,
        shipmentNumber,
        dateCreated,
        dateShipped,
        cardsNumber,
        vaultShipmentStatus,
        isSm,
        trackingNumber,
        trackingUrl = '',
    } = props;

    const shipmentViewUrl = `/vault-shipments/${id}/view`;
    const classes = useStyles();

    return (
        <>
            {!isSm ? (
                <>
                    <TableRow>
                        <TableCell>
                            <Link to={shipmentViewUrl} className={classes.linkText}>
                                {shipmentNumber}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link to={shipmentViewUrl} className={classes.linkText}>
                                {dateCreated ? formatDate(dateCreated, 'MM/DD/YYYY') : '-'}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link to={shipmentViewUrl} className={classes.linkText}>
                                {dateShipped ? formatDate(dateShipped, 'MM/DD/YYYY') : '-'}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link to={shipmentViewUrl} className={classes.linkText}>
                                <VaultShipmentStatusChip
                                    color={vaultShipmentStatus || VaultShipmentStatusEnum.PENDING}
                                    label={
                                        VaultShipmentStatusMap[vaultShipmentStatus || VaultShipmentStatusEnum.PENDING]
                                    }
                                />
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link to={shipmentViewUrl} className={classes.linkText}>
                                {cardsNumber}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {trackingUrl ? (
                                <MuiLink target="_blank" href={trackingUrl} className={classes.shipmentNumber}>
                                    {trackingNumber}
                                </MuiLink>
                            ) : null}
                        </TableCell>
                    </TableRow>
                </>
            ) : (
                <div className={classes.shipmentHolder}>
                    <div className={classes.shipmentLeftSide}>
                        <Typography variant={'subtitle1'} className={classes.shipmentPropertyLabel}>
                            {shipmentNumber}
                        </Typography>

                        <Typography variant={'caption'} className={classes.shipmentPropertyLabel}>
                            Date Created:{' '}
                            <span className={classes.shipmentPropertyValue}>
                                {dateCreated ? formatDate(dateCreated, 'MM/DD/YYYY') : '-'}
                            </span>
                        </Typography>

                        <Typography variant={'caption'} className={classes.shipmentPropertyLabel}>
                            Date Shipped:{' '}
                            <span className={classes.shipmentPropertyValue}>
                                {dateShipped ? formatDate(dateShipped, 'MM/DD/YYYY') : '-'}
                            </span>
                        </Typography>

                        <Typography variant={'caption'} className={classes.shipmentPropertyLabel}>
                            # Cards: <span className={classes.shipmentPropertyValue}>{cardsNumber}</span>
                        </Typography>
                        {trackingUrl ? (
                            <MuiLink target="_blank" href={trackingUrl} style={{ textDecoration: 'none' }}>
                                <Typography variant={'caption'} className={classes.shipmentPropertyLabel}>
                                    Tracking #: <span className={classes.shipmentNumber}>{trackingNumber}</span>
                                </Typography>
                            </MuiLink>
                        ) : null}
                    </div>

                    <div className={classes.shipmentRightSide}>
                        <Stack spacing={2}>
                            <VaultShipmentStatusChip
                                color={vaultShipmentStatus || VaultShipmentStatusEnum.PENDING}
                                label={VaultShipmentStatusMap[vaultShipmentStatus || VaultShipmentStatusEnum.PENDING]}
                            />
                        </Stack>
                    </div>
                </div>
            )}
        </>
    );
}
