import { connectSortBy } from 'react-instantsearch-dom';

export function FeedSortBy() {
    const SortBy = ({ items, refine, createURL }) => (
        <ul>
            <p>sort</p>
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
