import React from 'react';
import {setServiceLevel, SubmissionService} from "../Redux/Slices/newSubmissionSlice";
import Radio, {RadioProps} from '@material-ui/core/Radio';
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useAppDispatch, useAppSelector} from "../hooks";


const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxHeight: '64px',
        border: '2px solid #DDDDDD',
        marginBottom: '12px',
        borderRadius: '2px',
        padding: '10px 8px 10px 6px',
        '&:hover': {
            cursor: 'pointer',
        }
    },
    leftSide: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '30%',
    },
    rightSide: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioBtnContainer: {},
    maxValueContainer: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '64px',
        padding: 0,
    },
    levelTitle: {
        fontFamily: "Roboto",
        transform: 'translateZ(0)',
        fontStyle: "normal",
        fontWeight: 'bold',
        fontSize: "16px",
        lineHeight: "24px",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    protectionText: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: "20px",
        textAlign: "right",
        letterSpacing: "0.2px"
    },
    price: {
        fontFamily: "Roboto",
        transform: 'translateZ(0)',
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "16px",
        lineHeight: "24px",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    turnaround: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "12px",
        lineHeight: "16px",
        textAlign: "right",
        letterSpacing: "0.2px",
        color: "rgba(0, 0, 0, 0.54)"
    }
}, {name: 'ServiceLevelItemStyle'})


const GreenRadio = withStyles({
    root: {
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);


function ServiceLevelItem(props: SubmissionService) {

    const classes = useStyles();
    const dispatch = useAppDispatch()
    const currentSelectedLevel = useAppSelector(state => state.newSubmission.step01Data.selectedServiceLevel);
    const {id, price, turnaround, type, protectionLimit} = props;

    return (
        <div onClick={() => dispatch(setServiceLevel({id, price, turnaround, type, protectionLimit}))} className={classes.root} style={{borderColor: currentSelectedLevel?.id === id ? '#20BFB8' : '#DDDDDD', borderWidth: currentSelectedLevel?.id === id ? '2px' : '1px' }}>
            <div className={classes.leftSide}>
                <div className={classes.radioBtnContainer}>
                    <GreenRadio
                        checked={currentSelectedLevel?.id === id}
                    />
                </div>
                <div className={classes.rightSide}>
                    <Typography variant={'subtitle2'} className={classes.levelTitle}>{price} <span
                        style={{fontWeight: 400}}> / Card </span> </Typography>
                </div>
            </div>

            <div className={classes.maxValueContainer}>
                <Typography variant={'subtitle2'}
                            className={classes.protectionText}>{`Protection up to ${protectionLimit}`}</Typography>
                <Typography variant={'subtitle2'} className={classes.turnaround}>{`${turnaround} Turnaround`}</Typography>
            </div>
        </div>
    )
}

export default ServiceLevelItem;
