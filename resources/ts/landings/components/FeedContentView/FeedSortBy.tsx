import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { connectSortBy } from 'react-instantsearch-dom';

const FeedSortDropdown = styled(Box)(
    {
        '.Select': {
            width: '100%',
            height: '40px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        '.SortText': {
            marginLeft: '10px',
            color: 'rgba(0, 0, 0, 0.54)',
        },
        '.MenuItem': {
            '&:hover': {
                background: 'blue',
            },
        },
    },
    { name: 'FeedSortDropdown' },
);

export function FeedSortBy() {
    const SortBy = ({ items, refine, currentRefinement }: { items: any; refine: any; currentRefinement: any }) => (
        <FeedSortDropdown>
            <Typography className={'SortText'}>sort</Typography>
            <Select
                value={currentRefinement || 'local_user_cards'}
                onChange={(event) => refine(event.target.value)}
                variant={'standard'}
                className={'Select'}
                disableUnderline
            >
                <MenuItem sx={{ display: 'none' }} value={'local_user_cards'}>
                    Most Recent
                </MenuItem>
                {items.map((item: any) => (
                    <MenuItem
                        key={item.label}
                        sx={{ fontWeight: item.isRefined ? 'bold' : '' }}
                        value={item.isRefined ? currentRefinement : item.value}
                        className={'MenuItem'}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FeedSortDropdown>
    );

    const CustomSortBy = connectSortBy(SortBy);

    return (
        <CustomSortBy
            defaultRefinement="local_user_cards"
            items={[
                { value: 'local_user_cards_Descending', label: 'Most Recent' },
                { value: 'local_user_cards_Ascending', label: 'Oldest' },
            ]}
        />
    );
}

export default FeedSortBy;
