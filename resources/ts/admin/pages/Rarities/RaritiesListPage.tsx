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
import { Formik, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageSelector } from '@shared/components/PageSelector';
import { TablePagination } from '@shared/components/TablePagination';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { CardRarityEntity } from '@shared/entities/CardRarityEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminRaritiesQuery } from '@shared/redux/hooks/useRaritiesQuery';
import { getCardCategories } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import MoreAction from './MoreAction';
import { RaritiesAddDialog } from './RaritiesAddDialog';
import { RaritiesPageHeader } from './RaritiesPageHeader';

type InitialValues = {
    cardCategory: string;
    search: string;
};

export function RaritiesListPage() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const [categoryName, setCategoryName] = useState({ categoryName: '', categoryId: 0 });
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [addRaritiesDialog, setAddRaritiesDialog] = useState(false);
    const [sortFilter, setSortFilter] = useState(false);
    const dispatch = useAppDispatch();
    const [updateRarity, setUpdateRarity] = useState<CardRarityEntity>();

    const initialValues = useMemo<InitialValues>(
        () => ({
            cardCategory: query.cardCategory ?? '',
            search: query.search ?? '',
        }),
        [query.search, query.cardCategory],
    );

    useEffect(
        () => {
            if (!rarities.isLoading) {
                rarities.sort({ sort: sortFilter ? 'name' : '-name' });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    useEffect(() => {
        const category = availableCategories?.filter((item) => item.id === Number(query.cardCategory));
        setCategoryName({ categoryId: category[0]?.id, categoryName: category[0]?.name });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableCategories]);

    const getFilters = (values: InitialValues) => ({
        search: values.search,
        cardCategory: values.cardCategory,
    });

    const handleSort = (value: boolean) => {
        setSortFilter(value);
    };

    const handleCategory = useCallback(async (values, category) => {
        values = { ...values, cardCategory: category.id };
        setCategoryName({ categoryName: category.name, categoryId: category.id });
        handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rarities = useAdminRaritiesQuery({
        params: {
            filter: getFilters(query),
            sort: sortFilter ? 'name' : '-name',
            perPage: 48,
        },
        ...bracketParams(),
    });

    const handleSubmit = useCallback(
        async (values) => {
            setQuery({
                ...values,
            });
            await rarities.search(getFilters(values));

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [rarities, setQuery],
    );

    useEffect(() => {
        (async () => {
            const result = await dispatch(getCardCategories());
            setAvailableCategories(result.payload);
        })();
    }, [dispatch]);

    const handleSearch = useCallback(
        async (search: string) => {
            if (search) {
                addQuery({ search });
            } else {
                delQuery('search');
            }

            formikRef.current?.setFieldValue('search', search);
            await rarities.search(
                getFilters({
                    ...formikRef.current!?.values,
                    search,
                }),
            );
        },
        [addQuery, rarities, delQuery],
    );

    const handleAddSubmit = async () => {
        setAddRaritiesDialog(false);
        // window.location.reload();
    };

    const handleEdit = async (rarity: CardRarityEntity) => {
        setUpdateRarity(rarity);
        setAddRaritiesDialog(true);
    };

    const handleClearCategory = useCallback(async () => {
        formikRef.current?.setFieldValue('cardCategory', '');
        delQuery('cardCategory');
        setCategoryName({ categoryId: 0, categoryName: '' });
        await rarities.search(
            getFilters({
                ...formikRef.current!.values,
                cardCategory: '',
            }),
        );
    }, [rarities, delQuery]);

    return (
        <>
            <RaritiesAddDialog
                title={'Update Rarity'}
                open={addRaritiesDialog}
                onClose={() => setAddRaritiesDialog(false)}
                onSubmit={handleAddSubmit}
                isUpdate={true}
                updateRarity={updateRarity}
            />
            {rarities.isLoading ? (
                <Box width={'100%'} padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <RaritiesPageHeader searchField title="Rarities" onSearch={handleSearch} />
                    <Grid container p={2.5} alignItems={'center'}>
                        <Grid item xs container alignItems={'center'}>
                            <Typography variant={'subtitle1'}>{rarities.pagination.meta.total} Result(s)</Typography>
                            <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formikRef}>
                                {({ values }) => (
                                    <Grid item xs ml={2} display={'flex'} alignItems={'center'}>
                                        <PageSelector
                                            label={'Categories'}
                                            value={categoryName.categoryName}
                                            onClear={handleClearCategory}
                                        >
                                            {availableCategories?.map((item: any) => {
                                                return (
                                                    <Grid key={item.id}>
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
                                        </PageSelector>
                                    </Grid>
                                )}
                            </Formik>
                        </Grid>
                    </Grid>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '12px' }} align="left" variant={'head'}>
                                        <TableSortLabel
                                            sx={{ float: 'right', marginRight: '90%', color: '#0000008A' }}
                                            onClick={() => handleSort(!sortFilter)}
                                            direction={!sortFilter ? 'desc' : 'asc'}
                                            active={true}
                                        ></TableSortLabel>{' '}
                                        Name
                                    </TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell variant={'head'}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rarities.data.map((rarity) => (
                                    <TableRow key={rarity.id}>
                                        <TableCell>{rarity.name}</TableCell>
                                        <TableCell>{rarity.cardCategoryName}</TableCell>
                                        <TableCell variant={'body'} align={'right'}>
                                            <MoreAction rarity={rarity} handleEditAction={handleEdit} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination {...rarities.paginationProps} />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    );
}

export default RaritiesListPage;
