import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Divider, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {useAppDispatch, useAppSelector} from "../hooks";
import NumberFormat from 'react-number-format';
import {setCustomStep} from "../Redux/Slices/newSubmissionSlice";


const useStyles = makeStyles({
    container: {
        width: '345px',
        minHeight: '20px',
    },
    titleContainer: {
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '55px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "16px",
        marginLeft: '16px',
        lineHeight: "24px",
        letterSpacing: "0.1px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    bodyContainer: {
        backgroundColor: '#fff',
        paddingLeft: '16px',
        paddingRight: '16px',
    },
    rowsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingTop: '24px',
        marginBottom: '24px',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLeftText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    rowRightBoldText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "20px",
        textAlign: "right",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    rowRightRegularText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "right",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    clickableGreenText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.35px",
        color: "#20BFB8",
        cursor: 'pointer',
        '&:hover': {
            color: '#288480',
        }
    }
})


function SubmissionSummary() {
    const classes = useStyles();
    const serviceLevelPrice = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.price)
    const protectionLimit = useAppSelector((state) => state.newSubmission?.step01Data?.selectedServiceLevel.protectionLimit)
    const selectedCards = useAppSelector((state) => state.newSubmission.step02Data.selectedCards)
    const dispatch = useAppDispatch();


    const formattedLevelPrice = Number(serviceLevelPrice.replace(/[^0-9\.-]+/g,""));
    const numberOfSelectedCards = selectedCards.length !== 0 ? selectedCards.reduce(function (prev, cur) {
        // @ts-ignore
        return prev + cur?.qty
    }, 0) : 0;

    function onLevelEditPress() {
        dispatch(setCustomStep(0))
    }
    return (
        <Paper variant={"outlined"} square className={classes.container}>
            <div className={classes.titleContainer}>
                <Typography variant={'subtitle2'} className={classes.title}>Summary</Typography>
            </div>
            <div className={classes.bodyContainer}>
                <div className={classes.rowsContainer}>
                    <div className={classes.row}>
                        <Typography className={classes.rowLeftText}>Service Level</Typography>
                        <Typography
                            className={classes.rowRightBoldText}><span><NumberFormat
                            value={formattedLevelPrice}
                            displayType={'text'} thousandSeparator decimalSeparator={'.'}
                            prefix={'$'}/></span> / Card</Typography>
                    </div>
                    <div className={classes.row} style={{marginTop: '12px'}}>
                        <Typography className={classes.clickableGreenText} onClick={onLevelEditPress}>EDIT</Typography>
                        <Typography
                            className={classes.rowRightRegularText}>{`${protectionLimit} Max. Value Per Card`}</Typography>
                    </div>
                </div>
                <Divider light/>
                <div className={classes.rowsContainer}>
                    <div className={classes.row}>
                        <Typography className={classes.rowLeftText}>Number of Cards:</Typography>
                        <Typography className={classes.rowRightBoldText}>{numberOfSelectedCards}</Typography>
                    </div>
                    <div className={classes.row} style={{marginTop: '16px'}}>
                        <Typography className={classes.rowLeftText}>Price / Card:</Typography>
                        <NumberFormat value={serviceLevelPrice} className={classes.rowRightBoldText}
                                      displayType={'text'} thousandSeparator decimalSeparator={'.'} prefix={'$'}/>
                    </div>
                </div>
                <Divider light/>
                <div className={classes.rowsContainer}>
                    <div className={classes.row}>
                        <Typography className={classes.rowLeftText}>Service Level Fee:</Typography>


                        <Typography className={classes.rowRightBoldText}>
                            <span style={{fontWeight: 400, color: '#757575'}}>(<NumberFormat
                                value={serviceLevelPrice} displayType={'text'} thousandSeparator decimalSeparator={'.'}
                                prefix={'$'}/> x {numberOfSelectedCards}) = </span>
                            <NumberFormat
                            value={numberOfSelectedCards * formattedLevelPrice}
                            displayType={'text'} thousandSeparator decimalSeparator={'.'}
                            prefix={'$'}/>
                        </Typography>
                    </div>
                </div>
            </div>
        </Paper>
    )
}

export default SubmissionSummary
