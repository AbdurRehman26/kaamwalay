import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { connectMenu } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import { setGradeValue } from '../../redux/slices/feedSlice';

const CustomMenuSelectMobile = connectMenu(({ items, refine }) => {
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
                            dispatch(setGradeValue(item.value));
                        }}
                    />
                ))}
            </RadioGroup>
        </ul>
    );
});

export function FeedMobileGrade() {
    return <CustomMenuSelectMobile attribute={'grade'} />;
}

export default FeedMobileGrade;
