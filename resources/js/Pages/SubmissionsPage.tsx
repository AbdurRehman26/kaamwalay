import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles({
    root: {

    },
    pageTitle: {
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "32px",
        lineHeight: "44px",
        color: "rgba(0, 0, 0, 0.87)"
    },
    pageHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    newSubmissionBtn: {
        color: '#fff',
        borderRadius: '24px',
        padding: '12px',
        paddingLeft: '22px',
        paddingRight: '22px'
    },

})
function SubmissionsPage() {

    const classes = useStyles();
    const history = useHistory()
    return (
        <div className={classes.root}>
            <div className={classes.pageHeader}>
                <Typography variant={'h1'} className={classes.pageTitle}>Submissions</Typography>
                <Button variant={'contained'} color={'primary'}
                        onClick={() => history.push('/new-submission')}
                        className={classes.newSubmissionBtn}> NEW SUBMISSION </Button>
            </div>
        </div>
    )
}

export default SubmissionsPage
