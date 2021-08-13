import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { font } from '@shared/styles/utils';

import { ConfirmationSubmissionSidebar } from './ConfirmationSubmissionSidebar';
import { PackingInstructions } from './PackingInstructions';
import { PrintingInformation } from './PrintingInformation';
import { ShippingInstructions } from './ShippingInstructions';
import { useConfirmationSubmissionStyles } from './style';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: ConfirmationSubmission
 * @date: 06.08.2021
 * @time: 23:14
 */
export function ConfirmationSubmission() {
    const classes = useConfirmationSubmissionStyles();

    return (
        <Grid container>
            <Grid item className={classes.sidebar}>
                <ConfirmationSubmissionSidebar />
            </Grid>
            <Grid item className={classes.content}>
                <Box paddingTop={3} paddingBottom={2.5}>
                    <Typography variant={'h5'} className={font.fontWeightMedium}>
                        Shipping Instructions
                    </Typography>
                </Box>
                <Divider />
                <Box component={'section'} paddingY={3.5}>
                    <PrintingInformation />
                </Box>
                <Box component={'section'} paddingY={3.5}>
                    <PackingInstructions />
                </Box>
                <Box component={'section'} paddingY={3.5}>
                    <ShippingInstructions />
                </Box>
                <Divider />
                <Box paddingTop={6.5} paddingBottom={2.25}>
                    <Typography variant={'h6'} className={font.fontWeightMedium} paragraph>
                        ...And You're Done!
                    </Typography>
                    <Typography variant={'body2'} paragraph>
                        Once you have shipped your package with the cards and packing slip, your job is done. Once we
                        receive the package we will grade your cards, and your grades will be available for viewing on
                        your Robograding account. You'll get an email as soon as they are graded.
                    </Typography>
                    <Typography variant={'body2'} paragraph>
                        The return shipment will include your new cards in new Robograding slabs with a grade printed on
                        them.
                    </Typography>
                    <Typography variant={'body2'} paragraph>
                        <span>
                            You should receive your return shipment within 3-4 weeks of the day you ship them to us, but
                            our turnaround times are not guaranteed. For more on this, please read the Robograding
                        </span>
                        &nbsp;
                        <Link color={'inherit'} className={font.fontWeightMedium} underline={'always'}>
                            Terms and Conditions
                        </Link>
                        .
                    </Typography>
                </Box>
                <Divider />
                <Box paddingTop={4} paddingBottom={10}>
                    <Button variant={'contained'} size={'large'} color={'primary'} className={classes.detailsButton}>
                        Go to submission details page
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default ConfirmationSubmission;
