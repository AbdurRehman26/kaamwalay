import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { VaultShipmentEntity } from '@shared/entities/VaultShipmentEntity';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListVaultShipmentsQuery } from '@shared/redux/hooks/useVaultShipmentsQuery';
import { VaultShipmentTableRow } from './VaultShipmentTableRow';
import { Table } from './styles';

const StyledBox = styled(Box)(
    {
        width: '100%',
        backgroundColor: '#f9f9f9',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '40px 20px',
        marginTop: '15px',
    },
    { name: 'StyledBox' },
);

const PaginationFooter = styled('div')(() => ({
    backgroundColor: '#fff',
    position: 'sticky',
    bottom: 0,
}));

interface VaultShipmentsTableProps {
    search?: string;
}

export function VaultShipmentsTable({ search }: VaultShipmentsTableProps) {
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const vaultShipments$ = useListVaultShipmentsQuery({
        params: {
            filter: { search: search },
            perPage: 48,
        },
        ...bracketParams(),
    });

    useEffect(
        () => {
            if (!vaultShipments$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                vaultShipments$.search({ search: search });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    if (vaultShipments$.isLoading || vaultShipments$.isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {vaultShipments$.isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography color={'error'}>Error loading shipments</Typography>
                )}
            </Box>
        );
    }

    const footer$ = (
        <PaginationFooter>
            <Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            {...{
                                ...vaultShipments$.paginationProps,
                                rowsPerPageOptions: [48],
                            }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </PaginationFooter>
    );

    const items$ = vaultShipments$.data?.map((data: VaultShipmentEntity) => (
        <VaultShipmentTableRow
            key={data?.id}
            id={data?.id}
            isSm={isSm}
            shipmentNumber={data?.shipmentNumber}
            cardsNumber={data?.cardsNumber}
            status={data?.status?.id}
            dateCreated={data?.createdAt}
            dateShipped={data?.shippedAt}
            trackingNumber={data?.trackingNumber}
            trackingUrl={data?.trackingUrl}
        />
    ));

    if (items$.length === 0 && search === '') {
        return (
            <StyledBox>
                <Grid container alignItems={'center'} justifyContent={'center'} rowSpacing={1}>
                    <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                        <Inventory2TwoToneIcon />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle1'} fontWeight={500} textAlign={'center'} fontSize={16}>
                            No Shipments
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                            You have no shipments yet.
                            <br />
                            Click NEW SHIPMENT to get started.
                        </Typography>
                    </Grid>
                </Grid>
            </StyledBox>
        );
    }

    if (items$.length === 0 && search !== '') {
        return (
            <Typography variant={'subtitle2'} marginTop={'10px'}>
                We didn't find anything for "{search}". Try searching for something else
            </Typography>
        );
    }

    return (
        <Box mb={7} width={'100%'}>
            {isSm ? (
                <>
                    {items$}
                    <TableContainer>
                        <Table>{footer$}</Table>
                    </TableContainer>
                </>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell variant={'head'}>Shipment #</TableCell>
                                    <TableCell variant={'head'}>Date Created</TableCell>
                                    <TableCell variant={'head'}>Date Shipped</TableCell>
                                    <TableCell variant={'head'}>Status</TableCell>
                                    <TableCell variant={'head'}># Cards</TableCell>
                                    <TableCell variant={'head'}>Tracking Number</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>{items$}</TableBody>
                        </Table>
                    </TableContainer>
                    {vaultShipments$.pagination.meta.total > vaultShipments$.pagination.meta.perPage ? footer$ : null}
                </>
            )}
        </Box>
    );
}
