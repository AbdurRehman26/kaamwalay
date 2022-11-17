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
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useAdminSurfacesQuery } from '@shared/redux/hooks/useSurfacesQuery';
import { getCardCategories } from '@shared/redux/slices/adminCardsSlice';
import { useAppDispatch } from '@admin/redux/hooks';
import MoreAction from './MoreAction';
import { SurfacesAddDialog } from './SurfacesAddDialog';
import { SurfacesPageHeader } from './SurfacesPageHeader';

type InitialValues = {
    cardCategory: string;
    search: string;
};

export function SurfacesListPage() {
    const formikRef = useRef<FormikProps<InitialValues> | null>(null);
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const [categoryName, setCategoryName] = useState({ categoryName: '', categoryId: 0 });
    const [query, { setQuery, delQuery }] = useLocationQuery<InitialValues>();
    const [addSurfacesDialog, setAddSurfacesDialog] = useState(false);
    const [sortFilter, setSortFilter] = useState(false);
    const dispatch = useAppDispatch();
    const [surfaceId, setSurfaceId] = useState<number>();
    const notifications = useNotifications();

    const initialValues = useMemo<InitialValues>(
        () => ({
            search: query.search ?? '',
            cardCategory: query.cardCategory ?? '',
        }),
        [query.search, query.cardCategory],
    );

    useEffect(
        () => {
            if (!surfaces.isLoading) {
                surfaces.searchSortedWithPagination(
                    { sort: sortFilter ? 'name' : '-name' },
                    getFilters({
                        ...formikRef.current!.values,
                        cardCategory: '',
                    }),
                );
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

    const surfaces = useAdminSurfacesQuery({
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
            await surfaces.searchSortedWithPagination({ sort: sortFilter ? 'name' : '-name' }, getFilters(values), 1);

            document.querySelector<HTMLDivElement>('.MuiBackdrop-root.MuiBackdrop-invisible')?.click();
        },
        [surfaces, setQuery, sortFilter],
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
                setQuery({ ...query, search });
            } else {
                delQuery('search');
            }

            formikRef.current?.setFieldValue('search', search);
            await surfaces.searchSortedWithPagination(
                { sort: sortFilter ? 'name' : '-name' },
                getFilters({
                    ...formikRef.current!.values,
                    search,
                }),
                1,
            );
        },
        [surfaces, delQuery, sortFilter, setQuery, query],
    );

    const handleAddSubmit = async () => {
        try {
            setAddSurfacesDialog(false);
            window.location.reload();
        } catch (e: any) {
            notifications.exception(e);
        }
    };

    const handleEdit = (id: number) => {
        setSurfaceId(id);
        setAddSurfacesDialog(true);
    };

    const handleClearCategory = useCallback(async () => {
        formikRef.current?.setFieldValue('cardCategory', '');
        delQuery('cardCategory');
        setCategoryName({ categoryId: 0, categoryName: '' });
        await surfaces.searchSortedWithPagination(
            { sort: sortFilter ? 'name' : '-name' },
            getFilters({
                ...formikRef.current!.values,
                cardCategory: '',
            }),
            1,
        );
    }, [surfaces, delQuery, sortFilter]);

    return (
        <>
            <SurfacesAddDialog
                title={'Update Surface'}
                open={addSurfacesDialog}
                onClose={() => setAddSurfacesDialog(false)}
                onSubmit={handleAddSubmit}
                isUpdate={true}
                surfaceId={surfaceId}
            />
            {surfaces.isLoading ? (
                <Box width={'100%'} padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <SurfacesPageHeader
                        searchField
                        value={initialValues.search}
                        title="Surfaces"
                        onSearch={handleSearch}
                    />
                    <Grid container p={2.5} alignItems={'center'}>
                        <Grid item xs container alignItems={'center'}>
                            <Typography variant={'subtitle1'}>{surfaces.pagination.meta.total} Result(s)</Typography>
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
                                            sx={{
                                                position: 'absolute',
                                                left: '15%',
                                                marginTop: '2px',
                                                color: '#0000008A',
                                            }}
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
                                {surfaces.data.map((surface) => (
                                    <TableRow key={surface.id}>
                                        <TableCell>{surface.name}</TableCell>
                                        <TableCell>{surface?.cardCategory?.name}</TableCell>
                                        <TableCell variant={'body'} align={'right'}>
                                            <MoreAction id={surface.id} handleEditAction={handleEdit} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination {...surfaces.paginationProps} />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    );
}

export default SurfacesListPage;
