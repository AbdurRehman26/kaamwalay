import { connectSortBy } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileSortBy() {
    const SortBy = ({ items, refine, currentRefinement }: { items: any; refine: any; currentRefinement: any }) => (
        <ul>
            <RadioGroup>
                {items.map((item: any) => (
                    <>
                        <FormControlLabel
                            checked={currentRefinement}
                            value={item.value}
                            control={<Radio />}
                            label={item.label}
                            onClick={(event) => {
                                event.preventDefault();
                                refine(item.value);
                            }}
                        />
                    </>
                ))}
            </RadioGroup>
        </ul>
    );
    const CustomSortBy = connectSortBy(SortBy);

    return (
        <CustomSortBy
            defaultRefinement="local_user_cards"
            items={[{ value: 'local_user_cards_Ascending', label: 'Oldest' }]}
        />
    );
}

export default FeedMobileSortBy;
