import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import styled from '@mui/styles/styled';
import { connectHitsPerPage } from 'react-instantsearch-dom';

const GridDiv = styled(Grid)({
    display: 'flex',
    alignItems: 'stretch',

    '.selectdiv': {
        background: 'transparent',
        marginLeft: '10px',
    },
});

const CustomHitsPerPage = connectHitsPerPage(({ items, refine, currentRefinement }) => {
    return (
        <GridDiv>
            <p>Items per page:</p>
            <Select
                className={'selectdiv'}
                value={currentRefinement || ''}
                onChange={(event) => refine(event.target.value)}
                variant={'standard'}
                disableUnderline
                sx={{ marginLeft: '10px' }}
            >
                {items.map((item: any) => (
                    <MenuItem key={item.label} value={item.isRefined ? currentRefinement : item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </GridDiv>
    );
});
export function FeedItemsPerPage() {
    return (
        <CustomHitsPerPage
            defaultRefinement={50}
            items={[
                { value: 50, label: '50' },
                { value: 72, label: '72' },
                { value: 96, label: '96' },
                { value: 100, label: '100' },
                { value: 120, label: '120' },
            ]}
        />
    );
}

export default FeedItemsPerPage;
