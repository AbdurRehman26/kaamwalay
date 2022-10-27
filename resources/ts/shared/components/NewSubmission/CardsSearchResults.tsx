import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { plainToInstance } from 'class-transformer';
import React, { useCallback, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Hit } from 'react-instantsearch-core';
import { Hits, Stats } from 'react-instantsearch-dom';
import { AuthDialog } from '@shared/components/AuthDialog';
import { CardsSelectionEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useAuth } from '@shared/hooks/useAuth';
import { useNotifications } from '@shared/hooks/useNotifications';
import { fromApiPropertiesObject } from '@shared/lib/utils/fromApiPropertiesObject';
import {
    markCardAsSelected,
    markCardAsUnselected,
    setCardsSearchValue,
} from '@shared/redux/slices/adminCreateOrderSlice';
import { font } from '@shared/styles/utils';
import CardAddDialog from '@admin/pages/Cards/CardAddDialog';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import CustomPagination from './CustomPagination';
import SearchResultItemCard from './SearchResultItemCard';

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
    const item = useMemo(() => plainToInstance(CardProductEntity, fromApiPropertiesObject(hit)), [hit]);
    const result = useMemo(() => fromApiPropertiesObject(hit._highlightResult), [hit]);
    const subtitle = result.longName.value;
    const shortname = result.shortName.value;
    const selectedCards = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.selectedCards);

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

    const handleSelectCard = useCallback(() => {
        const isSelected = !!selectedCards.find((card: Record<string, any>) => card.id === item.id);
        if (!isSelected) {
            selectCard(item);
        } else {
            deselectCard(item);
        }
        setTimeout(() => {
            dispatch(setCardsSearchValue(''));
            (window as any).globalThis.clearSearch();
        }, 500);
    }, [selectedCards, item, selectCard, deselectCard, dispatch]);

    return (
        <>
            <SearchResultItemCard
                image={item.imagePath}
                name={item.getName()}
                longName={subtitle}
                shortName={shortname}
                id={item.id}
                onSelectCard={handleSelectCard}
            />
        </>
    );
}

export function CardsSearchResults() {
    const classes = useStyles();
    const [showAddCardDialog, setShowAddCardDialog] = useState(false);
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const ResultsWrapper = isSm ? 'div' : Paper;
    const { authenticated, authDialogProps, openAuthDialog } = useAuth();
    const notifications = useNotifications();

    const toggleAddCardDialog = useCallback(() => {
        if (!showAddCardDialog && !authenticated) {
            openAuthDialog();
            return;
        }
        setShowAddCardDialog(!showAddCardDialog);
    }, [setShowAddCardDialog, authenticated, openAuthDialog, showAddCardDialog]);

    const handleAddSubmit = async () => {
        try {
            setShowAddCardDialog(false);
            window.location.reload();
        } catch (e: any) {
            notifications.exception(e);
        }
    };

    return (
        <div className={classes.container}>
            <CardAddDialog onSubmit={handleAddSubmit} open={showAddCardDialog} onClose={toggleAddCardDialog} />
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
            <AuthDialog
                {...authDialogProps}
                subtitle={'In order to add cards manually, you need to login with a Robograding account.'}
            />
        </div>
    );
}

export default CardsSearchResults;
