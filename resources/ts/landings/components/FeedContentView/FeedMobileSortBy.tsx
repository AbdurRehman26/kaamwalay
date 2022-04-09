import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { connectSortBy } from 'react-instantsearch-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { setSortByValue } from '../../redux/slices/feedSlice';
import { RootState } from '../../redux/store';

const CustomSortByMobile = connectSortBy(({ items, refine }) => {
    const sort = useSelector((state: RootState) => state.feed.sortState.sort);
    const dispatch = useDispatch();

    return (
        <ul>
            <RadioGroup>
                {items.map((item: any) => (
                    <FormControlLabel
                        checked={sort === item.value}
                        key={item.value}
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                            dispatch(setSortByValue(item.value));
                        }}
                    />
                ))}
            </RadioGroup>
        </ul>
    );
});

export function FeedMobileSortBy() {
    const { appEnv } = useConfiguration();

    return (
        <CustomSortByMobile
            defaultRefinement={`${appEnv}_user_cards`}
            items={[
                { value: `${appEnv}_user_cards`, label: 'Most Recent' },
                { value: `${appEnv}_user_cards_Ascending`, label: 'Oldest' },
            ]}
        />
    );
}

export default FeedMobileSortBy;
