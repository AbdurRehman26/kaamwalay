import { connectCurrentRefinements } from 'react-instantsearch-dom';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';

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

export function FeedClearCategories() {
    const ClearRefinements = ({ items, refine }: { items: any; refine: any }) => (
        <Chip
            onClick={() => refine(items)}
            sx={styles.ChipSelected}
            icon={<DoneIcon sx={{ color: '#20BFB8!important', fontWeight: 'bold' }} />}
            label={'All Categories'}
            variant="outlined"
        />
    );

    const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);
    return <CustomClearRefinements />;
}

export default FeedClearCategories;
