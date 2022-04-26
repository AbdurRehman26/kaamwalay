import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import React from 'react';
import { useParams } from 'react-router-dom';
import { RefundsAndExtraCharges } from '@shared/components/RefundsAndExtraCharges';
import { SubmissionViewCards } from '@shared/components/SubmissionViewCards';
import { ShippingMethodType } from '@shared/constants/ShippingMethodType';
import { useAdminOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { SubmissionsViewDetails } from './SubmissionsViewDetails';
import { SubmissionsViewHeader } from './SubmissionsViewHeader';

export function SubmissionsView() {
    const { id } = useParams<'id'>();

    const { data, isLoading } = useAdminOrderQuery({
        resourceId: Number(id),
        config: {
            params: {
                include: [
                    'customer',
                    'customer.wallet',
                    'billingAddress',
                    'shippingAddress',
                    'shippingMethod',
                    'paymentPlan',
                    'orderPayment',
                    'orderStatus',
                    'orderItems',
                    'orderShipment',
                    'extraCharges',
                    'refunds',
                    'orderLabel',
                    'orderStatusHistory.orderStatus',
                    'coupon',
                ],
            },
        },
    });

    const inVault = data?.shippingMethod?.code === ShippingMethodType.VaultStorage;

    if (isLoading || !data) {
        return (
            <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container direction={'column'}>
            <SubmissionsViewHeader
                orderId={Number(id)}
                orderNumber={data?.orderNumber ?? ''}
                orderStatus={data?.orderStatus}
                orderStatusHistory={data?.orderStatusHistory}
                orderShipment={data?.orderShipment}
                orderLabel={data?.orderLabel}
                customer={data?.customer}
                inVault={inVault}
            />
            <Divider />
            <SubmissionsViewDetails
                serviceLevelFee={data.paymentPlan?.price}
                paymentMethodId={data?.paymentMethodId}
                numberOfCards={data?.numberOfCards}
                discountedAmount={data?.discountedAmount}
                amountPaidFromWallet={data?.amountPaidFromWallet}
                paymentMethodDiscountedAmount={data?.paymentMethodDiscountedAmount}
                coupon={data?.coupon}
                placedAt={data?.createdAt}
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
                refundsTotal={String(data?.refundTotal)}
                extraChargesTotal={String(data?.extraChargeTotal)}
                paymentStatus={data?.paymentStatus}
                walletPayment={data?.amountPaidFromWallet}
            />
            <Divider />
            <RefundsAndExtraCharges
                mode={'admin'}
                orderId={Number(id)}
                extraCharges={data?.extraCharges}
                refunds={data?.refunds}
            />
            <SubmissionViewCards
                items={data?.orderItems}
                serviceLevelPrice={data?.paymentPlan?.price}
                orderStatusID={data?.orderStatus?.id}
            />
        </Grid>
    );
}

export default SubmissionsView;
