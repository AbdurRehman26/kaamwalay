import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { CustomerAddDialog } from '@salesrep/components/Customer/CustomerAddDialog';
import { Form, Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListPageHeader, ListPageSelector } from '@shared/components/ListPage';
import { TablePagination } from '@shared/components/TablePagination';
import EnhancedTableHead from '@shared/components/Tables/EnhancedTableHead';
import EnhancedTableHeadCell from '@shared/components/Tables/EnhancedTableHeadCell';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { FormikTextField } from '@shared/components/fields/FormikTextField';
import { TableSortType } from '@shared/constants/TableSortType';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useSalesRepCustomersQuery } from '@shared/redux/hooks/useCustomersQuery';
import { CustomerTableRow } from './CustomerTableRow';

type InitialValues = {
    minSubmissions: string;
    maxSubmissions: string;
    signedUpStart: DateLike;
    signedUpEnd: DateLike;
    search: string;
};

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
    signedUpBetween: signedUpFilter(values.signedUpStart, values.signedUpEnd),
    submissions: submissionsFilter(values.minSubmissions, values.maxSubmissions),
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

export function CustomersList() {
    const classes = useStyles();
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [addCustomerDialog, setAddCustomerDialog] = useState(false);
    const [order, setOrder] = useState<TableSortType>('desc');
    const [orderBy, setOrderBy] = useState<string>('created_at');
    const [sortFilter, setSortFilter] = useState('-created_at');

    const navigate = useNavigate();

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
        }),
        [query.minSubmissions, query.maxSubmissions, query.signedUpStart, query.signedUpEnd, query.search],
    );

    const customers = useSalesRepCustomersQuery({
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
            }),
            1,
        );
    }, [sortFilter, customers, delQuery]);

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
    }, [sortFilter, customers, delQuery]);

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
                    search,
                }),
                1,
            );
        },
        [addQuery, customers, delQuery, sortFilter],
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

    useEffect(() => {
        setSortFilter((order === 'desc' ? '-' : '') + orderBy);

        formikRef.current?.submitForm();
    }, [order, orderBy]);

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
                            </Grid>
                        )}
                    </Formik>
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
                            <CustomerTableRow customer={customer} />
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

export default CustomersList;
