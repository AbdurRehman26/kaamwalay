import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo } from 'react';
import ReactGA from 'react-ga';
import { CardsSelectionEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { getStringTruncated } from '@shared/lib/utils/getStringTruncated';
import { font } from '@shared/styles/utils';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { markCardAsUnselected } from '../redux/slices/newSubmissionSlice';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        marginTop: '8px',
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
    },
    leftSide: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    rightSide: {
        display: 'flex',
        alignItems: 'center',
    },
    rightSideMobile: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    pictureContainer: {
        position: 'relative',
    },
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
    subtitle: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '12px',
        },
    },
    shortNameContainer: {
        maxWidth: '80%',
        textOverflow: 'ellipsis',
    },
    shortName: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '14px',
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    previewOverlay: {
        backgroundColor: 'rgba(64, 64, 64, 0.6)',
        color: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        transition: theme.transitions.create('opacity'),
        '&:hover': {
            opacity: 1,
        },
    },
}));

type SearchResultItemCardProps = {
    image: string;
    longName: any;
    shortName?: any;
    name: string;
    addedMode?: boolean;
    reviewMode?: boolean;
    id: any;
    onPreview?: (id: number) => void;
    onSelectCard?: () => void;
};

function SearchResultItemCard(props: SearchResultItemCardProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const { image, name, longName, id, addedMode, reviewMode, onPreview, onSelectCard } = props;
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const isCardSelected = selectedCards.find((card: Record<string, any>) => card.id === id);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const handlePreview = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (onPreview) {
                onPreview(id);
            }
        },
        [id, onPreview],
    );

    function handleMobileDeselect() {
        const state = { image, name, longName, id };

        ReactGA.event({
            category: EventCategories.Cards,
            action: CardsSelectionEvents.removed,
        });
        dispatch(markCardAsUnselected(state));
    }

    const RootComponent = addedMode ? 'div' : ButtonBase;

    const shortNameWithoutHtmlTags = useMemo(() => props.shortName.replace(/<[^>]*>?/gm, ''), [props.shortName]);
    return (
        <>
            <RootComponent className={classes.container} onClick={onSelectCard}>
                <div className={classes.leftSide}>
                    <div className={classes.pictureContainer}>
                        <img src={image} alt={name} className={classes.cardImage} />

                        {onPreview ? (
                            <ButtonBase component={'a'} onClick={handlePreview} className={classes.previewOverlay}>
                                <VisibilityIcon color={'inherit'} fontSize={'small'} />
                            </ButtonBase>
                        ) : null}
                    </div>
                    <div className={classes.cardMetadataContainer}>
                        <Typography variant={'body2'} className={font.fontWeightBold} align={'left'}>
                            {name}
                        </Typography>
                        {/* Using dangerouslySetInnerHTML is completely safe here, because this data is coming from algolia
                        the client has no control over this data, therefore it won't result in an XSS.
                        We're using this because algolia is giving us the highlighted elements wrapper in <ais-highlight-0000000000 />
                        which we can then style to display the searched term bolded in the results*/}
                        <div title={shortNameWithoutHtmlTags}>
                            <Typography
                                variant={'body2'}
                                color={'textSecondary'}
                                className={classes.shortName}
                                align={'left'}
                                dangerouslySetInnerHTML={{
                                    __html: getStringTruncated(
                                        shortNameWithoutHtmlTags,
                                        isMobile ? 30 : addedMode ? 50 : 70,
                                    ),
                                }}
                            />
                        </div>

                        <Typography
                            variant={'body2'}
                            color={'textSecondary'}
                            className={classes.subtitle}
                            align={'left'}
                            dangerouslySetInnerHTML={{ __html: props.longName }}
                        />
                    </div>
                </div>
                {addedMode && isMobile && reviewMode ? (
                    <div className={classes.rightSideMobile}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleMobileDeselect}
                            aria-label="close"
                            size="large"
                        >
                            <DeleteOutlineOutlinedIcon fontSize="medium" />
                        </IconButton>
                    </div>
                ) : null}

                {!addedMode ? (
                    <div className={classes.rightSide}>
                        {isCardSelected ? (
                            <Tooltip title="Remove">
                                <CheckCircleIcon htmlColor={'#20BFB8'} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Add">
                                <AddCircleOutlineIcon htmlColor={'#20BFB8'} />
                            </Tooltip>
                        )}
                    </div>
                ) : null}
            </RootComponent>
            {!addedMode ? <Divider light /> : null}
        </>
    );
}

export default SearchResultItemCard;
