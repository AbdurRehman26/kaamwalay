import MoreIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { FormikButton } from '@shared/components/fields/FormikButton';
import { FormikDesktopDatePicker } from '@shared/components/fields/FormikDesktopDatePicker';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { useAdminCardQuery } from '@shared/redux/hooks/useCardsQuery';
import { useAdminCustomersQuery } from '@shared/redux/hooks/useCustomersQuery';
import { deleteCard, getCardCategories } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { CardAddDialog } from './CardAddDialog';
import { CardPageHeader } from './CardPageHeader';
import { CardPageSelector } from './CardPageSelector';
import DeleteCardDialog from './DeleteCardDialog';

type InitialValues = {
    category: string;
    releasedDateStart: DateLike;
    releasedDateEnd: DateLike;
    search: string;
};

const joinFilterValues = (values: any[], separator = ',') =>
    values
        .map((value) => `${value ?? ''}`.trim())
        .filter(Boolean)
        .join(separator);

const releaseDateFilter = (start: DateLike, end: DateLike, separator = ',', format = 'YYYY-MM-DD') =>
    joinFilterValues([formatDate(start, format), formatDate(end, format)], separator);

const categoriesFilter = (category: string) => category;

const getFilters = (values: InitialValues) => ({
    search: values.search,
    signedUpBetween: releaseDateFilter(values.releasedDateStart, values.releasedDateEnd),
    submissions: categoriesFilter(values.category),
});

export function CardsListPage() {
    const [categoryName, setCategoryName] = useState('');
    const [addCardDialog, setAddCardDialog] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();

    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleClickOptions = useCallback<MouseEventHandler>((e) => setAnchorEl(e.target as Element), [setAnchorEl]);

    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const dispatch = useAppDispatch();
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);

    const handleDeleteSubmit = async () => {
        try {
            dispatch(deleteCard(deleteId));
        } catch (e: any) {
            notifications.exception(e);
        }
    };

    const notifications = useNotifications();

    const initialValues = useMemo<InitialValues>(
        () => ({
            category: query.category ?? '',
            releasedDateStart: query.releasedDateStart ? moment(query.releasedDateStart) : '',
            releasedDateEnd: query.releasedDateEnd ? moment(query.releasedDateEnd) : '',
            search: query.search ?? '',
        }),
        [query.category, query.releasedDateStart, query.releasedDateEnd, query.search],
    );

    const cards = useAdminCardQuery({
        params: {
            filter: getFilters(query),
        },

        ...bracketParams(),
    });

    const customers = useAdminCustomersQuery({
        params: {
            filter: getFilters(query),
        },

        ...bracketParams(),
    });

    const handleDelete = (cardId: number) => {
        setShowDeleteModal(true);
        setDeleteId(cardId);
    };

    const handleClearCategory = useCallback(async () => {
        formikRef.current?.setFieldValue('category', '');
        delQuery('category');

        await customers.search(
            getFilters({
                ...formikRef.current!.values,
                category: '',
            }),
        );
    }, [customers, delQuery]);

    const handleClearReleaseDate = useCallback(async () => {
        formikRef.current?.setFieldValue('releasedDateStart', '');
        formikRef.current?.setFieldValue('releasedDateEnd', '');
        delQuery('releasedDateStart', 'releasedDateEnd');

        await customers.search(
            getFilters({
                ...formikRef.current!.values,
                releasedDateStart: '',
                releasedDateEnd: '',
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
                releasedDateStart: formatDate(values.releasedDateStart, 'YYYY-MM-DD'),
                releasedDateEnd: formatDate(values.releasedDateEnd, 'YYYY-MM-DD'),
            });
            await customers.search(getFilters(values));

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [customers, setQuery],
    );

    useEffect(() => {
        (async () => {
            const result = await dispatch(getCardCategories());
            setAvailableCategories(result.payload);
        })();
    }, [dispatch]);

    return (
        <>
            <Grid container>
                <CardPageHeader searchField title={'Cards'} onSearch={handleSearch} />
                <CardAddDialog
                    onSubmit={() => {}}
                    open={addCardDialog}
                    isUpdate={true}
                    onClose={() => setAddCardDialog(false)}
                />
                <DeleteCardDialog
                    open={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onSubmit={() => handleDeleteSubmit()}
                ></DeleteCardDialog>
                <Grid container p={2.5} alignItems={'center'}>
                    <Grid item xs container alignItems={'center'}>
                        <Typography variant={'subtitle1'}>{customers.pagination.meta.total} Result(s)</Typography>
                        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                            {({ values }) => (
                                <Grid item xs ml={2} display={'flex'} alignItems={'center'}>
                                    <CardPageSelector
                                        label={'Categories'}
                                        value={categoriesFilter(categoryName)}
                                        onClear={handleClearCategory}
                                    >
                                        {availableCategories?.map((item: any) => {
                                            return (
                                                <MenuItem
                                                    onClick={() => setCategoryName(item.name)}
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </CardPageSelector>

                                    <CardPageSelector
                                        label={'Released Date'}
                                        value={releaseDateFilter(
                                            values.releasedDateStart,
                                            values.releasedDateEnd,
                                            ' - ',
                                            'MM/DD/YY',
                                        )}
                                        onClear={handleClearReleaseDate}
                                    >
                                        <Grid container component={Form} direction={'column'}>
                                            <Grid container alignItems={'center'}>
                                                <Grid item xs>
                                                    <FormikDesktopDatePicker
                                                        name={'releasedDateStart'}
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
                                                        name={'releasedDateEnd'}
                                                        label={'End Date'}
                                                        minDate={values.releasedDateStart}
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
                                    </CardPageSelector>
                                </Grid>
                            )}
                        </Formik>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell variant={'head'}>Card</TableCell>
                                <TableCell variant={'head'}>No</TableCell>
                                <TableCell variant={'head'}>Category</TableCell>
                                <TableCell variant={'head'}>Series</TableCell>
                                <TableCell variant={'head'}>Set</TableCell>
                                <TableCell variant={'head'}>Release Date</TableCell>
                                <TableCell variant={'head'}>Population</TableCell>
                                <TableCell variant={'head'}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cards.data.map((card) => (
                                <TableRow key={card.id}>
                                    <TableCell variant={'body'}>
                                        <Grid container>
                                            <Avatar src={card.imagePath ?? ''}></Avatar>
                                            <Grid item xs container direction={'column'} pl={2}>
                                                <Typography variant={'body2'}>{card.cardNumberOrder}</Typography>
                                                <Typography variant={'caption'} color={'textSecondary'}>
                                                    {card.cardCategoryName}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell variant={'body'}>{card.cardSeriesName ?? '-'}</TableCell>
                                    <TableCell variant={'body'}>{card.cardSetName ?? '-'}</TableCell>
                                    <TableCell variant={'body'}>{formatDate(card.releaseDate, 'MM/DD/YYYY')}</TableCell>
                                    <TableCell variant={'body'} align={'right'}>
                                        {card.addedByCustomer ?? 0}
                                    </TableCell>
                                    <TableCell variant={'body'} align={'right'}>
                                        {card.addedByCustomer}
                                    </TableCell>
                                    <TableCell variant={'body'} align={'right'}>
                                        <Grid container alignItems={'center'} justifyContent={'flex-end'}>
                                            <IconButton onClick={handleClickOptions} size="large">
                                                <MoreIcon />
                                            </IconButton>
                                        </Grid>

                                        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                                            <MenuItem onClick={() => setAddCardDialog(true)}>Edit</MenuItem>
                                            <MenuItem onClick={() => handleDelete(card.id)}>Delete</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
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
        </>
    );
}

export default CardsListPage;
