import Grid from '@material-ui/core/Grid';
import React from 'react';

import { useViewSubmissionInformationStyles } from './styles';

/**
 * @parent ViewSubmissionInformation
 * @private
 * @constructor
 */
export function ViewSubmissionInformation() {
    const classes = useViewSubmissionInformationStyles();

    return (
        <Grid container direction={'column'} className={classes.root}>
            <Grid item xs={4}>
                Column 1
            </Grid>
            <Grid item xs={4}>
                Column 2
            </Grid>
            <Grid item xs={4}>
                Column 3
            </Grid>
        </Grid>
    );
}
