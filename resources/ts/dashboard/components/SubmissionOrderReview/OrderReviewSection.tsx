import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import OrderDetailItem from '@dashboard/components/SubmissionOrderReview/OrderDetailItem';
import Spacer from '@dashboard/components/SubmissionOrderReview/Spacer';
import useStyles from '@dashboard/components/SubmissionOrderReview/style';

function OrderReviewSection() {
    // @ts-ignore
    const classes = useStyles();

    return (
        <Paper variant={'outlined'} className={classes.orderReviewSection}>
            <div className={classes.orderItemsColumn}>
                <OrderDetailItem title={'Service Level'} editStep={0}>
                    <Typography className={classes.darkBodyText}>{'$20 / Card'}</Typography>
                    <Typography className={classes.greyBodyText}>{'Protection up to $500'}</Typography>
                    <Typography className={classes.greyBodyText}>{'28-30 Days Turnaround'}</Typography>
                </OrderDetailItem>
                <Spacer top={'32px'} />
                <OrderDetailItem title={'Shipping Address'} editStep={2}>
                    <Typography className={classes.darkBodyText}>{'James Smith'}</Typography>
                    <Typography className={classes.darkBodyText}>{'727 Amsterdam Blvd.'}</Typography>
                    <Typography className={classes.darkBodyText}>{'New York, NY 10301, US'}</Typography>
                </OrderDetailItem>
            </div>

            <div className={classes.orderItemsColumn}>
                <OrderDetailItem title={'Payment Method'} editStep={3} spaced>
                    <Typography className={classes.darkBodyText}>{'Visa Ending in 7972'}</Typography>
                    <Typography className={classes.greyBodyText}>{'Expires 08/25'}</Typography>
                </OrderDetailItem>
                <Spacer top={'48px'} />
                <OrderDetailItem title={'Return Shipping Method'} editStep={2} spaced>
                    <Typography className={classes.darkBodyText}>{'Insured Shipping'}</Typography>
                </OrderDetailItem>
            </div>

            <div className={classes.orderItemsColumn}>
                <OrderDetailItem title={'Billing Address'} editStep={3}>
                    <Typography className={classes.darkBodyText}>{'Same as shipping'}</Typography>
                </OrderDetailItem>
            </div>
        </Paper>
    );
}

export default OrderReviewSection;
