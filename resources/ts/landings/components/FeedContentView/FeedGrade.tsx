import { connectMenu } from 'react-instantsearch-dom';

export function FeedGrade() {
    const MenuSelect = ({ items, currentRefinement, refine }) => (
        <select value={currentRefinement || ''} onChange={(event) => refine(event.currentTarget.value)}>
            <option value="">Grade</option>
            {items.map((item) => (
                <option key={item.label} value={item.isRefined ? currentRefinement : item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    );

    const CustomMenuSelect = connectMenu(MenuSelect);
    return <CustomMenuSelect attribute={'grade'} />;
}

export default FeedGrade;
