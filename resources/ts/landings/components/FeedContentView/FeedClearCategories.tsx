import ClearAllIcon from '@mui/icons-material/ClearAll';
import Typography from '@mui/material/Typography';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import theme from '@shared/styles/theme';
import { clearAllCategories, clearCount, setGradeValue } from '../../redux/slices/feedSlice';

const styles = {
    ClearFilter: {
        margin: '5px',
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 0.54)',
        [theme.breakpoints.down('sm')]: {
            marginLeft: '0px',
        },
        marginLeft: '20px',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
    },
};

const CustomClearRefinements = connectCurrentRefinements(({ items, refine }) => {
    const dispatch = useDispatch();

    return (
        <Typography
            sx={styles.ClearFilter}
            onClick={() => {
                refine(items);
                dispatch(clearAllCategories());
                dispatch(clearCount());
                dispatch(setGradeValue(''));
            }}
        >
            <ClearAllIcon sx={{ margin: '5px' }} />
            Clear Filters
        </Typography>
    );
});

export function FeedClearCategories() {
    return <CustomClearRefinements />;
}

export default FeedClearCategories;
