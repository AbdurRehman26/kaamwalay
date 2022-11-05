import ClearAllIcon from '@mui/icons-material/ClearAll';
import Typography from '@mui/material/Typography';
import { connectCurrentRefinements } from 'react-instantsearch-dom';

const styles = {
    ClearFilter: {
        margin: '5px',
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 0.54);',
        marginLeft: '20px',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
    },
};

const CustomClearRefinements = connectCurrentRefinements(({ items, refine }) => {
    return (
        <Typography sx={styles.ClearFilter} onClick={() => refine(items)}>
            <ClearAllIcon sx={{ margin: '5px' }} />
            Clear Filters
        </Typography>
    );
});

export function FeedClearCategories() {
    return <CustomClearRefinements />;
}

export default FeedClearCategories;
