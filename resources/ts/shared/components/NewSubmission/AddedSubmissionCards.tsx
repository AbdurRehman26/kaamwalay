import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { plainToInstance } from 'class-transformer';
import React, { useCallback, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { NumberFormatTextField } from '@shared/components/NumberFormatTextField';
import { CardsSelectionEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import {
    SearchResultItemCardProps,
    changeSelectedCardQty,
    changeSelectedCardValue,
    markCardAsUnselected, // setCustomStep,
} from '@shared/redux/slices/adminCreateOrderSlice';
// import { SubmissionReviewCardDialog } from '@dashboard/components/SubmissionReviewCardDialog';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
import SearchResultItemCard from './SearchResultItemCard';

const useStyles = makeStyles((theme) => ({
    addedCardsContainer: {
        border: '1px solid #E0E0E0',
        borderWidth: '0 1px 1px',
    },
    label: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    emptyStateContainer: {
        width: '100%',
        height: '153px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    qtyField: {
        width: '80px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    valueField: {
        width: '150px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    table: {
        minWidth: '100%',
    },
    row: {
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    },
    editBtn: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        marginLeft: '12px',
        '&:hover': {
            cursor: 'pointer',
        },
        color: '#20BFB8',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tableRowText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'right',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    mobileViewContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
    },
    mobileViewCardActionContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%',
    },
    mobileViewCardActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '24px',
        marginBottom: '12px',
    },
    actionLabel: {
        fontWeight: 'bold',
        marginBottom: '6px',
    },
    textColorSecondary: {
        color: '#0000008A',
    },
}));

type AddedSubmissionCardsProps = {
    reviewMode?: boolean;
    mobileMode?: boolean;
};

export function AddedSubmissionCards(props: AddedSubmissionCardsProps) {
    const [activeItem, setActiveItem] = useState<CardProductEntity | null>(null);
    const [showQuantity, setShowQuantity] = useState<boolean>(true);
    const [onChangeValue, setOnChangeValue] = useState<number>(0);
    const classes = useStyles();
    const selectedCards = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.selectedCards);
    const dispatch = useAppDispatch();

    const selectedCardEntities = useMemo(
        () =>
            selectedCards.map((item) =>
                plainToInstance(CardProductEntity, {
                    id: item.id,
                    name: item.name,
                    imagePath: item.image,
                    shortName: item.shortName,
                    longName: item.longName,
                }),
            ),
        [selectedCards],
    );
    console.log('Active item ', activeItem);
    const handleDeselectCard = useCallback(
        (row: { id: number }) => {
            ReactGA.event({ category: EventCategories.Cards, action: CardsSelectionEvents.removed });
            dispatch(markCardAsUnselected(row));
        },
        [dispatch],
    );

    function handleChange(card: SearchResultItemCardProps, qty: any) {
        const value = qty.replace(/[^\d]/, '');
        setOnChangeValue(value);
        setShowQuantity(false);
        dispatch(changeSelectedCardQty({ card, qty: value }));
    }

    function handleChangeCardQty(card: SearchResultItemCardProps, qty: any) {
        setShowQuantity(true);
        const newValue = Math.min(Math.max(qty, 1), 100);
        dispatch(changeSelectedCardQty({ card, qty: newValue }));
    }

    function handleChangeCardValue(card: SearchResultItemCardProps, newValue: any) {
        // replace non-digits with, if user enters a decimal
        const receivedValue = String(newValue).replace(/[^\d]/, '');
        const valueAsInt = parseInt(receivedValue);
        const finalValue = Math.min(Math.max(valueAsInt, 1), 1000000);
        dispatch(changeSelectedCardValue({ card, newValue: finalValue }));
    }

    const findCard = useCallback(
        (id?: number): any => selectedCardEntities.find((cardItem) => cardItem.id === id) ?? null,
        [selectedCardEntities],
    );

    const handlePreview = useCallback((id: number) => setActiveItem(findCard(id)), [findCard]);
    // const handleClose = useCallback(() => setActiveItem(null), []);

    // const handleRemove = useCallback(
    //     (cardProductEntity: CardProductEntity) => {
    //         const currentIndex = selectedCardEntities.findIndex((item) => item.id === activeItem?.id);
    //         const nextItem = selectedCardEntities[currentIndex + 1];

    //         handleDeselectCard(cardProductEntity);
    //         if (nextItem) {
    //             handlePreview(nextItem.id);
    //         } else {
    //             handleClose();
    //         }
    //     },
    //     [activeItem, handleClose, handleDeselectCard, handlePreview, selectedCardEntities],
    // );

    return (
        <div className={classes.addedCardsContainer}>
            <Grid sx={{ borderBottom: '1px solid #E0E0E0' }} container alignItems={'center'} p={2}>
                <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>Added Cards</Typography>
                <IconButton sx={{ marginLeft: 'auto' }}>
                    <ClearAllOutlinedIcon />
                </IconButton>
            </Grid>
            {selectedCards
                .slice()
                .reverse()
                .map((row: SearchResultItemCardProps) => (
                    <>
                        <Grid p={1}>
                            <Grid item display={'flex'} flexDirection={'row'}>
                                <Grid md={11}>
                                    <SearchResultItemCard
                                        onPreview={handlePreview}
                                        key={row.id}
                                        id={row.id}
                                        image={row.image}
                                        longName={row.longName}
                                        shortName={row.shortName}
                                        name={row.name}
                                        addedMode
                                    />
                                </Grid>
                                <Grid md={1}>
                                    <IconButton
                                        sx={{ color: '#0000008A' }}
                                        aria-label="delete"
                                        onClick={() => handleDeselectCard(row)}
                                        size="large"
                                    >
                                        <DeleteIcon fontSize="medium" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid mt={1} ml={1} item display={'flex'} flexDirection={'row'} mb={3}>
                                <Grid item md={6}>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 500 }} mb={0.5}>
                                        Qty
                                    </Typography>
                                    <TextField
                                        onChange={(e) => handleChange(row, e.target.value)}
                                        onBlur={(e) => handleChangeCardQty(row, Number(e.target.value))}
                                        type="number"
                                        size={'small'}
                                        value={showQuantity ? row.qty : onChangeValue}
                                        InputProps={{
                                            inputProps: { min: 0 },
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.qtyField}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 500 }} mb={0.5}>
                                        Value <span className={classes.textColorSecondary}>(USD)</span>
                                    </Typography>
                                    <NumberFormatTextField
                                        value={row.value}
                                        onChange={(e) => handleChangeCardValue(row, e.target.value)}
                                        name="numberformat"
                                        size="small"
                                        id="formatted-numberformat-input"
                                        variant="outlined"
                                        InputProps={{
                                            inputProps: { min: 1 },
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        {selectedCards[selectedCards.length - 1].id === row.id ? <Divider /> : null}
                    </>
                ))}
        </div>
    );
}

export default AddedSubmissionCards;
