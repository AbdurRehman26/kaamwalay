import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { connectSortBy } from 'react-instantsearch-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const FeedSortDropdown = styled(Box)(
    {
        '.Select': {
            width: '100%',
            height: '40px',
            padding: '10px 10px',
            cursor: 'pointer',
            color: 'rgba(0, 0, 0, 0.54)',
            border: '1px solid transparent',
        },
    },
    { name: 'FeedSortDropdown' },
);

export function FeedSortBy() {
    const SortBy = ({ items, refine, currentRefinement }: { items: any; refine: any; currentRefinement: any }) => (
        <FeedSortDropdown>
            <p>sort</p>
            <Select
                value={currentRefinement || 'Recent'}
                onChange={(event) => refine(event.target.value)}
                className={'Select'}
            >
                <MenuItem sx={{ display: 'none' }} value={'Recent'}>
                    Most Recent
                </MenuItem>
                {items.map((item: any) => (
                    <MenuItem
                        key={item.label}
                        style={{ fontWeight: item.isRefined ? 'bold' : '' }}
                        value={item.isRefined ? currentRefinement : item.value}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                        }}
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
