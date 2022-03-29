import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { connectStats } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import theme from '@shared/styles/theme';
import { setFilterResults } from '../../redux/slices/feedSlice';

const styles = {
    CountStyle: {
        fontWeight: '500',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: 'rgba(0, 0, 0, 0.54)',
        [theme.breakpoints.down('sm')]: {
            margin: '10px 0px',
        },
    },
    searchValues: {
        fontWeight: '500',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.5px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
};

const CustomStats = connectStats(({ nbHits, query }: { nbHits: any; query: any }) => {
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    dispatch(setFilterResults(nbHits));
    return (
        <div>
            {isSm ? (
                <Typography sx={styles.searchValues}>{query ? `Search for “${query}”` : ``}</Typography>
            ) : (
                <Typography sx={styles.searchValues}>{query ? `Search results for “${query}”` : ``}</Typography>
            )}
            <Typography sx={styles.CountStyle}>
                {`${nbHits.toLocaleString()}  ${query ? `results` : `cards`}`}
            </Typography>
        </div>
    );
});

export function FeedResultCount({ query }: { query: any }) {
    return <CustomStats query={query} />;
}

export default FeedResultCount;
