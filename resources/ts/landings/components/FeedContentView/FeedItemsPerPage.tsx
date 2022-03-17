import Grid from '@mui/material/Grid';
import styled from '@mui/styles/styled';
import { connectHitsPerPage } from 'react-instantsearch-dom';

const GridDiv = styled(Grid)({
    display: 'flex',
    alignItems: 'stretch',

    '.selectdiv': {
        backgroundColor: '#F4F4FB',
    },
});

export function FeedItemsPerPage() {
    const HitsPerPage = ({ items, refine, currentRefinement }: { items: any; refine: any; currentRefinement: any }) => (
        <GridDiv>
            <p>Items per page:</p>
            <select
                className={'selectdiv'}
                value={currentRefinement || ''}
                onChange={(event) => refine(event.currentTarget.value)}
            >
                {items.map((item: any) => (
                    <option key={item.label} value={item.isRefined ? currentRefinement : item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </GridDiv>
    );
    const CustomHitsPerPage = connectHitsPerPage(HitsPerPage);
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
