import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import SearchResultItemCard from "./SearchResultItemCard";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {useAppSelector} from "../hooks";

const useStyles = makeStyles({
    searchLabel: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "16px",
        letterSpacing: "0.1px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    container: {
        marginTop: '24px',
    },
    resultsContainer: {
        paddingTop: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        maxHeight: '454px',
        overflowY: 'scroll',
    }
})

function CardsSearchResults() {

    const classes = useStyles();
    const searchResults = useAppSelector((state) => state.newSubmission.step02Data.searchResults);

    return (
        <div className={classes.container}>
            <Typography variant={'subtitle2'} className={classes.searchLabel}>88 Results</Typography>
            <Paper className={classes.resultsContainer} variant={'outlined'}>

                {searchResults.map((result) => <SearchResultItemCard key={result.id} id={result.id} image={result.image}
                                                                     subtitle={result.subtitle} title={result.title}/>
                )}
            </Paper>

        </div>
    )
}

export default CardsSearchResults