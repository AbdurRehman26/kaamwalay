import { connectSortBy } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileSortBy() {
    const SortBy = ({ items, refine }: { items: any; refine: any }) => (
        <ul>
            <RadioGroup defaultValue="Most Recent" name="radio-buttons-group">
                {items.map((item: any) => (
                    <>
                        <FormControlLabel
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
            items={[
                { value: 'local_user_cards_Descending', label: 'Most Recent' },
                { value: 'local_user_cards_Ascending', label: 'Oldest' },
            ]}
        />
    );
}

export default FeedMobileSortBy;
