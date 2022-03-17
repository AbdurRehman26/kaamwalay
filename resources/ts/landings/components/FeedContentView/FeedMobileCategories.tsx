import { connectRefinementList } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileCategories() {
    const RefinementList = ({ items, refine }: { items: any; refine: any }) => (
        <ul>
            <RadioGroup defaultValue="Pokemon" name="radio-buttons-group">
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
    const CustomRefinementList = connectRefinementList(RefinementList);

    return <CustomRefinementList attribute={'card_category'} />;
}

export default FeedMobileCategories;
