import { connectCurrentRefinements } from 'react-instantsearch-dom';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';

const styles = {
    customStyle: {
        width: '100%',
        height: '40px',
        background: '#F4F4FB',
        border: '1px solid rgba(0, 0, 0, 0.18)',
        boxSizing: 'border-box',
        borderRadius: '24px',
        padding: '10px 10px',
        cursor: 'pointer',
    },
};

export function FeedClearCategories() {
    const ClearRefinements = ({ items, refine }) => (
        <Chip
            onClick={() => refine(items)}
            sx={styles.customStyle}
            icon={<DoneIcon />}
            label={'All Categories'}
            variant="outlined"
        />
    );

    const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);
    return <CustomClearRefinements />;
}

export default FeedClearCategories;
