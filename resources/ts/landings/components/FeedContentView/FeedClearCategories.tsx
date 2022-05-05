import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { connectCurrentRefinements } from 'react-instantsearch-dom';

const styles = {
    Chip: {
        width: '100%',
        height: '40px',
        background: '#F4F4FB',
        border: '1px solid rgba(0, 0, 0, 0.18)',
        boxSizing: 'border-box',
        borderRadius: '24px',
        padding: '10px 10px',
        cursor: 'pointer',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    ChipSelected: {
        width: '100%',
        height: '40px',
        background: 'rgba(32, 191, 184, 0.08)',
        border: '1px solid #20BFB8',
        boxSizing: 'border-box',
        borderRadius: '24px',
        padding: '10px 10px',
        cursor: 'pointer',
        color: '#20BFB8',
        fontWeight: 'bold',
    },
};

const CustomClearRefinements = connectCurrentRefinements(({ items, refine }) => {
    return (
        <Chip
            onClick={() => refine(items)}
            sx={items.length > 0 ? styles.Chip : styles.ChipSelected}
            icon={items.length > 0 ? undefined : <DoneIcon sx={{ color: '#20BFB8!important' }} />}
            label={'All Categories'}
            variant="outlined"
        />
    );
});

export function FeedClearCategories() {
    return <CustomClearRefinements />;
}

export default FeedClearCategories;