import SortIcon from '@mui/icons-material/Sort';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useCallback, useEffect, useState } from 'react';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListUserCardsQuery } from '@shared/redux/hooks/useUserCardsQuery';
import { font } from '@shared/styles/utils';
import { ListHeader } from '@dashboard/components/ListHeader';
import { ListCardItems } from '@dashboard/pages/Cards/ListCards/ListCardsItems';

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

export function ListCards() {
    const [search, setSearch] = useState('');
    const [sortFilter, setSortFilter] = useState('date');
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const userCards$ = useListUserCardsQuery({
        params: {
            sort: sortFilter,
            filter: {
                search,
            },
            perPage: 48,
        },
        ...bracketParams(),
    });

    // Search cards based on the user input & return them sorted based on the selected sort option
    useEffect(
        () => {
            if (!userCards$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                userCards$.searchSorted({ sort: sortFilter }, { search });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search, sortFilter],
    );

    const handleSortChange = useCallback((event) => setSortFilter(event.target.value), [setSortFilter]);

    return (
        <>
            <ListHeader
                headline={'Your Cards'}
                onSearch={setSearch}
                noSearch={userCards$.data.length === 0 && search === ''}
            >
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
            </ListHeader>
            <ListCardItems search={search} userCards$={userCards$} />
        </>
    );
}

export default ListCards;
