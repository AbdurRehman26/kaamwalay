import SortIcon from '@mui/icons-material/Sort';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { TablePagination } from '@shared/components/TablePagination';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListUserCardsQuery } from '@shared/redux/hooks/useUserCardsQuery';
import { font } from '@shared/styles/utils';
import { CardPreview } from '../../../components/CardPreview/CardPreview';

const StyledSelect = styled(Select)(
    {
        marginLeft: 8,
        fontWeight: 500,
        fontSize: '14px',
        '&:before': {
            display: 'none',
        },
    },
    { name: 'StyledSelect' },
);

const useStyles = makeStyles(
    {
        divider: {
            marginTop: '16px',
            width: '100%',
        },
    },
    {
        name: 'ListCardsItemsStyles',
    },
);
interface ListCardsItemsProps {
    search?: string;
}

export function ListCardItems({ search }: ListCardsItemsProps) {
    const [sortFilter, setSortFilter] = useState('date');
    const classes = useStyles();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const userCards$ = useListUserCardsQuery({
        params: {
            sort: sortFilter,
            filter: {
                search,
            },
        },
        ...bracketParams(),
    });
    const handleSortChange = useCallback((event) => setSortFilter(event.target.value), [setSortFilter]);

    // Fetch sorted cards based on the selected sort option
    useEffect(
        () => {
            if (!userCards$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                userCards$.sort({ sort: sortFilter });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    // Search cards based on the user input & return them sorted based on the selected sort option
    useEffect(
        () => {
            if (!userCards$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                userCards$.searchSorted({ sort: sortFilter }, { search });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    if (userCards$.isLoading || userCards$.isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {userCards$.isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography color={'error'}>Error loading your cards</Typography>
                )}
            </Box>
        );
    }

    const items$ = userCards$?.data?.map((userCard: any, index) => (
        <Grid item xs={6} sm={3} key={index}>
            <CardPreview
                id={userCard?.id}
                image={userCard?.cardProduct?.imagePath}
                name={userCard?.cardProduct?.name}
                shortName={userCard?.cardProduct?.shortName}
                description={userCard?.cardProduct?.longName ?? '-'}
                certification={userCard?.certificateNumber ?? '-'}
                grade={userCard?.overallGrade ?? '-'}
            />
        </Grid>
    ));

    // If we have no cards and the search is empty it means the user doesn't have any graded cards
    if (items$.length === 0 && search === '') {
        return (
            <Typography variant={'subtitle2'}>
                You don't seem to have any graded cards yet. They'll be shown here as soon as we grade them!
            </Typography>
        );
    }

    // If we have no cards but the search is not empty it means the user tried to search for something that didn't return anything
    if (items$.length === 0 && search !== '') {
        return (
            <Typography variant={'subtitle2'}>
                We didn't find anything for "{search}". Try searching for something else
            </Typography>
        );
    }

    return (
        <>
            <Box display={'flex'} alignItems={'center'} width={'100%'} paddingBottom={4}>
                {!isSm ? <Typography variant={'subtitle2'}>Graded Cards</Typography> : null}
                <Grid container item xs alignItems={'center'} justifyContent={isSm ? 'flex-start' : 'flex-end'}>
                    <SortIcon color={'disabled'} />
                    <Typography variant={'body2'} color={'textSecondary'} className={font.fontWeightMedium}>
                        Sort By:
                    </Typography>
                    <StyledSelect value={sortFilter} variant="standard" onChange={handleSortChange}>
                        <MenuItem value={'date'}>Date (Newest)</MenuItem>
                        <MenuItem value={'-date'}>Date (Oldest)</MenuItem>
                    </StyledSelect>
                </Grid>
            </Box>
            <Grid container spacing={1}>
                {items$}
                <Divider className={classes.divider} />
                <TablePagination {...userCards$.paginationProps} />
            </Grid>
        </>
    );
}
