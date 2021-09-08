import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatusChip } from '@shared/components/StatusChip';
import { StatusProgressBar } from '@shared/components/StatusProgressBar';
import { font } from '@shared/styles/utils';
import { useOrderStatus } from '../../../hooks/useOrderStatus';

interface SubmissionViewHeaderProps {
    orderId: string | number;
    orderNumber: string;
    isLoading?: boolean;
    isReviewed?: boolean;
    isGraded?: boolean;
    isShipped?: boolean;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: '#f9f9f9',
            padding: theme.spacing(3),
        },
        header: {
            paddingBottom: theme.spacing(3),
        },
        heading: {
            fontWeight: 400,
            marginRight: theme.spacing(3),
        },
        menuButton: {
            marginLeft: theme.spacing(2),
        },
        button: {
            borderRadius: 24,
            padding: theme.spacing(1.375, 3.5),
        },
    }),
    { name: 'SubmissionViewHeader' },
);

export function SubmissionsViewHeader({
    orderId,
    orderNumber,
    isReviewed,
    isGraded,
    isShipped,
}: SubmissionViewHeaderProps) {
    const classes = useStyles();

    const [statusType, statusLabel] = useOrderStatus({ isGraded, isReviewed, isShipped });

    const actionButton = useMemo(() => {
        const sharedProps: any = {
            variant: 'contained',
            color: 'primary',
            size: 'large',
            className: classes.button,
        };

        if (!isReviewed) {
            return (
                <Button component={Link} to={`/submissions/${orderId}/review`} {...sharedProps}>
                    Review
                </Button>
            );
        }

        if (!isGraded) {
            return (
                <Button component={Link} to={`/submissions/${orderId}/grade`} {...sharedProps}>
                    Grade
                </Button>
            );
        }

        if (!isShipped) {
            return <Button {...sharedProps}>Mark Shipped</Button>;
        }

        return (
            <Button size={'large'} color={'primary'}>
                Edit Tracking
            </Button>
        );
    }, [classes.button, isGraded, isReviewed, isShipped, orderId]);

    return (
        <Grid container className={classes.root}>
            <Grid container className={classes.header}>
                <Grid container item xs alignItems={'center'}>
                    <Typography variant={'h6'} className={classes.heading}>
                        Submission # <span className={font.fontWeightBold}>{orderNumber}</span>
                    </Typography>
                    <StatusChip color={statusType} label={statusLabel} />
                </Grid>
                <Grid container item xs alignItems={'center'} justifyContent={'flex-end'}>
                    {actionButton}
                    <IconButton size={'medium'} className={classes.menuButton}>
                        <MoreVertIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <StatusProgressBar
                steps={[
                    { label: 'Pending', value: 'pending', isCompleted: true, completedAt: new Date() },
                    { label: 'Reviewed', value: 'reviewed' },
                    { label: 'Graded', value: 'graded' },
                    { label: 'Shipped', value: 'shipped' },
                ]}
            />
        </Grid>
    );
}
