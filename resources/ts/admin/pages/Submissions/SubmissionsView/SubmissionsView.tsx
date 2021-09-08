import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useParams } from 'react-router-dom';
import { SubmissionViewCards } from '@shared/components/SubmissionViewCards';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { SubmissionsViewDetails } from './SubmissionsViewDetails';
import { SubmissionsViewHeader } from './SubmissionsViewHeader';

export function SubmissionsView() {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useAdminOrderQuery({
        resourceId: id,
        config: {
            params: {
                include: 'customer',
            },
        },
    });

    if (isLoading) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <SubmissionsViewHeader orderId={id} orderNumber={data?.orderNumber ?? ''} />
            <Divider />
            <SubmissionsViewDetails
                serviceLevelFee={data.serviceFee}
                numberOfCards={data.numberOfCards}
                placedAt={data.createdAt}
                declaredValue={data.totalDeclaredValue}
                serviceFee={data.serviceFee * data.numberOfCards}
                shippingFee={data.shippingFee}
                grandTotal={data.grandTotal}
                customerId={data.customer.id}
                customerNumber={data.customer.customerNumber}
                customerName={data.customer.getFullName()}
                customerEmail={data.customer.email}
                customerPhone={data.customer.phone}
                billingAddress={data.billingAddress}
                shippingAddress={data.shippingAddress}
                cardLast4={data.orderPayment.card.last4}
                cardType={data.orderPayment.card.brand}
                cardExpirationMonth={data.orderPayment.card.expMonth}
                cardExpirationYear={data.orderPayment.card.expYear}
            />
            <SubmissionViewCards />
        </Grid>
    );
}

export default SubmissionsView;
