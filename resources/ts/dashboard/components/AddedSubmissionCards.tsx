import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { plainToClass } from 'class-transformer';
import React, { useCallback, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { CardsSelectionEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { SubmissionReviewCardDialog } from '@dashboard/components/SubmissionReviewCardDialog';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    changeSelectedCardQty,
    changeSelectedCardValue,
    markCardAsUnselected,
    SearchResultItemCardProps,
    setCustomStep,
} from '../redux/slices/newSubmissionSlice';
import SearchResultItemCard from './SearchResultItemCard';

const useStyles = makeStyles((theme) => ({
    addedCardsContainer: {
        marginTop: '32px',
        padding: '16px',
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
}));

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
        />
    );
}

type AddedSubmissionCardsProps = {
    reviewMode?: boolean;
    mobileMode?: boolean;
};

function AddedSubmissionCards(props: AddedSubmissionCardsProps) {
    const { reviewMode, mobileMode } = props;
    const [activeItem, setActiveItem] = useState<CardProductEntity | null>(null);
    const classes = useStyles();
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();

    const selectedCardEntities = useMemo(
        () =>
            selectedCards.map((item) =>
                plainToClass(CardProductEntity, {
                    id: item.id,
                    name: item.title,
                    cardCategoryName: item.subtitle,
                    imagePath: item.image,
                    shortName: item.title,
                    fullName: item.subtitle,
                }),
            ),
        [selectedCards],
    );

    const handleDeselectCard = useCallback(
        (row: { id: number }) => {
            ReactGA.event({ category: EventCategories.Cards, action: CardsSelectionEvents.removed });
            dispatch(markCardAsUnselected(row));
        },
        [dispatch],
    );

    function handleChangeCardQty(card: SearchResultItemCardProps, qty: any) {
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
    const handleClose = useCallback(() => setActiveItem(null), []);

    const handleRemove = useCallback(
        (cardProductEntity: CardProductEntity) => {
            const currentIndex = selectedCardEntities.findIndex((item) => item.id === activeItem?.id);
            const nextItem = selectedCardEntities[currentIndex + 1];

            handleDeselectCard(cardProductEntity);
            if (nextItem) {
                handlePreview(nextItem.id);
            } else {
                handleClose();
            }
        },
        [activeItem, handleClose, handleDeselectCard, handlePreview, selectedCardEntities],
    );

    if (selectedCards.length === 0) {
        return (
            <Paper className={classes.addedCardsContainer} variant={'outlined'}>
                <Typography variant={'subtitle2'} className={classes.label}>
                    Added Card(s)
                </Typography>
                <div className={classes.emptyStateContainer}>
                    <Typography variant={'subtitle1'} className={classes.emptyStateText}>
                        No cards have been added yet.
                    </Typography>
                </div>
            </Paper>
        );
    }

    function onEditPress() {
        dispatch(setCustomStep(1));
    }

    return (
        <Paper className={classes.addedCardsContainer} variant={'outlined'}>
            <div className={classes.titleContainer}>
                <Typography variant={'subtitle2'} className={classes.label}>
                    {reviewMode ? 'Card(s) in Submission' : 'Added Card(s)'}
                </Typography>
                {reviewMode ? (
                    <Typography className={classes.editBtn} onClick={onEditPress}>
                        EDIT
                    </Typography>
                ) : null}
            </div>

            <SubmissionReviewCardDialog
                items={selectedCardEntities}
                itemsLength={selectedCardEntities.length}
                activeId={activeItem?.id}
                exists={findCard(activeItem?.id)}
                open={!!activeItem}
                onRemove={handleRemove}
                onClose={handleClose}
                onChangeId={handlePreview}
            />

            {mobileMode && !reviewMode ? (
                <>
                    {selectedCards.map((row: SearchResultItemCardProps) => (
                        <>
                            <div className={classes.mobileViewContainer}>
                                <div title={row.shortname || row.title}>
                                    <SearchResultItemCard
                                        onPreview={handlePreview}
                                        key={row.id}
                                        id={row.id}
                                        image={row.image}
                                        subtitle={row.subtitle}
                                        shortname={row.shortname}
                                        title={row.title}
                                        addedMode
                                        reviewMode
                                    />
                                </div>

                                <div className={classes.mobileViewCardActions}>
                                    <div className={classes.mobileViewCardActionContainer}>
                                        <Typography variant={'caption'} className={classes.actionLabel}>
                                            Qty
                                        </Typography>
                                        <TextField
                                            onChange={(e) => handleChangeCardQty(row, Number(e.target.value))}
                                            type="number"
                                            size={'small'}
                                            value={row.qty}
                                            InputProps={{
                                                inputProps: { min: 1 },
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            className={classes.qtyField}
                                            variant="outlined"
                                        />
                                    </div>

                                    <div className={classes.mobileViewCardActionContainer}>
                                        <Typography variant={'caption'} className={classes.actionLabel}>
                                            Value (USD)
                                        </Typography>
                                        <TextField
                                            value={row.value}
                                            onChange={(e) => handleChangeCardValue(row, Number(e.target.value))}
                                            name="numberformat"
                                            size="small"
                                            id="formatted-numberformat-input"
                                            variant="outlined"
                                            InputProps={{
                                                inputComponent: NumberFormatCustom as any,
                                                inputProps: { min: 1 },
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            className={classes.valueField}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Divider light />
                        </>
                    ))}
                </>
            ) : (
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Qty</TableCell>
                            <TableCell align="left">Card(s)</TableCell>
                            <TableCell align="right">Value (USD) </TableCell>
                            {!reviewMode ? <TableCell align="left"> </TableCell> : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedCards.map((row: SearchResultItemCardProps) => (
                            <>
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row" align={'left'}>
                                        {!reviewMode ? (
                                            <TextField
                                                onChange={(e) => handleChangeCardQty(row, Number(e.target.value))}
                                                type="number"
                                                size={'small'}
                                                value={row.qty}
                                                InputProps={{
                                                    inputProps: { min: 1 },
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                className={classes.qtyField}
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant={'subtitle1'} className={classes.tableRowText}>
                                                {row.qty}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="left">
                                        <SearchResultItemCard
                                            onPreview={handlePreview}
                                            key={row.id}
                                            id={row.id}
                                            image={row.image}
                                            subtitle={row.subtitle}
                                            shortname={row.shortname}
                                            title={row.title}
                                            addedMode
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {!reviewMode ? (
                                            <TextField
                                                value={row.value}
                                                onChange={(e) => handleChangeCardValue(row, Number(e.target.value))}
                                                name="numberformat"
                                                size="small"
                                                id="formatted-numberformat-input"
                                                variant="outlined"
                                                InputProps={{
                                                    inputComponent: NumberFormatCustom as any,
                                                    inputProps: { min: 1 },
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                            />
                                        ) : (
                                            <NumberFormat
                                                value={row.value}
                                                displayType={'text'}
                                                thousandSeparator
                                                decimalSeparator={'.'}
                                                prefix={'$'}
                                                className={classes.tableRowText}
                                            />
                                        )}
                                    </TableCell>
                                    {!reviewMode ? (
                                        <TableCell align="left">
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleDeselectCard(row)}
                                                size="large"
                                            >
                                                <DeleteIcon fontSize="medium" />
                                            </IconButton>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Paper>
    );
}

export default AddedSubmissionCards;
