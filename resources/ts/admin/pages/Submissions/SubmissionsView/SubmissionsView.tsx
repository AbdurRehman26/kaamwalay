import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { RefundsAndExtraCharges } from '@shared/components/RefundsAndExtraCharges';
import { SubmissionViewCards } from '@shared/components/SubmissionViewCards';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import SubmissionPaymentActionsModal from '@admin/pages/Submissions/SubmissionsView/SubmissionPaymentActionsModal';
import { SubmissionsViewDetails } from './SubmissionsViewDetails';
import { SubmissionsViewHeader } from './SubmissionsViewHeader';

export function SubmissionsView() {
    const { id } = useParams<{ id: string }>();
    const [showPaymentActionsModal, setShowPaymentActionsModal] = useState(false);

    const { data, isLoading } = useAdminOrderQuery({
        resourceId: id,
        config: {
            params: {
                include: [
                    'customer',
                    'billingAddress',
                    'shippingAddress',
                    'paymentPlan',
                    'orderPayment',
                    'orderStatus',
                    'orderItems',
                    'orderShipment',
                    'extraCharges',
                    'refunds',
                    'orderStatusHistory.orderStatus',
                ],
            },
        },
    });

    if (isLoading || !data) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <SubmissionPaymentActionsModal
                openState={showPaymentActionsModal}
                orderId={id}
                setShowPaymentActionsModal={setShowPaymentActionsModal}
            />
            <SubmissionsViewHeader
                orderId={Number(id)}
                orderNumber={data?.orderNumber ?? ''}
                orderStatus={data?.orderStatus}
                orderStatusHistory={data?.orderStatusHistory}
                orderShipment={data?.orderShipment}
                setShowPaymentActionsModal={setShowPaymentActionsModal}
            />
            <Divider />
            <SubmissionsViewDetails
                serviceLevelFee={data.paymentPlan?.price}
                numberOfCards={data.numberOfCards}
                placedAt={data.createdAt}
                declaredValue={data.totalDeclaredValue}
                serviceFee={data.serviceFee}
                shippingFee={data.shippingFee}
                grandTotal={data.grandTotal}
                customerId={data.customer?.id}
                customerNumber={data.customer?.customerNumber}
                customerName={data.customer?.getFullName()}
                customerEmail={data.customer?.email}
                customerPhone={data.customer?.phone}
                billingAddress={data.billingAddress}
                shippingAddress={data.shippingAddress}
                payment={data.orderPayment}
                refundsTotal={String(data?.getRefundsTotal())}
                extraChargesTotal={String(data?.getExtraChargesTotal())}
            />
            <Divider />
            <RefundsAndExtraCharges
                mode={'admin'}
                orderId={id}
                extraCharges={data?.extraCharges}
                refunds={data?.refunds}
            />
            <SubmissionViewCards items={data.orderItems} serviceLevelPrice={data.paymentPlan?.price} />
        </Grid>
    );
}

export default SubmissionsView;
