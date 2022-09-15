import Avatar from '@mui/material/Avatar';
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
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { deleteCard, getAllCards, getCardCategories, getCardData } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { CardAddDialog } from './CardAddDialog';
import { CardPageHeader } from './CardPageHeader';
import { CardPageSelector } from './CardPageSelector';
import DeleteCardDialog from './DeleteCardDialog';
import MoreAction from './MoreAction';

type InitialValues = {
    cardCategory: string;
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

const getFilters = (values: InitialValues) => ({
    search: values.search,
    releaseDate: releaseDateFilter(values.releasedDateStart, values.releasedDateEnd),
    cardCategory: values.cardCategory,
});

export function CardsListPage() {
    const [categoryName, setCategoryName] = useState({ categoryName: '', categoryId: '' });
    const [addCardDialog, setAddCardDialog] = useState(false);
    const [updateCardData, setUpdateCardData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [sortFilter, setSortFilter] = useState(false);
    const dispatch = useAppDispatch();
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const notifications = useNotifications();

    const handleDeleteSubmit = async () => {
        try {
            setIsLoading(true);
            await dispatch(deleteCard(deleteId));
            notifications.success('Card Deleted Successfully!');
            await dispatch(getAllCards);
            setIsLoading(false);
        } catch (e: any) {
            setIsLoading(false);
            notifications.exception(e);
        }
    };

    const handleAddSubmit = async () => {
        try {
            setIsLoading(true);
            setAddCardDialog(false);
            await dispatch(getAllCards);
            setIsLoading(false);
        } catch (e: any) {
            setIsLoading(false);
            notifications.exception(e);
        }
    };

    const initialValues = useMemo<InitialValues>(
        () => ({
            cardCategory: query.cardCategory ?? '',
            releasedDateStart: query.releasedDateStart ? moment(query.releasedDateStart) : '',
            releasedDateEnd: query.releasedDateEnd ? moment(query.releasedDateEnd) : '',
            search: query.search ?? '',
        }),
        [query.search, query.cardCategory, query.releasedDateStart, query.releasedDateEnd],
    );

    useEffect(
        () => {
            if (!cards.isLoading) {
                cards.sort({ sort: sortFilter ? 'population' : '-population' });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    const cards = useAdminCardQuery({
        params: {
            filter: getFilters(query),
            sort: sortFilter ? 'population' : '-population',
            perPage: 48,
        },

        ...bracketParams(),
    });

    const handleDelete = (cardId: number) => {
        setShowDeleteModal(true);
        setDeleteId(cardId);
    };

    const handleEdit = async (cardId: number) => {
        setIsLoading(true);
        const cardData = await dispatch(getCardData(cardId));
        setUpdateCardData(cardData.payload.data);
        setAddCardDialog(true);
        setIsLoading(false);
    };

    const handleClearCategory = useCallback(async () => {
        formikRef.current?.setFieldValue('cardCategory', '');
        delQuery('cardCategory');
        setCategoryName({ categoryId: '', categoryName: '' });
        await cards.search(
            getFilters({
                ...formikRef.current!.values,
                cardCategory: '',
            }),
        );
    }, [cards, delQuery]);

    const handleCategory = useCallback(async (values, category) => {
        values = { ...values, cardCategory: category.id };
        setCategoryName({ categoryName: category.name, categoryId: category.id });
        handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClearReleaseDate = useCallback(async () => {
        formikRef.current?.setFieldValue('releasedDateStart', '');
        formikRef.current?.setFieldValue('releasedDateEnd', '');
        delQuery('releasedDateStart', 'releasedDateEnd');

        await cards.search(
            getFilters({
                ...formikRef.current!.values,
                releasedDateStart: '',
                releasedDateEnd: '',
            }),
        );
    }, [cards, delQuery]);

    const handleSearch = useCallback(
        async (search: string) => {
            if (search) {
                addQuery({ search });
            } else {
                delQuery('search');
            }

            formikRef.current?.setFieldValue('search', search);
            await cards.search(
                getFilters({
                    ...formikRef.current!.values,
                    search,
                }),
            );
        },
        [addQuery, cards, delQuery],
    );

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
                releasedDateStart: formatDate(values.releasedDateStart, 'YYYY-MM-DD'),
                releasedDateEnd: formatDate(values.releasedDateEnd, 'YYYY-MM-DD'),
            });
            await cards.search(getFilters(values));

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [cards, setQuery],
    );

    const handleSort = (value: boolean) => {
        setSortFilter(value);
    };

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
                {cards.isLoading || isLoading ? (
                    <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <CardAddDialog
                            onSubmit={handleAddSubmit}
                            open={addCardDialog}
                            isUpdate={true}
                            onClose={() => setAddCardDialog(false)}
                            updateCard={updateCardData}
                        />
                        <DeleteCardDialog
                            open={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onSubmit={() => handleDeleteSubmit()}
                        ></DeleteCardDialog>
                        <Grid container p={2.5} alignItems={'center'}>
                            <Grid item xs container alignItems={'center'}>
                                <Typography variant={'subtitle1'}>{cards.pagination.meta.total} Result(s)</Typography>
                                <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formikRef}>
                                    {({ values }) => (
                                        <Grid item xs ml={2} display={'flex'} alignItems={'center'}>
                                            <CardPageSelector
                                                label={'Categories'}
                                                value={categoryName.categoryName}
                                                onClear={handleClearCategory}
                                            >
                                                {availableCategories?.map((item: any) => {
                                                    return (
                                                        <Grid>
                                                            <MenuItem
                                                                onClick={() => handleCategory(values, item)}
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </MenuItem>
                                                        </Grid>
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
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            Card
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            No
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            Id
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            Category
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            Series
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            Set
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} variant={'head'}>
                                            Release Date
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }} align="center" variant={'head'}>
                                            <TableSortLabel
                                                sx={{ float: 'right', marginRight: '40%', color: '#0000008A' }}
                                                onClick={() => handleSort(!sortFilter)}
                                                direction={!sortFilter ? 'desc' : 'asc'}
                                                active={true}
                                            ></TableSortLabel>{' '}
                                            Population
                                        </TableCell>
                                        <TableCell variant={'head'}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cards.data.map((card) => (
                                        <TableRow key={card.id}>
                                            <TableCell variant={'body'}>
                                                <Grid container>
                                                    <Avatar
                                                        variant={'square'}
                                                        sx={{ height: '48px', width: '35px' }}
                                                        src={card.imagePath ?? ''}
                                                    ></Avatar>
                                                    <Grid
                                                        item
                                                        xs
                                                        container
                                                        alignItems={'center'}
                                                        direction={'row'}
                                                        pl={2}
                                                    >
                                                        <Typography variant={'body1'} sx={{ fontSize: '14px' }}>
                                                            {card.cardCategoryName}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell variant={'body'}>{card.cardNumber ?? '-'}</TableCell>
                                            <TableCell variant={'body'}>{card.id ?? '-'}</TableCell>
                                            <TableCell variant={'body'}>{card.cardCategoryName ?? '-'}</TableCell>
                                            <TableCell variant={'body'}>{card.cardSeriesName ?? '-'}</TableCell>
                                            <TableCell variant={'body'}>{card.cardSetName}</TableCell>
                                            <TableCell variant={'body'}>
                                                {formatDate(card.releaseDate, 'MM/DD/YYYY')}
                                            </TableCell>
                                            <TableCell variant={'body'} align={'center'}>
                                                {card.population ?? 0}
                                            </TableCell>
                                            <TableCell variant={'body'} align={'right'}>
                                                <MoreAction
                                                    handleEditAction={handleEdit}
                                                    handleDeleteAction={handleDelete}
                                                    id={card.id}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination {...cards.paginationProps} />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Grid>
        </>
    );
}

export default CardsListPage;