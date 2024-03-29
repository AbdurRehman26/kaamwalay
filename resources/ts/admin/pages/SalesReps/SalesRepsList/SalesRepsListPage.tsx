import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
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
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageSelector } from '@shared/components/PageSelector';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminSalesRepsQuery } from '@shared/redux/hooks/useAdminSalesRepsQuery';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import { SalesRepUpdateDialog } from '@admin/pages/SalesReps/SalesRepUpdateDialog';
import { SalesRepsTableRow } from '@admin/pages/SalesReps/SalesRepsList/SalesRepsTableRow';
import { SalesRepsPageHeader } from './SalesRepsPageHeader';

type InitialValues = {
    isActive: number;
    search: string;
    signedUpStart: DateLike;
    signedUpEnd: DateLike;
};

const SalesMenStatus = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
];

export function SalesRepsListPage() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [sortFilter, setSortFilter] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [status, setStatus] = useState({ label: '', value: 0 });
    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();
    const [updateDialog, setUpdateDialog] = useState(false);

    const initialValues = useMemo<InitialValues>(
        () => ({
            search: query.search ?? '',
            isActive: query.isActive ?? '',
            signedUpStart: query.signedUpStart ? moment(query.signedUpStart) : '',
            signedUpEnd: query.signedUpEnd ? moment(query.signedUpEnd) : '',
        }),
        [query.search, query.isActive, query.signedUpStart, query.signedUpEnd],
    );

    const joinFilterValues = (values: any[], separator = ',') =>
        values
            .map((value) => `${value ?? ''}`.trim())
            .filter(Boolean)
            .join(separator);

    const dateRangeFilter = (start: DateLike, end: DateLike, separator = ',', format = 'YYYY-MM-DD') =>
        joinFilterValues([formatDate(start, format), formatDate(end, format)], separator);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getFilters = (values: InitialValues) => ({
        search: values.search,
        isActive: values.isActive,
        signedUpBetween: dateRangeFilter(values.signedUpStart, values.signedUpEnd),
    });

    const salesReps = useAdminSalesRepsQuery({
        params: {
            filter: getFilters(query),
            sort: sortFilter ? 'sales' : '-sales',
            perPage: 48,
        },
        ...bracketParams(),
    });
    const handleStatus = useCallback(async (values, isActive) => {
        values = { ...values, isActive: isActive.value };
        setStatus({ value: isActive.value, label: isActive.label });
        handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClearDateRange = useCallback(async () => {
        formikRef.current?.setFieldValue('signedUpStart', '');
        formikRef.current?.setFieldValue('signedUpEnd', '');
        delQuery('signedUpStart', 'signedUpEnd');

        await salesReps.searchSortedWithPagination(
            { sort: sortFilter ? 'sales' : '-sales' },
            getFilters({
                ...formikRef.current!.values,
                signedUpStart: '',
                signedUpEnd: '',
            }),
            1,
        );
    }, [delQuery, sortFilter, salesReps, getFilters]);

    useEffect(
        () => {
            if (!salesReps.isLoading) {
                salesReps.sort({ sort: sortFilter ? 'sales' : '-sales' });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
                signedUpStart: formatDate(values.signedUpStart, 'YYYY-MM-DD'),
                signedUpEnd: formatDate(values.signedUpEnd, 'YYYY-MM-DD'),
            });

            await salesReps.searchSortedWithPagination(
                { sort: sortFilter ? 'sales' : '-sales' },
                getFilters(values),
                1,
            );

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [setQuery, sortFilter, salesReps, getFilters],
    );

    const handleSort = (value: boolean) => {
        setSortFilter(value);
    };

    const handleSearch = useCallback(
        async (search: string) => {
            if (search) {
                addQuery({ search });
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
        [addQuery, salesReps, delQuery, getFilters],
    );

    const handleExportData = useCallback(async () => {
        try {
            setIsExporting(true);
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.Salesman,
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
    }, [dataExportRepository, sortFilter, notifications, getFilters]);

    const handleClearStatus = useCallback(async () => {
        formikRef.current?.setFieldValue('isActive', '');
        delQuery('isActive');
        setStatus({ value: 0, label: '' });
        await salesReps.searchSortedWithPagination(
            { sort: sortFilter ? 'sales' : '-sales' },
            getFilters({
                ...formikRef.current!.values,
            }),
            1,
        );
    }, [delQuery, sortFilter, salesReps, getFilters]);

    const handleUpdateDialogClose = useCallback(() => {
        setUpdateDialog(false);
    }, []);

    const handleUpdate = useCallback(() => {
        window.location.reload();
        setUpdateDialog(false);
    }, []);

    if (salesReps.isLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

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
                                    value={dateRangeFilter(values.signedUpStart, values.signedUpEnd, ' - ', 'MM/DD/YY')}
                                    onClear={handleClearDateRange}
                                >
                                    <Grid container component={Form} direction={'column'}>
                                        <Grid container alignItems={'center'}>
                                            <Grid item xs>
                                                <FormikDesktopDatePicker
                                                    name={'signedUpStart'}
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
                                                    name={'signedUpEnd'}
                                                    label={'End Date'}
                                                    minDate={values.signedUpStart}
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
                        disabled={true}
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
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center">
                                    Customers
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center">
                                    Orders
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center">
                                    Cards
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center">
                                    Commission Earned
                                </TableCell>
                                {/* <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center" >Commission Paid</TableCell> */}
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center">
                                    Status
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', fontWeight: '500' }} align="center">
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
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesReps.data.map((salesRep: SalesRepEntity) => (
                                <SalesRepsTableRow salesRep={salesRep} setUpdateDialog={setUpdateDialog} />
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination {...salesReps.paginationProps} />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
                <SalesRepUpdateDialog open={updateDialog} onSubmit={handleUpdate} onClose={handleUpdateDialogClose} />
            </Grid>
        </>
    );
}

export default SalesRepsListPage;
