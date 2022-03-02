import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { plainToInstance } from 'class-transformer';
import React, { useCallback, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Hit } from 'react-instantsearch-core';
import { Hits, Stats } from 'react-instantsearch-dom';
import { CardsSelectionEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { fromApiPropertiesObject } from '@shared/lib/utils/fromApiPropertiesObject';
import { font } from '@shared/styles/utils';
import CustomPagination from '@dashboard/components/CustomPagination';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { markCardAsSelected, markCardAsUnselected } from '@dashboard/redux/slices/newSubmissionSlice';
import SearchResultItemCard from './SearchResultItemCard';
import { SubmissionReviewCardDialog } from './SubmissionReviewCardDialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CustomerAddCardDialog from './CustomerAddCardDialog';

const useStyles = makeStyles((theme) => ({
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

interface ResultsWrapperProps {
    hit: Hit<CardProductEntity>;
}

function ResultWrapper({ hit }: ResultsWrapperProps) {
    const dispatch = useAppDispatch();
    const [activeItem, setActiveItem] = useState<CardProductEntity | null>(null);
    const item = useMemo(() => plainToInstance(CardProductEntity, fromApiPropertiesObject(hit)), [hit]);
    const result = useMemo(() => fromApiPropertiesObject(hit._highlightResult), [hit]);
    const items = useMemo(() => (activeItem ? [activeItem] : []), [activeItem]);
    const subtitle = result.longName.value;
    const shortname = result.shortName.value;
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const isCardSelected = useMemo(
        () => !!selectedCards.find((card: Record<string, any>) => card.id === item.id),
        [item.id, selectedCards],
    );

    function generateMarkCardDto(item: CardProductEntity) {
        return {
            image: item.imagePath,
            name: item.getName(),
            shortName: item.getShortName(),
            id: item.id,
            longName: item.getLongName(),
        };
    }

    const selectCard = useCallback(
        (item: CardProductEntity) => {
            ReactGA.event({
                category: EventCategories.Cards,
                action: CardsSelectionEvents.added,
            });
            dispatch(generateMarkCardDto(item));
            dispatch(markCardAsSelected(generateMarkCardDto(item)));
        },
        [dispatch],
    );

    const deselectCard = useCallback(
        (item: CardProductEntity) => {
            ReactGA.event({
                category: EventCategories.Cards,
                action: CardsSelectionEvents.removed,
            });
            dispatch(markCardAsUnselected(generateMarkCardDto(item)));
        },
        [dispatch],
    );

    const handlePreview = useCallback(() => setActiveItem(item), [item]);
    const handleClose = useCallback(() => setActiveItem(null), []);

    const handleSelectCard = useCallback(() => {
        const isSelected = !!selectedCards.find((card: Record<string, any>) => card.id === item.id);
        if (!isSelected) {
            selectCard(item);
        } else {
            deselectCard(item);
        }
    }, [selectedCards, item, selectCard, deselectCard]);

    const handleRemove = useCallback(
        (cardProductEntity: CardProductEntity) => {
            deselectCard(cardProductEntity);
            handleClose();
        },
        [deselectCard, handleClose],
    );

    const handleAdd = useCallback(
        (cardProductEntity: CardProductEntity) => {
            selectCard(cardProductEntity);
            handleClose();
        },
        [handleClose, selectCard],
    );

    return (
        <>
            <SubmissionReviewCardDialog
                items={items}
                itemsLength={items.length}
                activeId={activeItem?.id}
                exists={isCardSelected}
                open={!!activeItem}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onClose={handleClose}
            />
            <SearchResultItemCard
                image={item.imagePath}
                name={item.getName()}
                longName={subtitle}
                shortName={shortname}
                id={item.id}
                onPreview={handlePreview}
                onSelectCard={handleSelectCard}
            />
        </>
    );
}

function CardsSearchResults() {
    const classes = useStyles();
    const [showAddCardDialog, setShowAddCardDialog] = useState<boolean | null>(null);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const ResultsWrapper = isSm ? 'div' : Paper;

    const toggleAddCardDialog = useCallback(() => {
        setShowAddCardDialog(!showAddCardDialog);
    }, [showAddCardDialog]);

    return (
        <div className={classes.container}>
            <CustomerAddCardDialog showDialog={showAddCardDialog} onClose={toggleAddCardDialog} />
            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant={'caption'} className={font.fontWeightMedium}>
                    <Stats
                        translations={{
                            stats(nbHits, processingTimeMS, nbSortedHits, areHitsSorted) {
                                // This condition will be true when we'll implement different filtering methods for cards
                                return areHitsSorted && nbHits !== nbSortedHits
                                    ? `${nbSortedHits!.toLocaleString()} relevant results sorted out of ${nbHits.toLocaleString()} found in ${processingTimeMS.toLocaleString()}ms`
                                    : `${nbHits.toLocaleString()} results`;
                            },
                        }}
                    />
                </Typography>
                <Box flexDirection={'row'}>
                    <Typography variant={'caption'} className={font.fontWeightNormal}>
                        Can't find your card?
                    </Typography>
                    <Button color={'primary'} variant="text" sx={{ fontSize: '12px' }} onClick={toggleAddCardDialog}>
                        ADD CARD MANUALLY
                    </Button>
                </Box>
            </Box>
            <ResultsWrapper className={classes.resultsContainer} variant={'outlined'}>
                <Hits hitComponent={ResultWrapper} />
                <CustomPagination />
            </ResultsWrapper>
        </div>
    );
}

export default CardsSearchResults;
