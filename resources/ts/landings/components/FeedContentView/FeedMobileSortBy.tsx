import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { connectSortBy } from 'react-instantsearch-dom';

const CustomSortByMobile = connectSortBy(({ items, refine, currentRefinement, ...rest }) => {
    return (
        <ul>
            <RadioGroup>
                {items.map((item: any) => (
                    <FormControlLabel
                        key={item.value}
                        checked={currentRefinement === item.value}
                        value={item.value || rest.feedMobileSortByValue}
                        control={<Radio />}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                            rest.setFeedMobileSortByValue(item.value);
                        }}
                    />
                ))}
            </RadioGroup>
        </ul>
    );
});

export function FeedMobileSortBy({
    setFeedMobileSortByValue,
    feedMobileSortByValue,
}: {
    setFeedMobileSortByValue: any;
    feedMobileSortByValue: any;
}) {
    return (
        <CustomSortByMobile
            defaultRefinement={'local_user_cards'}
            setFeedMobileSortByValue={setFeedMobileSortByValue}
            feedMobileSortByValue={feedMobileSortByValue}
            items={[
                { value: 'local_user_cards_Descending', label: 'Most Recent' },
                { value: 'local_user_cards_Ascending', label: 'Oldest' },
            ]}
        />
    );
}

export default FeedMobileSortBy;
