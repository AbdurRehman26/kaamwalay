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
                    'customer.wallet',
                    'customer.referredBy',
                    'orderCustomerShipment',
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
                    'orderCertificate',
                    'orderStatusHistory.orderStatus',
                    'coupon',
                    'tags',
                    'orderItems.cardProduct.cardSet.cardSeries',
                    'orderItems.cardProduct.cardCategory',
                    'orderItems.userCard',
                    'orderItems.latestStatusHistory.orderItemStatus',
                    'firstOrderPayment.user',
                    'owner',
                ],
            },
        },
    });

    const isVault = data?.shippingMethod?.code === ShippingMethodType.VaultStorage;

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
                orderCertificate={data?.orderCertificate}
                customer={data?.customer}
                paymentStatus={data.paymentStatus}
                isVault={isVault}
                isAbandoned={data?.hasTag('abandoned')}
            />
            <Divider />
            <SubmissionsViewDetails
                serviceLevelFee={data.paymentPlan?.price}
                paymentMethodCode={data?.orderPayment?.paymentMethod?.code}
                numberOfCards={data?.numberOfCards}
                discountedAmount={data?.discountedAmount}
                amountPaidFromWallet={data?.amountPaidFromWallet}
                paymentMethodDiscountedAmount={data?.paymentMethodDiscountedAmount}
                coupon={data?.coupon}
                placedAt={data?.createdAt}
                declaredValue={data.totalDeclaredValue}
                serviceFee={data.serviceFee}
                shippingFee={data.shippingFee}
                cleaningFee={data.cleaningFee}
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
                admin={data?.orderPayment?.user?.fullName}
                createdBy={data?.createdBy}
                owner={data?.owner}
                referrer={data?.customer?.referredBy}
                salesmanCommission={data?.salesmanCommission}
                referralCommission={data?.referralCommission}
                orderCustomerShipment={data?.orderCustomerShipment}
                requiresShippingInsurance={data?.requiresShippingInsurance}
                shippingInsuranceFee={data?.shippingInsuranceFee}
                requiresSignature={data?.requiresSignature}
                signatureFee={data?.signatureFee}
                shippingMethod={data?.shippingMethod?.name}
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
