import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import AddedSubmissionCards from '../AddedSubmissionCards';
import StepDescription from '../StepDescription';
import OrderReviewSection from '../SubmissionOrderReview/OrderReviewSection';

const useStyles = makeStyles({
    stepDescriptionContainer: {
        maxWidth: '425px',
    },
    leftSideContainer: {
        marginTop: '12px',
    },
    divider: {
        marginTop: '64px',
    },
    valueAlert: {
        marginTop: '16px',
    },
});
function SubmissionStep05Content() {
    const classes = useStyles();

    return (
        <>
            <StepDescription
                title="Review your submission"
                description={
                    <Box maxWidth={342}>
                        Go through all the information you input in the previous steps, and click submit to finish
                        submission.
                    </Box>
                }
            />
            <Divider light />
            <div className={classes.leftSideContainer}>
                <AddedSubmissionCards reviewMode />
                <OrderReviewSection />
            </div>
            <Divider light className={classes.divider} />
        </>
    );
}

export default SubmissionStep05Content;
