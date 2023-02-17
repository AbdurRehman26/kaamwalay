import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSelector } from '@shared/components/PageSelector';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { FormikTextField } from '@shared/components/fields/FormikTextField';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { TableSortType } from '@shared/constants/TableSortType';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminReferrersQuery } from '@shared/redux/hooks/useReferrersQuery';
import { getSalesReps } from '@shared/redux/slices/adminSalesRepSlice';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import { CustomerAddDialog } from '@admin/components/Customer/CustomerAddDialog';
import { ListPageHeader, ListPageSelector } from '@admin/components/ListPage';
import { useAppDispatch } from '@admin/redux/hooks';
import { ReferrerTableRow } from './ReferrerTableRow';

type InitialValues = {
    minSubmissions: string;
    maxSubmissions: string;
    signedUpStart: DateLike;
    signedUpEnd: DateLike;
    search: string;
    salesmanId: string;
    status?: string;
};

const StatusOptions = [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
];

const headings: EnhancedTableHeadCell[] = [
    {
        id: 'full_name',
        numeric: false,
        disablePadding: false,
        label: 'Name / ID',
        align: 'left',
        sortable: true,
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email/Phone',
        align: 'left',
        sortable: true,
    },
    {
        id: 'users.created_at',
        numeric: false,
        disablePadding: false,
        label: 'Signed Up',
        align: 'left',
        sortable: true,
    },
    {
        id: 'submissions',
        numeric: true,
        disablePadding: false,
        label: 'Submissions',
        align: 'right',
        sortable: false,
    },
    {
        id: 'cards',
        numeric: true,
        disablePadding: false,
        label: 'Cards',
        align: 'right',
        sortable: false,
    },
    {
        id: 'sign_ups',
        numeric: true,
        disablePadding: false,
        label: 'Sign Ups',
        align: 'right',
        sortable: false,
    },
    {
        id: 'is_referral_active',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        align: 'left',
        sortable: false,
    },
    {
        id: 'sales',
        numeric: true,
        disablePadding: false,
        label: 'Sales',
        align: 'right',
        sortable: false,
    },
    {
        id: 'commission',
        numeric: true,
        disablePadding: false,
        label: 'Commission',
        align: 'right',
        sortable: false,
    },
];

const joinFilterValues = (values: any[], separator = ',') =>
    values
        .map((value) => `${value ?? ''}`.trim())
        .filter(Boolean)
        .join(separator);

const signedUpFilter = (start: DateLike, end: DateLike, separator = ',', format = 'YYYY-MM-DD') =>
    joinFilterValues([formatDate(start, format), formatDate(end, format)], separator);

const submissionsFilter = (min: number | string, max: number | string, separator = ',') =>
    joinFilterValues([min, max], separator);

const getFilters = (values: InitialValues) => ({
    search: values.search,
    salesmanId: values.salesmanId,
    referrerSignedUpBetween: signedUpFilter(values.signedUpStart, values.signedUpEnd),
    referrerSubmissions: submissionsFilter(values.minSubmissions, values.maxSubmissions),
    isReferralActive: values.status,
});

const useStyles = makeStyles(
    (theme) => ({
        newCustomerBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
    }),
    {
        name: 'ListPageHeader',
    },
);

export function ReferrersList() {
    const classes = useStyles();
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('users.created_at');
    const [sortFilter, setSortFilter] = useState('-users.created_at');
    const [isExporting, setIsExporting] = useState(false);
    const dispatch = useAppDispatch();
    const [salesReps, setSalesRep] = useState<SalesRepEntity[]>([]);
    const [salesRepFilter, setSalesRepFilter] = useState({ salesmanName: '', salesmanId: '' });
    const [statusFilter, setStatusFilter] = useState({
        label: '',
        value: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const data = await dispatch(getSalesReps());
            setSalesRep(data.payload.data);

            const status = StatusOptions?.filter((item) => item.value === query.status);
            setStatusFilter({ value: status[0]?.value, label: status[0]?.label });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

    const redirectToCustomerProfile = useCallback(
        (customer: CustomerEntity) => {
            navigate(`/customers/${customer.id}/view`);
        },
        [navigate],
    );

    const initialValues = useMemo<InitialValues>(
        () => ({
            minSubmissions: query.minSubmissions ?? '',
            maxSubmissions: query.maxSubmissions ?? '',
            signedUpStart: query.signedUpStart ? moment(query.signedUpStart) : '',
            signedUpEnd: query.signedUpEnd ? moment(query.signedUpEnd) : '',
            search: query.search ?? '',
            salesmanId: query.salesmanId ?? '',
            status: query.status ?? '',
        }),
        [
            query.minSubmissions,
            query.maxSubmissions,
            query.signedUpStart,
            query.signedUpEnd,
            query.search,
            query.salesmanId,
            query.status,
        ],
    );

    const customers = useAdminReferrersQuery({
        params: {
            include: ['salesman'],
            sort: sortFilter,
            filter: getFilters(query),
        },

        ...bracketParams(),
    });

    const handleClearSubmissions = useCallback(async () => {
        formikRef.current?.setFieldValue('minSubmissions', '');
        formikRef.current?.setFieldValue('maxSubmissions', '');
        delQuery('minSubmissions', 'maxSubmissions');

        await customers.searchSortedWithPagination(
            { sort: sortFilter },
            getFilters({
                ...formikRef.current!.values,
                minSubmissions: '',
                maxSubmissions: '',
                salesmanId: salesRepFilter.salesmanId,
                status: statusFilter.value,
            }),
            1,
        );
    }, [delQuery, customers, sortFilter, salesRepFilter.salesmanId, statusFilter.value]);

    const handleClearSignUp = useCallback(async () => {
        formikRef.current?.setFieldValue('signedUpStart', '');
        formikRef.current?.setFieldValue('signedUpEnd', '');
        delQuery('signedUpStart', 'signedUpEnd');

        await customers.searchSortedWithPagination(
            { sort: sortFilter },
            getFilters({
                ...formikRef.current!.values,
                signedUpStart: '',
                signedUpEnd: '',
                salesmanId: salesRepFilter.salesmanId,
                status: statusFilter.value,
            }),
            1,
        );
    }, [delQuery, customers, sortFilter, salesRepFilter.salesmanId, statusFilter.value]);

    const handleSearch = useCallback(
        async (search: string) => {
            if (search) {
                addQuery({ search });
            } else {
                delQuery('search');
            }

            formikRef.current?.setFieldValue('search', search);
            await customers.searchSortedWithPagination(
                { sort: sortFilter },
                getFilters({
                    ...formikRef.current!.values,
                    status: statusFilter.value,
                    salesmanId: salesRepFilter.salesmanId,
                    search,
                }),
                1,
            );
        },
        [addQuery, customers, delQuery, salesRepFilter.salesmanId, sortFilter, statusFilter],
    );

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
                signedUpStart: formatDate(values.signedUpStart, 'YYYY-MM-DD'),
                signedUpEnd: formatDate(values.signedUpEnd, 'YYYY-MM-DD'),
            });

            await customers.searchSortedWithPagination({ sort: sortFilter }, getFilters(values), 1);

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [customers, setQuery, sortFilter],
    );

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const calculateSortFilterValue = useCallback((order, orderBy) => {
        return (order === 'desc' ? '-' : '') + orderBy;
    }, []);

    useEffect(() => {
        if (!customers.isLoading) {
            if (sortFilter !== calculateSortFilterValue(order, orderBy)) {
                setSortFilter(calculateSortFilterValue(order, orderBy));

                formikRef.current?.submitForm();
            }
        }
    }, [calculateSortFilterValue, customers.isLoading, order, orderBy, sortFilter]);

    const handleExportData = useCallback(async () => {
        try {
            setIsExporting(true);
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.User,
                sort: { sort: sortFilter },
                filter: getFilters({
                    ...formikRef.current!.values,
                }),
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-customers.xlsx`);
            setIsExporting(false);
        } catch (e: any) {
            notifications.exception(e);
            setIsExporting(false);
        }
    }, [dataExportRepository, notifications, sortFilter]);

    const handleSalesRep = useCallback(
        async (values, saleRep) => {
            values = {
                ...values,
                salesmanId: saleRep.id,
                status: statusFilter.value,
            };
            setSalesRepFilter({ salesmanName: saleRep.fullName, salesmanId: saleRep.id });
            handleSubmit(values);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [handleSubmit, statusFilter.value],
    );

    const handleClearSalesRep = useCallback(async () => {
        formikRef.current?.setFieldValue('salesmanId', '');
        delQuery('salesmanId');
        setSalesRepFilter({ salesmanName: '', salesmanId: '' });
        await customers.search(
            getFilters({
                ...formikRef.current!.values,
                salesmanId: '',
                status: statusFilter.value,
            }),
        );
    }, [customers, statusFilter.value, delQuery]);

    const handleClearStatus = useCallback(async () => {
        formikRef.current?.setFieldValue('status', '');
        delQuery('status');
        setStatusFilter({ value: '', label: '' });
        await customers.searchSortedWithPagination(
            { sort: sortFilter },
            getFilters({
                ...formikRef.current!.values,
                status: '',
                salesmanId: salesRepFilter.salesmanId,
            }),
            1,
        );
    }, [delQuery, customers, sortFilter, salesRepFilter.salesmanId]);

    const handleStatus = useCallback(
        async (values, status) => {
            values = {
                ...values,
                status: status.value,
                salesmanId: salesRepFilter.salesmanId,
            };
            setStatusFilter({
                value: status.value,
                label: status.label,
            });
            await handleSubmit(values);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [salesRepFilter.salesmanId, handleSubmit],
    );

    const headerActions = (
        <Button
            onClick={() => setAddCustomerDialog(true)}
            variant={'contained'}
            color={'primary'}
            className={classes.newCustomerBtn}
        >
            Add Customer
        </Button>
    );

    return (
        <Grid container>
            <ListPageHeader
                searchField
                title={'Referrers'}
                value={initialValues.search}
                onSearch={handleSearch}
                headerActions={headerActions}
            />
            <CustomerAddDialog
                customerAdded={redirectToCustomerProfile}
                open={addCustomerDialog}
                onClose={() => setAddCustomerDialog(!addCustomerDialog)}
            />
            <Grid container p={2.5} alignItems={'center'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'subtitle1'}>{customers.pagination.meta.total} Result(s)</Typography>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formikRef}>
                        {({ values }) => (
                            <Grid item xs ml={2}>
                                <ListPageSelector
                                    label={'Submissions'}
                                    value={submissionsFilter(values.minSubmissions, values.maxSubmissions, ' - ')}
                                    onClear={handleClearSubmissions}
                                >
                                    <Grid container component={Form} direction={'column'}>
                                        <Grid container alignItems={'center'}>
                                            <Grid item xs>
                                                <FormikTextField
                                                    type={'number'}
                                                    name={'minSubmissions'}
                                                    label={'Min. Submissions'}
                                                    hiddenLabel
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
                                                <FormikTextField
                                                    type={'number'}
                                                    name={'maxSubmissions'}
                                                    label={'Max. Submissions'}
                                                    hiddenLabel
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
                                </ListPageSelector>

                                <ListPageSelector
                                    label={'Sign Up Date'}
                                    value={signedUpFilter(values.signedUpStart, values.signedUpEnd, ' - ', 'MM/DD/YY')}
                                    onClear={handleClearSignUp}
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
                                </ListPageSelector>
                                <ListPageSelector
                                    label={'Sales Rep'}
                                    value={salesRepFilter.salesmanName}
                                    onClear={handleClearSalesRep}
                                >
                                    {salesReps?.map((saleRep: any) => {
                                        return (
                                            <Grid>
                                                <MenuItem
                                                    onClick={() => handleSalesRep(values, saleRep)}
                                                    key={saleRep.id}
                                                    value={saleRep.id}
                                                >
                                                    {saleRep.fullName ?? ''}
                                                </MenuItem>
                                            </Grid>
                                        );
                                    })}
                                </ListPageSelector>
                                <PageSelector label={'Status'} value={statusFilter.label} onClear={handleClearStatus}>
                                    {StatusOptions?.map((item: any) => {
                                        return (
                                            <Grid key={item.value}>
                                                <MenuItem
                                                    onClick={() => handleStatus(values, item)}
                                                    key={item.value}
                                                    value={item.value}
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
                        disabled={isExporting || true}
                    >
                        Export List
                    </LoadingButton>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <EnhancedTableHead
                        onRequestSort={handleRequestSort}
                        order={order}
                        orderBy={orderBy}
                        headCells={headings}
                    />

                    <TableBody>
                        {customers.data.map((customer) => (
                            <ReferrerTableRow customer={customer} salesReps={salesReps} />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination {...customers.paginationProps} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Grid>
    );
}

export default ReferrersList;
