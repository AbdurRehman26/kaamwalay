import { connectRefinementList } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileCategories() {
    const RefinementListMobile = ({ items, refine }: { items: any; refine: any }) => (
        <ul>
            <RadioGroup name="radio-buttons-group">
                {items.map((item: any) => (
                    <>
                        <FormControlLabel
                            key={item.label}
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
    const CustomRefinementListMobile = connectRefinementList(RefinementListMobile);

    return <CustomRefinementListMobile attribute={'card_category'} />;
}

export default FeedMobileCategories;
