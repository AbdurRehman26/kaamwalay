import { connectMenu } from 'react-instantsearch-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export function FeedMobileSortBy() {
    const MenuSelect = ({ items, refine }: { items: any; currentRefinement: any; refine: any }) => (
        <ul>
            <RadioGroup name="radio-buttons-group">
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
    const CustomMenuSelect = connectMenu(MenuSelect);
    return <CustomMenuSelect attribute={'grade'} />;
}

export default FeedMobileSortBy;
