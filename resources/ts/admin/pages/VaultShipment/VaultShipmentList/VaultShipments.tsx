import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { OptionsMenu, OptionsMenuItem } from '@shared/components/OptionsMenu';
import { useRepository } from '@shared/hooks/useRepository';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { VaultShipmentRepository } from '@shared/repositories/Admin/VaultShipmentRepository';
import { StatusChip } from './StatusChip';

enum RowOption {
    MarkShipped,
}

export function VaultShipments() {
    const vaultShipmentRepository = useRepository(VaultShipmentRepository);
    const [status, setStatus] = useState('pending');

    const shipments$ = useQuery('admin:shipments/list', () => vaultShipmentRepository.list());

    const handleOption = useCallback((action: RowOption, value?: any) => {
        switch (action) {
            case RowOption.MarkShipped:
                console.log({ action, value });
                break;
        }
    }, []);

    console.log(shipments$);

    if (shipments$.isLoading) {
        return (
            <Grid container alignItems={'center'} justifyContent={'center'} p={5}>
                <CircularProgress />
            </Grid>
        );
    }

    const shipments = shipments$.data?.data;
    if (!shipments || !shipments.length) {
        return (
            <Grid container alignItems={'center'} justifyContent={'center'} p={5}>
                <Typography>No shipments found</Typography>
            </Grid>
        );
    }

    return (
        <Stack p={2.5}>
            <Grid container mb={2.5}>
                <Typography variant={'h5'}>Shipments</Typography>
            </Grid>
            <Grid container alignItems={'center'}>
                <StatusChip
                    status={'pending'}
                    active={status === 'pending'}
                    label={'Pending (12)'}
                    onCheck={setStatus}
                />
                <StatusChip status={'shipped'} active={status === 'shipped'} label={'Shipped'} onCheck={setStatus} />
            </Grid>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Shipment #</TableCell>
                            <TableCell variant={'head'}>Date Created</TableCell>
                            <TableCell variant={'head'}>Date Shipped</TableCell>
                            <TableCell variant={'head'}>Customer</TableCell>
                            <TableCell variant={'head'}>Cards</TableCell>
                            <TableCell variant={'head'}>Status</TableCell>
                            <TableCell variant={'head'}>Tracking Number</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shipments.map((shipment) => (
                            <TableRow key={shipment.id}>
                                <TableCell variant={'body'}>
                                    <MuiLink component={Link} to={`/vault-storage/shipments/${shipment.id}`}>
                                        {shipment.shipmentNumber}
                                    </MuiLink>
                                </TableCell>
                                <TableCell variant={'body'}>{formatDate(shipment.createdAt, 'll') || '-'}</TableCell>
                                <TableCell variant={'body'}>{formatDate(shipment.shippedAt, 'll') || '-'}</TableCell>
                                <TableCell variant={'body'}>{shipment.customer?.customerNumber || '-'}</TableCell>
                                <TableCell variant={'body'}>{shipment.cardsNumber || 0}</TableCell>
                                <TableCell variant={'body'}>{shipment.vaultShipmentStatus.name || '-'}</TableCell>
                                <TableCell variant={'body'}>
                                    <MuiLink href={shipment.trackingUrl} target={'_blank'} rel={'noopener noreferrer'}>
                                        {shipment.trackingNumber}
                                    </MuiLink>
                                </TableCell>
                                <TableCell align={'right'}>
                                    <OptionsMenu onClick={handleOption}>
                                        <OptionsMenuItem action={RowOption.MarkShipped} value={shipment}>
                                            Mark Shipped
                                        </OptionsMenuItem>
                                    </OptionsMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {/* <TableFooter> */}
                    {/* <TableRow> */}
                    {/* <TablePagination /> */}
                    {/* </TableRow> */}
                    {/* </TableFooter> */}
                </Table>
            </TableContainer>
        </Stack>
    );
}
