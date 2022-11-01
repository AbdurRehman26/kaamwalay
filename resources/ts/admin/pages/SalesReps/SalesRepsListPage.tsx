import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikProps } from 'formik';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PageSelector } from '@shared/components/PageSelector';
import { SalesRepStatusChip } from '@shared/components/SalesRepStatusChip';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { SalesRapStatusEnum } from '@shared/constants/SalesRapStatusEnum';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminSalesMenQuery } from '@shared/redux/hooks/useAdminSalesMenQuery';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import { SalesRepsPageHeader } from './SalesRepsPageHeader';

type InitialValues = {
    status: number;
    search: string;
    dateRangeStart: DateLike;
    dateRangeEnd: DateLike;
};

const SalesMenStatus = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
];

export function SalesRepsListPage() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery }] = useLocationQuery<InitialValues>();
    const [sortFilter, setSortFilter] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [status, setStatus] = useState({ label: '', value: 0 });
    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

    const initialValues = useMemo<InitialValues>(
        () => ({
            search: query.search ?? '',
            status: query.status ?? '',
            dateRangeStart: query.dateRangeStart ?? '',
            dateRangeEnd: query.dateRangeEnd ?? '',
        }),
        [query.search, query.status, query.dateRangeStart, query.dateRangeEnd],
    );

    const getFilters = (values: InitialValues) => ({
        search: values.search,
        status: values.status,
        dateRangeStart: values.dateRangeStart,
        dateRangeEnd: values.dateRangeEnd,
    });

    const salesReps = useAdminSalesMenQuery({
        params: {
            filter: getFilters(query),
            sort: sortFilter ? 'name' : '-name',
            perPage: 48,
        },
    });
    const handleStatus = useCallback(async (values, status) => {
        values = { ...values, status: status.value };
        setStatus({ value: status.value, label: status.label });
        handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const joinFilterValues = (values: any[], separator = ',') =>
        values
            .map((value) => `${value ?? ''}`.trim())
            .filter(Boolean)
            .join(separator);

    const dateRangeFilter = (start: DateLike, end: DateLike, separator = ',', format = 'YYYY-MM-DD') =>
        joinFilterValues([formatDate(start, format), formatDate(end, format)], separator);

    const handleClearDateRange = useCallback(async () => {
        formikRef.current?.setFieldValue('dateRangeStart', '');
        formikRef.current?.setFieldValue('dateRangeEnd', '');
        delQuery('dateRangeStart', 'dateRangeEnd');

        await salesReps.searchSortedWithPagination(
            { sort: sortFilter ? 'name' : '-name' },
            getFilters({
                ...formikRef.current!.values,
                dateRangeStart: '',
                dateRangeEnd: '',
            }),
            1,
        );
    }, [delQuery, sortFilter, salesReps]);

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
                signedUpStart: formatDate(values.signedUpStart, 'YYYY-MM-DD'),
                signedUpEnd: formatDate(values.signedUpEnd, 'YYYY-MM-DD'),
            });

            await salesReps.searchSortedWithPagination({ sort: sortFilter }, getFilters(values), 1);

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [setQuery, sortFilter, salesReps],
    );

    const handleSort = (value: boolean) => {
        setSortFilter(value);
    };

    const handleSearch = useCallback(
        async (search: string) => {
            if (search) {
                setQuery({ search });
            } else {
                delQuery('search');
            }

            formikRef.current?.setFieldValue('search', search);
            await salesReps.search(
                getFilters({
                    ...formikRef.current!?.values,
                    search,
                }),
            );
        },
        [salesReps, delQuery, setQuery],
    );

    const handleExportData = useCallback(async () => {
        try {
            setIsExporting(true);
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.SalesRep,
                sort: { sort: sortFilter },
                filter: getFilters({
                    ...formikRef.current!.values,
                }),
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-salereps.xlsx`);
            setIsExporting(false);
        } catch (e: any) {
            notifications.exception(e);
            setIsExporting(false);
        }
    }, [dataExportRepository, sortFilter, notifications]);

    const handleClearStatus = useCallback(async () => {
        formikRef.current?.setFieldValue('status', '');
        delQuery('status');
        setStatus({ value: 0, label: '' });
        await salesReps.searchSortedWithPagination(
            { sort: sortFilter ? 'name' : '-name' },
            getFilters({
                ...formikRef.current!.values,
                status: 0,
            }),
            1,
        );
    }, [delQuery, sortFilter, salesReps]);

    return (
        <>
            <SalesRepsPageHeader title="Sales Reps" value={initialValues.search} searchField onSearch={handleSearch} />
            <Grid container p={2.5} alignItems={'center'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'subtitle1'}>{salesReps?.pagination?.meta?.total} Result(s)</Typography>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formikRef}>
                        {({ values }) => (
                            <Grid item xs ml={2}>
                                <PageSelector
                                    label={'Date Range'}
                                    value={dateRangeFilter(
                                        values.dateRangeStart,
                                        values.dateRangeEnd,
                                        ' - ',
                                        'MM/DD/YY',
                                    )}
                                    onClear={handleClearDateRange}
                                >
                                    <Grid container component={Form} direction={'column'}>
                                        <Grid container alignItems={'center'}>
                                            <Grid item xs>
                                                <FormikDesktopDatePicker
                                                    name={'dateRangeStart'}
                                                    label={'Start Date'}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                xs
                                                container
                                                justifyContent={'center'}
                                                maxWidth={'28px !important'}
                                            >
                                                <Typography variant={'body2'}>-</Typography>
                                            </Grid>
                                            <Grid item xs>
                                                <FormikDesktopDatePicker
                                                    name={'dateRangeEnd'}
                                                    label={'End Date'}
                                                    minDate={values.dateRangeStart}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justifyContent={'flex-end'} mt={2.5}>
                                            <FormikButton variant={'contained'} color={'primary'}>
                                                Apply
                                            </FormikButton>
                                        </Grid>
                                    </Grid>
                                </PageSelector>
                                <PageSelector label={'Status'} value={status.label} onClear={handleClearStatus}>
                                    {SalesMenStatus?.map((item: any) => {
                                        return (
                                            <Grid key={item.value}>
                                                <MenuItem
                                                    onClick={() => handleStatus(values, item)}
                                                    key={item.value}
                                                    value={item.label}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            </Grid>
                                        );
                                    })}
                                </PageSelector>
                            </Grid>
                        )}
                    </Formik>
                </Grid>
                <Grid item xs container justifyContent={'flex-end'} maxWidth={'240px !important'}>
                    <LoadingButton
                        variant={'outlined'}
                        color={'primary'}
                        sx={{ borderRadius: 20, padding: '7px 24px' }}
                        onClick={handleExportData}
                        loading={isExporting}
                        disabled={isExporting}
                    >
                        Export List
                    </LoadingButton>
                </Grid>
            </Grid>
            <Grid container>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="left">
                                    Sales Rep
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Customers</TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Orders</TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Commission Earned</TableCell>
                                {/* <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Commission Paid</TableCell> */}
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>Status</TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }}>
                                    <TableSortLabel
                                        sx={{
                                            color: '#0000008A',
                                        }}
                                        onClick={() => handleSort(!sortFilter)}
                                        direction={!sortFilter ? 'desc' : 'asc'}
                                        active={true}
                                    ></TableSortLabel>{' '}
                                    Sales
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesReps.data.map((salesRep: SalesRepEntity) => (
                                <TableRow key={salesRep.id}>
                                    <TableCell variant={'body'}>
                                        <Grid container>
                                            <Avatar src={salesRep.profileImage ?? ''}>{salesRep.getInitials()}</Avatar>
                                            <Grid item xs container direction={'column'} pl={2}>
                                                <Typography variant={'body2'}>{salesRep.fullName}</Typography>
                                                <Typography variant={'caption'} color={'textSecondary'}>
                                                    {salesRep.email}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell variant={'body'}>{salesRep.customers ?? '-'}</TableCell>
                                    <TableCell variant={'body'}>{salesRep.orders ?? '-'}</TableCell>
                                    <TableCell variant={'body'}>{salesRep.commissionEarned ?? '-'}</TableCell>
                                    {/* <TableCell variant={'body'}>{salesRep.commissionPaid}</TableCell> */}
                                    <TableCell variant={'body'}>
                                        {salesRep.status !== null ? (
                                            <SalesRepStatusChip
                                                color={salesRep.status}
                                                label={SalesRapStatusEnum[salesRep.status]}
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell variant={'body'} align={'center'}>
                                        {salesRep.sales || 0}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination {...salesReps.paginationProps} />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Grid>
        </>
    );
}

export default SalesRepsListPage;
