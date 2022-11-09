import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import { useDispatch } from 'react-redux';
import theme from '@shared/styles/theme';
import { removeCategoryValue, setFilterDecrement } from '../../redux/slices/feedSlice';
import FeedClearCategories from './FeedClearCategories';
import FeedCurrentGradeFilter from './FeedCurrentGradeFilter';

const CurrentRefinementBox = styled(Box)({
    '.CurrentFilterList': {
        display: 'inline-flex',
        flexWrap: 'wrap',
    },
    '.Chip': {
        width: '100%',
        height: '40px',
        background: 'rgba(32, 191, 184, 0.08)',
        border: '1px solid #20BFB8',
        boxSizing: 'border-box',
        borderRadius: '24px',
        cursor: 'pointer',
        color: '#20BFB8',
        fontWeight: 'bold',
        padding: '10px 12px',
    },
    '.List': {
        margin: '10px 10px',
        [theme.breakpoints.down('sm')]: {
            margin: '1px 10px 10px 0px',
        },
    },
});

const styles = {
    FiltersDiv: {
        marginTop: '-10px',
        marginBottom: '40px',
        [theme.breakpoints.down('sm')]: {
            marginTop: '0px',
            marginBottom: '10px',
        },
    },
};

const CustomCurrentRefinements = connectCurrentRefinements(({ items, refine }) => {
    const dispatch = useDispatch();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <CurrentRefinementBox>
            <ul className={'CurrentFilterList'}>
                {items.map((item) => (
                    <li key={item.label}>
                        {item.items ? (
                            <ul className={'CurrentFilterList'}>
                                {item.items.map((nested) => (
                                    <li key={nested.label} className={'List'}>
                                        <Chip
                                            key={item.label + '-chip-' + nested.label}
                                            label={nested.label}
                                            variant="outlined"
                                            onDelete={(event) => {
                                                event.preventDefault();
                                                refine(nested.value);
                                                dispatch(removeCategoryValue(nested.label));
                                                dispatch(setFilterDecrement());
                                            }}
                                            className={'Chip'}
                                            deleteIcon={
                                                <CancelRoundedIcon
                                                    sx={{
                                                        color: '#20BFB8!important',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </li>
                ))}
                {items.length > 0 ? (
                    <li>
                        <FeedCurrentGradeFilter />
                    </li>
                ) : null}
                {isSm && items.length > 0 ? (
                    <li>
                        <FeedClearCategories />
                    </li>
                ) : null}
            </ul>
        </CurrentRefinementBox>
    );
});

export function FeedCurrentFilters() {
    return (
        <Grid sx={styles.FiltersDiv}>
            <CustomCurrentRefinements />
        </Grid>
    );
}

export default FeedCurrentFilters;
