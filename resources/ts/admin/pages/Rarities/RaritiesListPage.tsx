import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Formik, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageSelector } from '@shared/components/PageSelector';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { getCardCategories } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { RaritiesPageHeader } from './RaritiesPageHeader';

type InitialValues = {
    cardCategory: string;
    search: string;
};

export function RaritiesListPage() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const [categoryName, setCategoryName] = useState({ categoryName: '', categoryId: 0 });
    const dispatch = useAppDispatch();

    const initialValues = useMemo<InitialValues>(
        () => ({
            cardCategory: 'cardCategory' ?? '',
            search: 'search' ?? '',
        }),
        // [query.search, query.cardCategory],
        [],
    );

    const handleCategory = useCallback(async (values, category) => {
        values = { ...values, cardCategory: category.id };
        setCategoryName({ categoryName: category.name, categoryId: category.id });
        // handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async () => {};

    useEffect(() => {
        (async () => {
            const result = await dispatch(getCardCategories());
            setAvailableCategories(result.payload);
        })();
    }, [dispatch]);

    const handleClearCategory = useCallback(
        async () => {
            formikRef.current?.setFieldValue('cardCategory', '');
            // delQuery('cardCategory');
            setCategoryName({ categoryId: 0, categoryName: '' });
            // await cards.search(
            //     getFilters({
            //         ...formikRef.current!.values,
            //         cardCategory: '',
            //     }),
            // );
        },
        // [cards, delQuery]
        [],
    );

    return (
        <>
            <RaritiesPageHeader searchField title="Add Rarities" />
            <Grid container p={2.5} alignItems={'center'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'subtitle1'}>
                        {/* {cards.pagination.meta.total} */}
                        Result(s)
                    </Typography>
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
                            <TableCell>Number</TableCell>
                            <TableCell>Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Number 2</TableCell>
                            <TableCell>Name 3</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default RaritiesListPage;
