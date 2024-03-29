import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
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
import EditCustomerDetailsDialog from '@shared/components/EditCustomerDetailsDialog';
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
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminCustomersListQuery } from '@shared/redux/hooks/useAdminCustomersQuery';
import { getSalesReps } from '@shared/redux/slices/adminSalesRepSlice';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import { CustomerAddDialog } from '@admin/components/Customer/CustomerAddDialog';
import { useAppDispatch } from '@admin/redux/hooks';
import { ListPageHeader, ListPageSelector } from '../../../components/ListPage';
import { CustomerTableRow } from './CustomerTableRow';

type InitialValues = {
    minSubmissions: string;
    maxSubmissions: string;
    signedUpStart: DateLike;
    signedUpEnd: DateLike;
    search: string;
    salesmanId: string;
    promotionalSubscribers?: string;
    referredBy?: boolean | null;
};

const PromotionalSubscribersStatus = [
    { label: 'Enabled', value: 'true' },
    { label: 'Disabled', value: 'false' },
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
        id: 'created_at',
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
        align: 'center',
        sortable: true,
    },
    {
        id: 'cards',
        numeric: true,
        disablePadding: false,
        label: 'Cards',
        align: 'center',
        sortable: true,
    },
    {
        id: 'owners',
        numeric: true,
        disablePadding: false,
        label: 'Owners',
        align: 'left',
        sortable: false,
    },
    {
        id: 'referrer',
        numeric: true,
        disablePadding: false,
        label: 'Referrer',
        align: 'left',
        sortable: false,
    },
    {
        id: 'customer_type',
        numeric: true,
        disablePadding: false,
        label: 'Customer Type',
        align: 'right',
        sortable: false,
    },
    {
        id: 'wallet',
        numeric: true,
        disablePadding: false,
        label: 'Wallet Balance',
        align: 'right',
        sortable: true,
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
    signedUpBetween: signedUpFilter(values.signedUpStart, values.signedUpEnd),
    submissions: submissionsFilter(values.minSubmissions, values.maxSubmissions),
    promotionalSubscribers: values.promotionalSubscribers,
    referredBy: values.referredBy,
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

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomersListPage
 * @date: 23.12.2021
 * @time: 21:39
 */
export function CustomersList() {
    const classes = useStyles();
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');
    const [isExporting, setIsExporting] = useState(false);
    const dispatch = useAppDispatch();
    const [salesReps, setSalesRep] = useState<SalesRepEntity[]>([]);
    const [salesRepFilter, setSalesRepFilter] = useState({ salesmanName: '', salesmanId: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const referrerDefaultState = { label: '', value: 0 };
    const [referrerStatus, setReferrerStatus] = useState(referrerDefaultState);
    const [promotionalSubscribersStatusFilter, setPromotionalSubscribersStatusFilter] = useState({
        label: '',
        value: '',
    });
    const [editCustomerDialog, setEditCustomerDialog] = useState(false);
    const customer = useAppSelector((state) => state.editCustomerSlice.customer);

    const ReferralStatus = [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const data = await dispatch(getSalesReps());
            setSalesRep(data.payload.data);

            const status = PromotionalSubscribersStatus?.filter((item) => item.value === query.promotionalSubscribers);
            setPromotionalSubscribersStatusFilter({ value: status[0]?.value, label: status[0]?.label });

            const preselectedSalesRep = await data.payload.data?.filter(
                (item: SalesRepEntity) => item.id.toString() === query.salesmanId,
            );
            if (preselectedSalesRep.length > 0) {
                setSalesRepFilter({
                    salesmanName: preselectedSalesRep[0].fullName,
                    salesmanId: preselectedSalesRep[0].id,
                });
            }

            const referredByQuery = query.referredBy?.toString() ?? '';
            if (['true', 'false'].includes(referredByQuery)) {
                const referredByQueryValue = referredByQuery === 'true' ? 1 : 0;
                const preselectedReferralStatus = ReferralStatus?.filter((item) => item.value === referredByQueryValue);
                setReferrerStatus(preselectedReferralStatus[0]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

    const redirectToCustomerProfile = useCallback(
        (customer: CustomerEntity) => {
            navigate(`/customers/${customer.id}/view/overview`);
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
            promotionalSubscribers: query.promotionalSubscribers ?? '',
            referredBy: query.referredBy,
        }),
        [
            query.minSubmissions,
            query.maxSubmissions,
            query.signedUpStart,
            query.signedUpEnd,
            query.search,
            query.salesmanId,
            query.promotionalSubscribers,
            query.referredBy,
        ],
    );

    const customers = useAdminCustomersListQuery({
        params: {
            include: ['salesman', 'referrer', 'referredBy'],
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
            }),
            1,
        );
        await formikRef.current?.setValues({
            ...formikRef.current!.values,
            minSubmissions: '',
            maxSubmissions: '',
        });
    }, [delQuery, customers, sortFilter]);

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
            }),
            1,
        );
        await formikRef.current?.setValues({
            ...formikRef.current!.values,
            signedUpStart: '',
            signedUpEnd: '',
        });
    }, [delQuery, customers, sortFilter]);

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
                    promotionalSubscribers: promotionalSubscribersStatusFilter.value,
                    salesmanId: salesRepFilter.salesmanId,
                    search,
                }),
                1,
            );
        },
        [
            addQuery,
            customers,
            delQuery,
            promotionalSubscribersStatusFilter.value,
            salesRepFilter.salesmanId,
            sortFilter,
        ],
    );

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
                signedUpStart: formatDate(values.signedUpStart, 'YYYY-MM-DD'),
                signedUpEnd: formatDate(values.signedUpEnd, 'YYYY-MM-DD'),
            });
            formikRef.current?.setValues({
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
            };
            setSalesRepFilter({ salesmanName: saleRep.fullName, salesmanId: saleRep.id });
            handleSubmit(values);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [handleSubmit],
    );

    const handleClearSalesRep = useCallback(async () => {
        formikRef.current?.setFieldValue('salesmanId', '');
        delQuery('salesmanId');
        setSalesRepFilter({ salesmanName: '', salesmanId: '' });
        await customers.search(
            getFilters({
                ...formikRef.current!.values,
                salesmanId: '',
            }),
        );
        await formikRef.current?.setValues({
            ...formikRef.current!.values,
            salesmanId: '',
        });
    }, [customers, delQuery]);

    const handleClearPromotionalSubscribers = useCallback(async () => {
        formikRef.current?.setFieldValue('promotionalSubscribers', '');
        delQuery('promotionalSubscribers');
        setPromotionalSubscribersStatusFilter({ value: '', label: '' });
        await customers.searchSortedWithPagination(
            { sort: sortFilter },
            getFilters({
                ...formikRef.current!.values,
                promotionalSubscribers: '',
            }),
            1,
        );
        await formikRef.current?.setValues({
            ...formikRef.current!.values,
            promotionalSubscribers: '',
        });
    }, [delQuery, customers, sortFilter]);

    const handlePromotionalSubscribers = useCallback(
        async (values, promotionalSubscribers) => {
            values = {
                ...values,
                promotionalSubscribers: promotionalSubscribers.value,
            };
            setPromotionalSubscribersStatusFilter({
                value: promotionalSubscribers.value,
                label: promotionalSubscribers.label,
            });
            await handleSubmit(values);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },
        [handleSubmit],
    );

    const handleClearReferrerStatus = useCallback(async () => {
        setReferrerStatus(referrerDefaultState);
        delQuery('referredBy');
        await customers.searchSortedWithPagination(
            { sort: sortFilter },
            getFilters({
                ...formikRef.current!.values,
                referredBy: null,
            }),
            1,
        );
        await formikRef.current?.setValues({
            ...formikRef.current!.values,
            referredBy: null,
        });
    }, [customers, delQuery, sortFilter, referrerDefaultState]);

    const handleReferrerStatus = useCallback(async (values, referrerStatusItem) => {
        values = {
            ...values,
            referredBy: referrerStatusItem.value ? true : false,
        };
        setReferrerStatus({ value: referrerStatusItem.value, label: referrerStatusItem.label });
        await handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditCustomerOption = useCallback(() => {
        setEditCustomerDialog(true);
    }, []);

    const handleEditCustomerDialogClose = useCallback(() => {
        setEditCustomerDialog(false);
    }, []);

    const handleEditCustomerSubmit = useCallback(() => {
        setEditCustomerDialog(false);
        window.location.reload();
    }, []);

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
                title={'Customers'}
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

                                <PageSelector
                                    label={'Promotional Subscribers'}
                                    value={promotionalSubscribersStatusFilter.label}
                                    onClear={handleClearPromotionalSubscribers}
                                >
                                    {PromotionalSubscribersStatus?.map((item: any) => {
                                        return (
                                            <Grid key={item.value}>
                                                <MenuItem
                                                    onClick={() => handlePromotionalSubscribers(values, item)}
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </MenuItem>
                                            </Grid>
                                        );
                                    })}
                                </PageSelector>
                                <PageSelector
                                    label={'Referrer'}
                                    value={referrerStatus.label}
                                    onClear={handleClearReferrerStatus}
                                >
                                    {ReferralStatus?.map((item: any) => {
                                        return (
                                            <Grid key={item.value}>
                                                <MenuItem
                                                    onClick={() => handleReferrerStatus(values, item)}
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
                        disabled={isExporting}
                    >
                        Export List
                    </LoadingButton>
                </Grid>
            </Grid>
            {customers.isLoading ? (
                <Grid container padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Grid>
            ) : (
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
                                <CustomerTableRow
                                    customer={customer}
                                    salesReps={salesReps}
                                    onEditCustomer={handleEditCustomerOption}
                                />
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination {...customers.paginationProps} />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
            <EditCustomerDetailsDialog
                endpointUrl={`admin/customer/${customer.id}`}
                endpointVersion={'v3'}
                open={editCustomerDialog}
                onSubmit={handleEditCustomerSubmit}
                onClose={handleEditCustomerDialogClose}
            />
        </Grid>
    );
}

export default CustomersList;
