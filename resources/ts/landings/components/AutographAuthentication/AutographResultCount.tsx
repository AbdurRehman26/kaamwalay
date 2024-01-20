import Typography from '@mui/material/Typography';
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
        margin: '10px 10px',
        [theme.breakpoints.down('sm')]: {
            margin: '10px 0px',
        },
    },
    searchValues: {
        fontWeight: '500',
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.5px',
        color: 'rgba(0, 0, 0, 0.87)',
        margin: '10px 10px',
        [theme.breakpoints.down('sm')]: {
            margin: '0px 0px',
        },
    },
};

const CustomStats = connectStats(({ nbHits, query }: { nbHits: any; query: any }) => {
    const dispatch = useDispatch();
    dispatch(setFilterResults(nbHits));

    return (
        <div>
            <Typography sx={styles.searchValues}>
                {query ? `${nbHits.toLocaleString()} Results for ` : ``}
                {query && (
                    <span style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.54)', fontWeight: 'normal' }}>
                        “{query}”
                    </span>
                )}
            </Typography>
        </div>
    );
});

export function AutographResultCount({ query }: { query: any }) {
    return <CustomStats query={query} />;
}

export default AutographResultCount;
