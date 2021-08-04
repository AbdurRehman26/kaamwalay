import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React, { useMemo } from 'react';

import { cx } from '@shared/lib/utils/cx';

import { ViewSubmissionStatusBar } from './ViewSubmissionStatusBar';
import { SubmissionDetails, SubmissionSteps } from './data';
import { useViewSubmissionStatusStyles } from './styles';

interface ViewSubmissionStatusProps {
    currentStep: SubmissionSteps;
}

/**
 * @parent ViewSubmissionStatus
 * @private
 * @constructor
 */
export function ViewSubmissionStatus({ currentStep }: ViewSubmissionStatusProps) {
    const classes = useViewSubmissionStatusStyles();
    const details = useMemo(() => SubmissionDetails[currentStep], [currentStep]);

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Typography variant={'body2'} className={cx(classes.fontMedium, classes.textGutter)}>
                Status:
            </Typography>
            <Typography variant={'h6'} color={'primary'} className={cx(classes.fontMedium, classes.textGutter)}>
                Placed
            </Typography>
            <Typography variant={'caption'}>
                {details.map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
                {currentStep === 'Shipped' && <Link href={'#'}>LS9383980923098328238920</Link>}
            </Typography>

            <ViewSubmissionStatusBar steps={SubmissionSteps as any} currentStep={currentStep} />
        </Grid>
    );
}
