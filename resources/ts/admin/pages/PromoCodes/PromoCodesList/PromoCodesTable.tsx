import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { upperFirst } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { PromoCodeStatusEnum, PromoCodeStatusMap } from '@shared/constants/PromoCodeStatusEnum';
import { useListAdminPromoCodesQuery } from '@shared/redux/hooks/usePromoCodesQuery';
import { PromoCodesTableRow } from '@admin/pages/PromoCodes/PromoCodesList/PromoCodesTableRow';
import CircularProgress from '@mui/material/CircularProgress';

interface PromoCodesTableProps {
    tabFilter?: PromoCodeStatusEnum;
    all?: boolean;
    search?: string;
}

export function PromoCodesTable({ tabFilter, all, search }: PromoCodesTableProps) {
    const status = useMemo(() => PromoCodeStatusMap[tabFilter || PromoCodeStatusEnum.active], [tabFilter]);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');

    const promoCodes$ = useListAdminPromoCodesQuery({
        params: {
            include: ['couponStatus', 'couponStats', 'couponApplicable'],
            filter: {
                search,
                status: all ? 'all' : tabFilter,
            },
        },
        ...bracketParams(),
    });

    const totals = promoCodes$.pagination?.meta?.total ?? 0;

    useEffect(
        () => {
            if (!promoCodes$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                promoCodes$.search(toApiPropertiesObject({ search }));
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    if (promoCodes$.isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <Box pt={2.5} px={2} pb={2}>
                <Typography variant={'h6'}>
                    {heading} {totals > 0 ? `(${totals})` : null}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Promo Code</TableCell>
                            <TableCell variant={'head'}>Discount</TableCell>
                            <TableCell variant={'head'}>Applies To</TableCell>
                            <TableCell variant={'head'}>Date</TableCell>
                            <TableCell variant={'head'}>Status</TableCell>
                            <TableCell variant={'head'}>Times Used</TableCell>
                            <TableCell variant={'head'}>Total Discounts</TableCell>
                            <TableCell variant={'head'} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {promoCodes$.data?.length > 0 ? (
                            promoCodes$.data.map((promoCode) => (
                                <PromoCodesTableRow
                                    promoCode={promoCode}
                                    key={promoCode.id}
                                    reloadCallback={promoCodes$.search}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell align={'center'} colSpan={9}>
                                    <Box padding={2}>
                                        <Typography variant={'subtitle2'}>
                                            There doesn't seem to be any promo code. Start by creating one
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination {...promoCodes$.paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Grid>
    );
}

export default PromoCodesTable;
