import { connectSortBy } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileSortBy({
    setFeedMobileSortByValue,
    feedMobileSortByValue,
}: {
    setFeedMobileSortByValue: any;
    feedMobileSortByValue: any;
}) {
    console.log(feedMobileSortByValue);
    const SortByMobile = ({
        items,
        refine,
        currentRefinement,
    }: {
        items: any;
        refine: any;
        currentRefinement: any;
    }) => (
        <ul>
            <RadioGroup>
                {items.map((item: any) => (
                    <>
                        <FormControlLabel
                            key={item.objectID}
                            checked={currentRefinement === item.value}
                            value={item.value || feedMobileSortByValue}
                            control={<Radio />}
                            label={item.label}
                            onClick={(event) => {
                                event.preventDefault();
                                refine(item.value);
                                setFeedMobileSortByValue(item.value);
                            }}
                        />
                    </>
                ))}
            </RadioGroup>
        </ul>
    );
    const CustomSortByMobile = connectSortBy(SortByMobile);

    return (
        <CustomSortByMobile
            defaultRefinement="local_user_cards"
            items={[
                { value: 'local_user_cards_Descending', label: 'Most Recent' },
                { value: 'local_user_cards_Ascending', label: 'Oldest' },
            ]}
        />
    );
}

export default FeedMobileSortBy;
