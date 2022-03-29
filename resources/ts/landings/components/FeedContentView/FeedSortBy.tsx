import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { connectSortBy } from 'react-instantsearch-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const FeedSortDropdown = styled(Box)(
    {
        '.Select': {
            width: '100%',
            height: '40px',
            padding: '10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        '.SelectFocus': {
            width: '100%',
            height: '40px',
            padding: '10px',
            cursor: 'pointer',
            color: '#20BFB8',
        },
        '.SortText': {
            marginLeft: '10px',
            color: 'rgba(0, 0, 0, 0.54)',
        },
        '.SortTextSelected': {
            marginLeft: '10px',
            color: '#20BFB8',
        },
    },
    { name: 'FeedSortDropdown' },
);

const CustomSortBy = connectSortBy(({ items, refine, currentRefinement }) => {
    const [classN, changeClass] = useState('Select');

    return (
        <FeedSortDropdown>
            {classN === 'Select' ? (
                <Typography className={'SortText'}>sort</Typography>
            ) : (
                <Typography className={'SortTextSelected'}>sort</Typography>
            )}
            <Select
                value={currentRefinement || 'local_user_cards'}
                onChange={(event) => refine(event.target.value)}
                variant={'standard'}
                onFocus={() => {
                    changeClass('SelectFocus');
                }}
                className={classN}
                disableUnderline
            >
                <MenuItem sx={{ display: 'none' }} value={'local_user_cards'}>
                    Most Recent
                </MenuItem>
                {items.map((item: any) => (
                    <MenuItem
                        key={item.label}
                        sx={{ color: item.isRefined ? '#20BFB8' : '#000000' }}
                        value={item.isRefined ? currentRefinement : item.value}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FeedSortDropdown>
    );
});

export function FeedSortBy() {
    const sort = useSelector((state: RootState) => state.feed.sortState.sort);
    return (
        <CustomSortBy
            defaultRefinement={sort ? sort : 'local_user_cards'}
            items={[
                { value: 'local_user_cards_Descending', label: 'Most Recent' },
                { value: 'local_user_cards_Ascending', label: 'Oldest' },
            ]}
        />
    );
}

export default FeedSortBy;
