import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import ReactGA from 'react-ga';
import NumberFormat from 'react-number-format';
import { CardsSelectionEvents, EventCategories } from '@dashboard/components/GoogleAnalyticsWrapper/GAEventsTypes';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    changeSelectedCardQty,
    changeSelectedCardValue,
    markCardAsUnselected,
    SearchResultItemCardProps,
    setCustomStep,
} from '../redux/slices/newSubmissionSlice';
import SearchResultItemCard from './SearchResultItemCard';

const useStyles = makeStyles({
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
    },
    valueField: {
        width: '150px',
    },
    table: {
        minWidth: 650,
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
});

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
};

function AddedSubmissionCards(props: AddedSubmissionCardsProps) {
    const classes = useStyles();
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards);
    const dispatch = useAppDispatch();
    const { reviewMode } = props;

    function onDeselectCard(row: SearchResultItemCardProps) {
        ReactGA.event({ category: EventCategories.Cards, action: CardsSelectionEvents.removed });
        dispatch(markCardAsUnselected(row));
    }

    function onChangeCardQty(card: SearchResultItemCardProps, qty: any) {
        const newValue = Math.min(Math.max(qty, 1), 100);
        dispatch(changeSelectedCardQty({ card, qty: newValue }));
    }

    function onChangeCardValue(card: SearchResultItemCardProps, newValue: any) {
        // replace non-digits with, if user enters a decimal
        const receivedValue = String(newValue).replace(/[^\d]/, '');
        const valueAsInt = parseInt(receivedValue);
        const finalValue = Math.min(Math.max(valueAsInt, 1), 1000000);
        dispatch(changeSelectedCardValue({ card, newValue: finalValue }));
    }

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

            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Qty</TableCell>
                        <TableCell align="left">Card(s)</TableCell>
                        <TableCell align="left">Value (USD) </TableCell>
                        <TableCell align="left"> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {selectedCards.map((row: SearchResultItemCardProps) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                {!reviewMode ? (
                                    <TextField
                                        onChange={(e) => onChangeCardQty(row, Number(e.target.value))}
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
                                    key={row.id}
                                    id={row.id}
                                    image={row.image}
                                    subtitle={row.subtitle}
                                    title={row.title}
                                    addedMode
                                />
                            </TableCell>
                            <TableCell align="left">
                                {!reviewMode ? (
                                    <TextField
                                        value={row.value}
                                        onChange={(e) => onChangeCardValue(row, Number(e.target.value))}
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
                                    <IconButton aria-label="delete" onClick={() => onDeselectCard(row)}>
                                        <DeleteIcon fontSize="medium" />
                                    </IconButton>
                                </TableCell>
                            ) : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default AddedSubmissionCards;
