import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { connectMenu } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import { setFilterIncrement, setGradeTeal, setGradeValue } from '../../redux/slices/feedSlice';

const CustomMenuSelectMobile = connectMenu(({ items, refine }) => {
    const dispatch = useDispatch();
    const getGrade = (item: Record<string, any>) => Number(item.label.split(' ').pop());
    const grades = items.sort((a, b) => getGrade(b) - getGrade(a));

    return (
        <ul>
            <RadioGroup>
                {grades.map((item: any) => (
                    <FormControlLabel
                        key={item.value}
                        value={item.value}
                        control={<Radio checked={item.isRefined} />}
                        label={item.label}
                        onClick={(event) => {
                            event.preventDefault();
                            refine(item.value);
                            dispatch(setGradeValue(item.value));
                            dispatch(setFilterIncrement());
                            dispatch(setGradeTeal(true));
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
