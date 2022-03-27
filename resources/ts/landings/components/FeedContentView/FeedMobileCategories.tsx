import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { connectRefinementList } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import { setCategoryValue } from '../../redux/slices/feedSlice';

const CustomRefinementListMobile = connectRefinementList(({ items, refine }) => {
    const dispatch = useDispatch();

    return (
        <ul>
            <RadioGroup>
                {items.map((item: any) => (
                    <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio checked={item.isRefined} />}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                            dispatch(setCategoryValue(item.value));
                        }}
                    />
                ))}
            </RadioGroup>
        </ul>
    );
});

export function FeedMobileCategories() {
    return <CustomRefinementListMobile attribute={'card_category'} />;
}

export default FeedMobileCategories;
