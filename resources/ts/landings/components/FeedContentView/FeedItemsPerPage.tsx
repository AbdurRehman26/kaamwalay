import Typography from '@mui/material/Typography';
import { connectHitsPerPage } from 'react-instantsearch-dom';

export function FeedItemsPerPage() {
    const HitsPerPage = ({ items, refine, createURL }) => (
        <div>
            <Typography>Items per page:</Typography>
            <ul>
                {items.map((item) => (
                    <li key={item.value}>
                        <a
                            href={createURL(item.value)}
                            style={{ fontWeight: item.isRefined ? 'bold' : '' }}
                            onClick={(event) => {
                                event.preventDefault();
                                refine(item.value);
                            }}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
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
