import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Hits, Stats } from 'react-instantsearch-dom';

import CustomPagination from '@dashboard/components/CustomPagination';

import SearchResultItemCard from './SearchResultItemCard';

const useStyles = makeStyles({
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
    },
});

function ResultWrapper(props: any) {
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
    return (
        <div className={classes.container}>
            <Typography variant={'subtitle2'} className={classes.searchLabel}>
                <Stats
                    translations={{
                        stats(nbHits, processingTimeMS, nbSortedHits, areHitsSorted) {
                            // This condition will be true when we'll implement different filtering methods for cards
                            return areHitsSorted && nbHits !== nbSortedHits
                                ? `${nbSortedHits!.toLocaleString()} relevant results sorted out of ${nbHits.toLocaleString()} found in ${processingTimeMS.toLocaleString()}ms`
                                : `${nbHits.toLocaleString()} results found in ${processingTimeMS.toLocaleString()}ms`;
                        },
                    }}
                />
            </Typography>
            <Paper className={classes.resultsContainer} variant={'outlined'}>
                <Hits hitComponent={ResultWrapper} />
                <CustomPagination />
            </Paper>
        </div>
    );
}

export default CardsSearchResults;
