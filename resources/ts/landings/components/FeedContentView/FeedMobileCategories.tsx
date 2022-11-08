import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { connectRefinementList } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import {
    removeCategoryValue,
    setCategoryValue,
    setFilterDecrement,
    setFilterIncrement,
} from '../../redux/slices/feedSlice';

const CustomRefinementListMobile = connectRefinementList(({ items, refine }) => {
    const dispatch = useDispatch();

    return (
        <FormGroup>
            {items.map((item: any) => (
                <FormControlLabel
                    key={item.value}
                    value={item.value}
                    control={<Checkbox checked={item.isRefined ? true : false} />}
                    label={item.label}
                    onClick={(event) => {
                        event.preventDefault();
                        refine(item.value);
                        !item.isRefined
                            ? dispatch(setCategoryValue(item.label))
                            : dispatch(removeCategoryValue(item.label));
                        !item.isRefined ? dispatch(setFilterIncrement()) : dispatch(setFilterDecrement());
                    }}
                />
            ))}
        </FormGroup>
    );
});

export function FeedMobileCategories() {
    return <CustomRefinementListMobile attribute={'card_category'} limit={100} />;
}

export default FeedMobileCategories;
