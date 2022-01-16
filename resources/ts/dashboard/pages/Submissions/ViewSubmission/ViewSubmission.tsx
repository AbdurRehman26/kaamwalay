import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { upperFirst } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RefundsAndExtraCharges } from '@shared/components/RefundsAndExtraCharges';
import { SubmissionViewBilling } from '@shared/components/SubmissionViewBilling';
import { SubmissionViewCards } from '@shared/components/SubmissionViewCards';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { ViewSubmissionHeader } from './ViewSubmissionHeader';
import { ViewSubmissionInformation } from './ViewSubmissionInformation';
import { ViewSubmissionStatus } from './ViewSubmissionStatus';

/**
 * View Submission page
 * @type Page
 * @public
 * @constructor
 */
export function ViewSubmission() {
    const { id } = useParams<'id'>();
    const { isLoading, isError, data } = useOrderQuery({
        resourceId: Number(id),
        config: {
            params: {
                include: [
                    'paymentPlan',
                    'orderStatusHistory',
                    'orderCustomerShipment',
                    'orderStatusHistory.orderStatus',
                    'invoice',
                    'extraCharges',
                    'refunds',
                    'orderShipment',
                    'orderItems',
                    'orderStatus',
                    'coupon',
                ],
            },
        },
    });

    if (isLoading || isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {isLoading ? <CircularProgress /> : <Typography color={'error'}>Error loading submission</Typography>}
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <ViewSubmissionHeader
                orderNumber={data?.orderNumber}
                invoicePath={data?.invoice?.path}
                invoiceNumber={data?.invoice?.invoiceNumber}
            />
            <Divider />
            <ViewSubmissionStatus
                trackingNumber={data?.orderCustomerShipment?.trackingNumber}
                shipmentProvider={data?.orderCustomerShipment?.shippingProvider}
                orderStatus={upperFirst(data?.orderStatus.name)}
                orderShipment={data?.orderShipment}
            />
            <Divider />
            <ViewSubmissionInformation
                serviceLevel={`$${data?.paymentPlan?.price} / Card`}
                amountPaidFromWallet={data?.amountPaidFromWallet}
                numberOfCards={data?.numberOfCards}
                discountedAmount={data?.discountedAmount}
                paymentMethodDiscountedAmount={data?.paymentMethodDiscountedAmount}
                shippingMethod={data?.shippingMethod?.name}
                createdAt={data?.createdAt}
                declaredValue={data?.totalDeclaredValue}
                customerName={data?.customer?.getFullName()}
                customerEmail={data?.customer?.email}
                customerPhone={data?.customer?.phone}
                customerNumber={data?.customer?.customerNumber}
                serviceFee={data?.serviceFee}
                shippingFee={data?.shippingFee}
                refundsTotal={data?.refundTotal}
                extraChargesTotal={data?.extraChargeTotal}
                total={data?.grandTotal}
            />
            <Divider />
            <Box marginTop={'24px'} />
            <SubmissionViewBilling
                shippingAddress={data?.shippingAddress}
                billingAddress={data?.billingAddress}
                coupon={data?.coupon}
                payment={data?.orderPayment}
                paymentMethodId={data?.paymentMethodId}
            />
            <Box marginTop={'24px'} />
            <Divider />
            <Box marginTop={'24px'} />
            <RefundsAndExtraCharges
                mode={'customer'}
                orderId={Number(id)}
                extraCharges={data?.extraCharges}
                refunds={data?.refunds}
            />

            <SubmissionViewCards
                serviceLevelPrice={data?.paymentPlan?.price}
                orderStatusID={data?.orderStatus?.id}
                items={data?.orderItems}
            />
        </Grid>
    );
}
