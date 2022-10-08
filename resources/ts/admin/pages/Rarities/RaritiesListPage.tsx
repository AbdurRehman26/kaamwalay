import MoreIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Formik, FormikProps } from 'formik';
import React, { MouseEvent, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PageSelector } from '@shared/components/PageSelector';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useAdminRaritiesQuery } from '@shared/redux/hooks/useRaritiesQuery';
import { getCardCategories } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import { AddRaritiesDialog } from './AddRaritiesDialog';
import { RaritiesPageHeader } from './RaritiesPageHeader';

type InitialValues = {
    cardCategory: string;
    search: string;
};

enum RowOption {
    Edit,
}

export function RaritiesListPage() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const [categoryName, setCategoryName] = useState({ categoryName: '', categoryId: 0 });
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const [query, { setQuery, delQuery, addQuery }] = useLocationQuery<InitialValues>();
    const [addRaritiesDialog, setAddRaritiesDialog] = useState(false);
    const dispatch = useAppDispatch();
    // const [updateRarity, setUpdateRarity] = useState();

    const initialValues = useMemo<InitialValues>(
        () => ({
            cardCategory: query.cardCategory ?? '',
            search: query.search ?? '',
        }),
        [query.search, query.cardCategory],
    );

    const getFilters = (values: InitialValues) => ({
        search: values.search,
        cardCategory: values.cardCategory,
    });

    const handleCategory = useCallback(async (values, category) => {
        values = { ...values, cardCategory: category.id };
        setCategoryName({ categoryName: category.name, categoryId: category.id });
        handleSubmit(values);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rarities = useAdminRaritiesQuery({
        params: {
            filter: getFilters(query),
            perPage: 48,
        },
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

    const handleClickOptions = useCallback<MouseEventHandler>(
        (e) => {
            e.stopPropagation();
            setAnchorEl(e.target as Element);
        },
        [setAnchorEl],
    );

    const handleCloseOptions = useCallback(() => setAnchorEl(null), [setAnchorEl]);

    const handleOption = useCallback(
        (option: RowOption) => async (e: MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            handleCloseOptions();
            switch (option) {
                case RowOption.Edit:
                    setAddRaritiesDialog(true);
                    break;
            }
        },
        [handleCloseOptions],
    );

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

    console.log('Rarities ', rarities);

    return (
        <>
            <AddRaritiesDialog
                open={addRaritiesDialog}
                onClose={() => setAddRaritiesDialog(false)}
                onSubmit={() => {}}
                isUpdate={true}
            />
            <RaritiesPageHeader searchField title="Add Rarities" onSearch={handleSearch} />
            <Grid container p={2.5} alignItems={'center'}>
                <Grid item xs container alignItems={'center'}>
                    <Typography variant={'subtitle1'}>
                        {rarities.pagination.meta.total}
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
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell variant={'head'}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rarities.data.map((rarity) => (
                            <TableRow>
                                <TableCell>{rarity.name}</TableCell>
                                <TableCell>{rarity.name}</TableCell>
                                <TableCell variant={'body'} align={'right'}>
                                    <IconButton onClick={handleClickOptions} size="large">
                                        <MoreIcon />
                                    </IconButton>
                                    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleCloseOptions}>
                                        <MenuItem onClick={handleOption(RowOption.Edit)}>Edit</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default RaritiesListPage;
