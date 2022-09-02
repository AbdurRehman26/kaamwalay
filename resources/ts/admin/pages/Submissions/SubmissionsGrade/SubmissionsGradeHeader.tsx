import QrCodeIcon from '@mui/icons-material/QrCode';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { OrderLabelEntity } from '@shared/entities/OrderLabelEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { DateLike } from '@shared/lib/datetime/DateLike';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { cx } from '@shared/lib/utils/cx';
import { font } from '@shared/styles/utils';

interface SubmissionsGradeHeaderProps {
    orderId: string | number;
    orderNumber: string;
    reviewedAt: DateLike;
    reviewer: string;
    cardsGraded: number;
    orderCertificate?: OrderLabelEntity | null;
    cardsInOrder: number;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(4, 0),
            backgroundColor: '#f9f9f9',
        },
        button: {
            marginLeft: theme.spacing(1),
            borderRadius: 2,
        },
        buttonDisabled: {
            pointerEvents: 'none',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            color: 'rgba(0, 0, 0, 0.54)',
            '& b': {
                color: 'rgba(0, 0, 0, 0.87)',
            },
        },
    }),
    { name: 'SubmissionsGradeHeader' },
);

export function SubmissionsGradeHeader({
    orderId,
    orderNumber,
    reviewer,
    cardsGraded,
    reviewedAt,
    cardsInOrder,
    orderCertificate,
}: SubmissionsGradeHeaderProps) {
    const classes = useStyles();

    const notifications = useNotifications();
    const ExportCertificateIds = useCallback(async () => {
        if (!orderCertificate) {
            notifications.error('Order Label is generating at the moment, try again in some minutes!');
            return;
        }

        await downloadFromUrl(orderCertificate.path, `${orderNumber}_certificate.xlsx`);
    }, [notifications, orderCertificate, orderNumber]);

    return (
        <header className={classes.root}>
            <Container>
                <Grid container alignItems={'flex-start'}>
                    <Grid container item xs direction={'column'}>
                        <Typography variant={'h5'}>
                            Grade Submission <b># {orderNumber}</b>
                        </Typography>
                        <Typography variant={'caption'}>
                            <span className={font.fontWeightMedium}>Reviewed</span>:&nbsp;
                            {formatDate(reviewedAt, 'MM/DD/YYYY [at] hh:mm A')}&nbsp;
                            <Typography variant={'caption'} color={'textSecondary'} component={'span'}>
                                ({reviewer})
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid container item xs justifyContent={'flex-end'} flexGrow={'2 !important'}>
                        <Button
                            className={cx(classes.buttonDisabled, classes.button)}
                            variant={'outlined'}
                            disableFocusRipple
                        >
                            {cardsGraded !== cardsInOrder ? 'Grading Incomplete' : 'Grading Complete'}
                        </Button>
                        <Button
                            className={cx(classes.buttonDisabled, classes.button)}
                            variant={'outlined'}
                            disableFocusRipple
                        >
                            <b>
                                {cardsGraded}/{cardsInOrder}
                            </b>
                            &nbsp;Cards Graded
                        </Button>
                        <Button
                            component={Link}
                            to={`/submissions/${orderId}/view`}
                            className={classes.button}
                            variant={'contained'}
                            color={'inherit'}
                            startIcon={<VisibilityIcon color={'inherit'} />}
                        >
                            View Submission
                        </Button>
                        {orderCertificate && (
                            <Button
                                onClick={ExportCertificateIds}
                                className={classes.button}
                                variant={'contained'}
                                color={'inherit'}
                                startIcon={<QrCodeIcon color={'inherit'} />}
                            >
                                Export Cert ID's
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </header>
    );
}

export default SubmissionsGradeHeader;
