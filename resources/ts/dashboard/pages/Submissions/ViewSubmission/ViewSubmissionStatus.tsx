import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { ViewSubmissionStatusBar } from './ViewSubmissionStatusBar';
import { SubmissionDetails, SubmissionSteps } from './data';
import { useViewSubmissionStatusStyles } from './styles';

interface ViewSubmissionStatusProps {
    orderStatus: string | SubmissionSteps;
}

/**
 * @parent ViewSubmissionStatus
 * @private
 * @constructor
 */
export function ViewSubmissionStatus({ orderStatus }: ViewSubmissionStatusProps) {
    const classes = useViewSubmissionStatusStyles();
    const details = useMemo<string[]>(
        () => (SubmissionDetails as Record<string, any>)[orderStatus] ?? [],
        [orderStatus],
    );
    const steps = useMemo(() => Object.values(SubmissionSteps), []);

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body2'} className={cx(classes.fontMedium, classes.textGutter)}>
                Status:
            </Typography>
            <Typography variant={'h6'} color={'primary'} className={cx(classes.fontMedium, classes.textGutter)}>
                {orderStatus}
            </Typography>
            <Typography variant={'caption'}>
                {details.map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
                {orderStatus === 'Shipped' && <Link href={'#'}>LS9383980923098328238920</Link>}
            </Typography>

            <ViewSubmissionStatusBar steps={steps} currentStep={orderStatus} />
        </Grid>
    );
}
