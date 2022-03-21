import { connectMenu } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileGrade() {
    const MenuSelectMobile = ({ items, refine }: { items: any; currentRefinement: any; refine: any }) => (
        <ul>
            <RadioGroup name="radio-buttons-group">
                {items.map((item: any) => (
                    <>
                        <FormControlLabel
                            key={item.objectID}
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
    const CustomMenuSelectMobile = connectMenu(MenuSelectMobile);
    return <CustomMenuSelectMobile attribute={'grade'} />;
}

export default FeedMobileGrade;
