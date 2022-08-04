import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useCallback, useMemo, useRef } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { FormikTextField } from '@shared/components/fields/FormikTextField';
import { ExportableModelsEnum } from '@shared/constants/ExportableModelsEnum';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminCustomersQuery } from '@shared/redux/hooks/useCustomersQuery';
import { DataExportRepository } from '@shared/repositories/Admin/DataExportRepository';
import { ListPageHeader, ListPageSelector } from '../../../components/ListPage';
import { CustomerTableRow } from './CustomerTableRow';

type InitialValues = {
    minSubmissions: string;
    maxSubmissions: string;
    signedUpStart: DateLike;
    signedUpEnd: DateLike;
    search: string;
};

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

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CustomersListPage
 * @date: 23.12.2021
 * @time: 21:39
 */
export function CustomersList() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();

    const dataExportRepository = useRepository(DataExportRepository);
    const notifications = useNotifications();

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

    const customers = useAdminCustomersQuery({
        params: {
            filter: getFilters(query),
        },

        ...bracketParams(),
    });

    const handleClearSubmissions = useCallback(async () => {
        formikRef.current?.setFieldValue('minSubmissions', '');
        formikRef.current?.setFieldValue('maxSubmissions', '');
        delQuery('minSubmissions', 'maxSubmissions');

        await customers.search(
            getFilters({
                ...formikRef.current!.values,
                minSubmissions: '',
                maxSubmissions: '',
            }),
        );
    }, [customers, delQuery]);

    const handleClearSignUp = useCallback(async () => {
        formikRef.current?.setFieldValue('signedUpStart', '');
        formikRef.current?.setFieldValue('signedUpEnd', '');
        delQuery('signedUpStart', 'signedUpEnd');

        await customers.search(
            getFilters({
                ...formikRef.current!.values,
                signedUpStart: '',
                signedUpEnd: '',
            }),
        );
    }, [customers, delQuery]);

    const handleSearch = useCallback(
        async (search: string) => {
            if (search) {
                addQuery({ search });
            } else {
                delQuery('search');
            }

            formikRef.current?.setFieldValue('search', search);
            await customers.search(
                getFilters({
                    ...formikRef.current!.values,
                    search,
                }),
            );
        },
        [addQuery, customers, delQuery],
    );

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
                signedUpStart: formatDate(values.signedUpStart, 'YYYY-MM-DD'),
                signedUpEnd: formatDate(values.signedUpEnd, 'YYYY-MM-DD'),
            });
            await customers.search(getFilters(values));

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [customers, setQuery],
    );

    const handleExportData = useCallback(async () => {
        try {
            const exportData = await dataExportRepository.export({
                model: ExportableModelsEnum.User,
                filter: getFilters({
                    ...formikRef.current!.values,
                }),
            });

            await downloadFromUrl(exportData.fileUrl, `robograding-customers.xlsx`);
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [dataExportRepository, notifications]);

    return (
        <Grid container>
            <ListPageHeader
                searchField
                title={'Customers'}
                value={initialValues.search}
                onSearch={handleSearch}
                isCustomerPage={true}
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
                <Grid item xs container justifyContent={'flex-end'} maxWidth={'240px !important'}>
                    <Button
                        variant={'outlined'}
                        color={'primary'}
                        sx={{ borderRadius: 20, padding: '7px 24px' }}
                        onClick={handleExportData}
                    >
                        Export List
                    </Button>
                </Grid>
            </Grid>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell variant={'head'}>Name / ID</TableCell>
                            <TableCell variant={'head'}>Email</TableCell>
                            <TableCell variant={'head'}>Phone</TableCell>
                            <TableCell variant={'head'}>Signed Up</TableCell>
                            <TableCell variant={'head'} align={'right'}>
                                Submissions
                            </TableCell>
                            <TableCell variant={'head'} align={'right'}>
                                Cards
                            </TableCell>
                            <TableCell variant={'head'} align={'right'}>
                                Wallet Balance
                            </TableCell>
                        </TableRow>
                    </TableHead>
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
