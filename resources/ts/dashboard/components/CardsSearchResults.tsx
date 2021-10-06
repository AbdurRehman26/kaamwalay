import { useMediaQuery } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Hits, Stats } from 'react-instantsearch-dom';
import CustomPagination from '@dashboard/components/CustomPagination';
import SearchResultItemCard from './SearchResultItemCard';

const useStyles = makeStyles((theme) => ({
    searchLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    container: {
        marginTop: '24px',
        '& ais-highlight-0000000000': {
            color: '#000',
            fontWeight: 'bold',
        },
    },
    resultsContainer: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        maxHeight: '454px',
        overflowY: 'scroll',
        '& ul': {
            listStyle: 'none',
            padding: 0,
        },
        [theme.breakpoints.down('sm')]: {
            maxHeight: '80vh',
            paddingLeft: 0,
            paddingRight: 0,
        },
    },
}));

function ResultWrapper(props: any) {
    // TODO: Transform hit to the right type.
    return (
        <SearchResultItemCard
            image={props.hit.image_path}
            title={props.hit.name}
            subtitle={`${props.hit._highlightResult.release_year.value}
                                             ${props.hit._highlightResult.card_category_name.value}
                                             ${props.hit._highlightResult.card_series_name.value}
                                             ${props.hit._highlightResult.card_set_name.value}
                                             ${props.hit._highlightResult.card_number_order.value}
                                             ${props.hit._highlightResult.name.value}`}
            id={props.hit.id}
        />
    );
}

function CardsSearchResults() {
    const classes = useStyles();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const ResultsWrapper = isMobile ? 'div' : Paper;
    return (
        <div className={classes.container}>
            <Typography variant={'subtitle2'} className={classes.searchLabel}>
                <Stats
                    translations={{
                        stats(nbHits, processingTimeMS, nbSortedHits, areHitsSorted) {
                            // This condition will be true when we'll implement different filtering methods for cards
                            return areHitsSorted && nbHits !== nbSortedHits
                                ? `${nbSortedHits!.toLocaleString()} relevant results sorted out of ${nbHits.toLocaleString()} found in ${processingTimeMS.toLocaleString()}ms`
                                : `${nbHits.toLocaleString()} results found`;
                        },
                    }}
                />
            </Typography>
            <ResultsWrapper className={classes.resultsContainer} variant={'outlined'}>
                <Hits hitComponent={ResultWrapper} />
                <CustomPagination />
            </ResultsWrapper>
        </div>
    );
}

export default CardsSearchResults;
