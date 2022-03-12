import Typography from '@mui/material/Typography';
import { connectStats } from 'react-instantsearch-dom';

export function FeedResultCount() {
    const Stats = ({ nbHits }) => <Typography>{`${nbHits.toLocaleString()}  results`}</Typography>;

    const CustomStats = connectStats(Stats);

    return <CustomStats />;
}

export default FeedResultCount;
