import Check from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { PromoCodeStatusEnum, PromoCodeStatusMap } from '@shared/constants/PromoCodeStatusEnum';
import { useAuth } from '@shared/hooks/useAuth';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { toApiPropertiesObject } from '@shared/lib/utils/toApiPropertiesObject';
import { useListSalesmanPromoCodesQuery } from '@shared/redux/hooks/usePromoCodesQuery';
import { PromoCodesTableRow } from './PromoCodesTableRow';

const useStyles = makeStyles(() => ({
    Chip: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        borderRadius: '24px',
        padding: '20px 10px',
        marginRight: '20px',
    },
}));

interface PromoCodesTableProps {
    tabFilter?: PromoCodeStatusEnum;
    all?: boolean;
    search?: string;
}

export function PromoCodesTable({ tabFilter, all, search }: PromoCodesTableProps) {
    const status = useMemo(() => PromoCodeStatusMap[tabFilter || PromoCodeStatusEnum.active], [tabFilter]);
    const heading = all ? 'All' : upperFirst(status?.label ?? '');
    const [createdBy, setCreatedBy] = useState(null);
    const [notCreatedBy, setNotCreatedBy] = useState(null);
    const classes = useStyles({ value: createdBy ?? notCreatedBy });
    const { user } = useAuth();

    const promoCodes$ = useListSalesmanPromoCodesQuery({
        params: {
            include: ['couponStatus', 'couponStats', 'couponApplicable', 'createdBy'],
            sort: null,
            filter: {
                search,
                status: all ? 'all' : tabFilter,
                createdBy,
                notCreatedBy,
            },
        },
        ...bracketParams(),
    });
    const totals = promoCodes$.pagination?.meta?.total ?? 0;

    const handleCreatedByMeFilter = useCallback(
        async (createdById) => {
            if (createdById === createdBy) {
                setCreatedBy(null);
                setNotCreatedBy(null);
            } else {
                setCreatedBy(createdById);
                setNotCreatedBy(null);
            }

            promoCodes$.searchSortedWithPagination(
                { sort: null },
                toApiPropertiesObject({
                    search,
                    createdBy: createdById === createdBy ? null : createdById,
                    notCreatedBy: null,
                }),
                1,
            );
        },
        [promoCodes$, search, createdBy, setCreatedBy],
    );
    const handleCreatedByOthersFilter = useCallback(
        async (notCreatedById) => {
            if (notCreatedById === notCreatedBy) {
                setCreatedBy(null);
                setNotCreatedBy(null);
            } else {
                setCreatedBy(null);
                setNotCreatedBy(notCreatedById);
            }

            promoCodes$.searchSortedWithPagination(
                { sort: null },
                toApiPropertiesObject({
                    search,
                    createdBy: null,
                    notCreatedBy: notCreatedById === notCreatedBy ? null : notCreatedById,
                }),
                1,
            );
        },
        [promoCodes$, search, notCreatedBy, setNotCreatedBy],
    );

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
                <Grid pt={2.5}>
                    <Chip
                        label="Created By You"
                        variant="outlined"
                        icon={
                            <Check
                                sx={{
                                    display: !createdBy ? 'none' : 'block',
                                    color: 'rgb(32, 191, 184)!important',
                                    fontWeight: 500,
                                }}
                            />
                        }
                        sx={{
                            border:
                                createdBy === null ? '1px solid rgba(0, 0, 0, 0.18)' : '1px solid rgb(32, 191, 184)',
                            color: createdBy === null ? 'rgba(0, 0, 0, 0.54)' : 'rgb(32, 191, 184)',
                        }}
                        className={classes.Chip}
                        onClick={() => handleCreatedByMeFilter(user.id)}
                    />
                    <Chip
                        label="Created By Others"
                        variant="outlined"
                        icon={
                            <Check
                                sx={{
                                    display: !notCreatedBy ? 'none' : 'block',
                                    color: 'rgb(32, 191, 184)!important',
                                    fontWeight: 500,
                                }}
                            />
                        }
                        className={classes.Chip}
                        sx={{
                            border:
                                notCreatedBy === null ? '1px solid rgba(0, 0, 0, 0.18)' : '1px solid rgb(32, 191, 184)',
                            color: notCreatedBy === null ? 'rgba(0, 0, 0, 0.54)' : 'rgb(32, 191, 184)',
                        }}
                        onClick={() => handleCreatedByOthersFilter(user.id)}
                    />
                </Grid>
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
                            <TableCell variant={'head'}>Total Cards</TableCell>
                            <TableCell variant={'head'}>Total Discounts</TableCell>
                            <TableCell variant={'head'}>Created By</TableCell>
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
