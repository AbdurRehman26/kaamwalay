import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { connectCurrentRefinements } from 'react-instantsearch-dom';

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
    },
});

const CustomCurrentRefinements = connectCurrentRefinements(({ items, refine }) => {
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
                                            onClick={(event) => {
                                                event.preventDefault();
                                                refine(nested.value);
                                            }}
                                            onDelete={(event) => {
                                                event.preventDefault();
                                                refine(nested.value);
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
            </ul>
        </CurrentRefinementBox>
    );
});

export function FeedCurrentFilters() {
    return (
        <Grid sx={{ marginTop: '-10px', marginBottom: '40px' }}>
            <CustomCurrentRefinements />
        </Grid>
    );
}

export default FeedCurrentFilters;
