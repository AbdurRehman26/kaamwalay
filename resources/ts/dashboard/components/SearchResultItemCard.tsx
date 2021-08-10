import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { markCardAsSelected, markCardAsUnselected } from '../redux/slices/newSubmissionSlice';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px',
        paddingTop: '8px',
        marginTop: '8px',
    },
    leftSide: {
        display: 'flex',
        flexDirection: 'row',
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
        imageRendering: 'pixelated',
    },
    title: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    subtitle: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
});

type SearchResultItemCardProps = {
    image: string;
    subtitle: any;
    title: string;
    addedMode?: boolean;
    id: any;
};
function SearchResultItemCard(props: SearchResultItemCardProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { image, title, subtitle, id, addedMode } = props;
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);

    function selectCard() {
        dispatch(markCardAsSelected({ image, title, subtitle, id }));
    }

    function deselectCard() {
        dispatch(markCardAsUnselected({ image, title, subtitle, id }));
    }

    return (
        <>
            <div className={classes.container}>
                <div className={classes.leftSide}>
                    <div className={classes.pictureContainer}>
                        <img src={image} alt={'Charizard'} className={classes.cardImage} />
                    </div>
                    <div className={classes.cardMetadataContainer}>
                        <Typography variant={'subtitle2'} className={classes.title}>
                            {title}
                        </Typography>

                        {/* Using dangerouslySetInnerHTML is completely safe here, because this data is coming from algolia
                            the client has no control over this data, therefore it won't result in an XSS.
                            We're using this because algolia is giving us the highlighted elements wrapper in <ais-highlight-0000000000 />
                            which we can then style to display the searched term bolded in the results*/}
                        <Typography
                            variant={'subtitle2'}
                            className={classes.subtitle}
                            dangerouslySetInnerHTML={{ __html: props.subtitle }}
                        ></Typography>
                    </div>
                </div>
                {!addedMode ? (
                    <div className={classes.rightSide}>
                        <IconButton aria-label="delete">
                            {selectedCards.find((card: Record<string, any>) => card.id === id) ? (
                                <Tooltip title="Remove">
                                    <CheckCircleIcon htmlColor={'#20BFB8'} onClick={deselectCard} />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Add">
                                    <AddCircleOutlineIcon htmlColor={'#20BFB8'} onClick={selectCard} />
                                </Tooltip>
                            )}
                        </IconButton>
                    </div>
                ) : null}
            </div>
            {!addedMode ? <Divider light /> : null}
        </>
    );
}

export default SearchResultItemCard;
