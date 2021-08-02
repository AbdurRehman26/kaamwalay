import React from 'react';
import {
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {useAppDispatch, useAppSelector} from "../hooks";
import SearchResultItemCard from "./SearchResultItemCard";
import DeleteIcon from '@material-ui/icons/Delete';
import NumberFormat from 'react-number-format';

import {
    changeSelectedCardQty, changeSelectedCardValue,
    markCardAsUnselected,
    SearchResultItemCardProps,
} from "../Redux/Slices/newSubmissionSlice";

const useStyles = makeStyles({
    addedCardsContainer: {
        marginTop: '32px',
        padding: '16px',
    },
    label: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "24px",
        letterSpacing: "0.1px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    emptyStateContainer: {
        width: '100%',
        height: '153px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "20px",
        textAlign: "center",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.54)"
    },
    qtyField: {
        width: '80px',
    },
    valueField: {
        width: '150px'
    },
    table: {
        minWidth: 650,
    },
})

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}


function NumberFormatCustom(props: NumberFormatCustomProps) {
    const {inputRef, onChange, ...other} = props;

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

function AddedSubmissionCards() {

    const classes = useStyles();
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards)
    const dispatch = useAppDispatch();

    function onDeselectCard(row: SearchResultItemCardProps) {
        dispatch(markCardAsUnselected(row))
    }

    function onChangeCardQty(card: SearchResultItemCardProps, qty: number) {
        dispatch(changeSelectedCardQty({card, qty}))
    }

    function onChangeCardValue(card: SearchResultItemCardProps, newValue: number) {
        dispatch(changeSelectedCardValue({card, newValue}))
    }

    if (selectedCards.length === 0) {
        return (
            <Paper className={classes.addedCardsContainer} variant={'outlined'}>
                <Typography variant={'subtitle2'} className={classes.label}> Added Card(s) </Typography>
                <div className={classes.emptyStateContainer}>
                    <Typography variant={"subtitle1"} className={classes.emptyStateText}>
                        No cards have been added yet.
                    </Typography>
                </div>
            </Paper>
        )
    }

    return (
        <Paper className={classes.addedCardsContainer} variant={'outlined'}>
            <Typography variant={'subtitle2'} className={classes.label}> Added Card(s) </Typography>

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
                    {selectedCards.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                <TextField
                                    onChange={e => onChangeCardQty(row, Number(e.target.value))}
                                    type="number"
                                    size={'small'}
                                    value={row.qty}
                                    InputProps={{
                                        inputProps: {min: 1}
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    className={classes.qtyField}
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="left">
                                <SearchResultItemCard key={row.id} id={row.id} image={row.image}
                                                      subtitle={row.subtitle} title={row.title} addedMode/>
                            </TableCell>
                            <TableCell align="left">
                                <TextField
                                    value={row.value}
                                    onChange={e => onChangeCardValue(row, Number(e.target.value))}
                                    name="numberformat"
                                    size="small"
                                    id="formatted-numberformat-input"
                                    variant="outlined"
                                    InputProps={{
                                        inputComponent: NumberFormatCustom as any,
                                        inputProps: {min: 1},
                                        startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                                    }}
                                />
                            </TableCell>
                            <TableCell align="left">
                                <IconButton aria-label="delete" onClick={() => onDeselectCard(row)}>
                                    <DeleteIcon fontSize="medium"/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}


export default AddedSubmissionCards
