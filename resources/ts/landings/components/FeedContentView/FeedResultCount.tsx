import Typography from '@mui/material/Typography';
import theme from '@shared/styles/theme';
import { connectStats } from 'react-instantsearch-dom';

const styles = {
    CountStyle: {
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: 'rgba(0, 0, 0, 0.54)',
        [theme.breakpoints.down('sm')]: {
            margin: '13px 15px',
        },
    },
};

export function FeedResultCount() {
    const Stats = ({ nbHits }: { nbHits: any }) => (
        <Typography sx={styles.CountStyle}>{`${nbHits.toLocaleString()}  results`}</Typography>
    );

    const CustomStats = connectStats(Stats);

    return <CustomStats />;
}

export default FeedResultCount;
