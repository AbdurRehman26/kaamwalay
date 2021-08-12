import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import SortIcon from '@material-ui/icons/Sort';
import React, { useCallback, useState } from 'react';

import cardPreview from '@shared/assets/cardPreview.png';
import { font } from '@shared/styles/utils';

import { CardPreview } from '@dashboard/components/CardPreview';
import { ListHeader } from '@dashboard/components/ListHeader';

const filters = [
    { label: 'All', value: 'all' },
    { label: 'Graded', value: 'graded' },
    { label: 'Graded Pending', value: 'pending' },
];

const StyledSelect = styled(Select)(
    {
        marginLeft: 8,
        fontWeight: 500,
        '&:before': {
            display: 'none',
        },
    },
    { name: 'StyledSelect' },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ListCards
 * @date: 10.08.2021
 * @time: 01:38
 */
export function ListCards() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortFilter, setSortFilter] = useState('+date');

    const handleActiveFilter = useCallback((filter) => () => setActiveFilter(filter), [setActiveFilter]);
    const handleSortChange = useCallback((event) => setSortFilter(event.target.value), [setSortFilter]);

    return (
        <>
            <ListHeader headline={'Your Cards'} />
            <Box display={'flex'} alignItems={'center'} width={'100%'} paddingBottom={4}>
                <Grid container item xs alignItems={'center'}>
                    {filters.map(({ label, value }, index) => (
                        <Box display={'inline-flex'} paddingX={0.25} key={index}>
                            <Chip
                                variant={'outlined'}
                                label={
                                    <Typography
                                        variant={'body2'}
                                        className={font.fontWeightMedium}
                                        color={activeFilter === value ? 'primary' : 'textSecondary'}
                                    >
                                        {label}
                                    </Typography>
                                }
                                icon={activeFilter === value ? <CheckIcon color={'inherit'} /> : undefined}
                                color={activeFilter === value ? 'primary' : 'default'}
                                onClick={handleActiveFilter(value)}
                            />
                        </Box>
                    ))}
                </Grid>
                <Grid container item xs alignItems={'center'} justifyContent={'flex-end'}>
                    <SortIcon color={'disabled'} />
                    <Typography variant={'body2'} color={'textSecondary'} className={font.fontWeightMedium}>
                        Sort By:
                    </Typography>
                    <StyledSelect value={sortFilter} onChange={handleSortChange}>
                        <MenuItem value={'+date'}>Date (newest)</MenuItem>
                        <MenuItem value={'-date'}>Date (oldest)</MenuItem>
                    </StyledSelect>
                </Grid>
            </Box>
            <Grid container spacing={1}>
                {new Array(6).fill(0).map((_, index) => (
                    <Grid item xs={3} key={index}>
                        <CardPreview
                            id={index}
                            image={cardPreview}
                            name={'Charizard'}
                            description={'2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard'}
                            certification={'92920384'}
                            grade={index}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default ListCards;
