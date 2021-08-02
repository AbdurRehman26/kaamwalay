import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Divider, IconButton, Tooltip} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {markCardAsSelected, markCardAsUnselected, SearchResultItemCardProps} from "../Redux/Slices/newSubmissionSlice";
import {useAppDispatch, useAppSelector} from "../hooks";

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px',
        paddingTop: '8px',
        marginTop: '8px',
    },
    leftSide: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
    },
    rightSide: {},
    pictureContainer: {},
    cardMetadataContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '8px',
    },
    cardImage: {
        width: '40px',
        height: '56px',
        imageRendering: 'pixelated'
    },
    title: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    subtitle: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.54)"
    }
})


function SearchResultItemCard(props: SearchResultItemCardProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const {image, title, subtitle, id, addedMode} = props;
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    function selectCard() {
        dispatch(markCardAsSelected({image, title, subtitle, id}))
    }

    function deselectCard() {
        dispatch(markCardAsUnselected({image, title, subtitle, id}))
    }

    return (
        <>
            <div className={classes.container}>
                <div className={classes.leftSide}>
                    <div className={classes.pictureContainer}>
                        <img src={image} alt={'Charizard'} className={classes.cardImage}/>
                    </div>
                    <div className={classes.cardMetadataContainer}>
                        <Typography variant={'subtitle2'} className={classes.title}>{title}</Typography>
                        <Typography variant={'subtitle2'} className={classes.subtitle}>{subtitle}</Typography>
                    </div>
                </div>
                {!addedMode ? <div className={classes.rightSide}>
                    <IconButton aria-label="delete">
                        {selectedCards.find(card => card.id === id) ?
                            <Tooltip title="Remove">
                                <CheckCircleIcon htmlColor={'#20BFB8'} onClick={deselectCard}/>
                            </Tooltip>
                            : <Tooltip title="Add">
                                <AddCircleOutlineIcon htmlColor={'#20BFB8'} onClick={selectCard}/>
                            </Tooltip>
                        }
                    </IconButton>
                </div> : null}

            </div>
            {!addedMode ? <Divider light/>
                : null}
        </>
    )
}

export default SearchResultItemCard;
