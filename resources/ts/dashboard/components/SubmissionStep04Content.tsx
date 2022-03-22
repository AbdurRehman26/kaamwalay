import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { AuthDialog } from '@shared/components/AuthDialog/AuthDialog';
import { ApplicationEventsEnum } from '@shared/constants/ApplicationEventsEnum';
import { useApplicationEvent } from '@shared/hooks/useApplicationEvent';
import { useAuth } from '@shared/hooks/useAuth';
import { ApplyCredit } from '@dashboard/components/ApplyCredit';
import { useAppSelector } from '../redux/hooks';
import StepDescription from './StepDescription';

const useStyles = makeStyles((theme) => ({
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
    shippingMethodContainer: {
        marginBottom: '24px',
    },
    sectionLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        marginBottom: '20px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
    },
    methodDescription: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.1px',
        marginBottom: '4px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    sectionContainer: {
        marginTop: '32px',
    },
    shippingMethodItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
        },
    },
    fieldContainer: {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
    },
    loaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    availableCreditLabel: {
        color: 'rgba(0, 0, 0, 0.54);',
        fontSize: '12px',
    },
}));

export function SubmissionStep04Content() {
    const classes = useStyles();
    const availableCredit = useAppSelector((state) => state.newSubmission.availableCredit);
    const { authDialogProps, openAuthDialog } = useAuth();
    useApplicationEvent(ApplicationEventsEnum.AuthSessionUnauthorized, () => {
        openAuthDialog();
    });

    return (
        <>
            <AuthDialog
                {...authDialogProps}
                subtitle={'In order to continue you need to login with a Robograding account.'}
                internalCloseOnly
            />
            <StepDescription
                title={`Enter Payment Details`}
                description={'Select your payment method and enter details.'}
            />
            <Divider light />
            <div className={classes.leftSideContainer}>
                {availableCredit > 0 ? (
                    <div className={classes.shippingMethodContainer}>
                        <Typography className={classes.sectionLabel} style={{ marginBottom: '3px' }}>
                            Apply Credit
                        </Typography>
                        <Typography variant={'caption'} className={classes.availableCreditLabel}>
                            You have <span style={{ fontWeight: 'bold' }}>${availableCredit}</span> in available credit.
                        </Typography>
                        <div className={classes.shippingMethodItemContainer} style={{ marginTop: '20px' }}>
                            <ApplyCredit />
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default SubmissionStep04Content;
