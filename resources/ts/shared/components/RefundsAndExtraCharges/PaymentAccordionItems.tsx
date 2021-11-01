import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PaymentAccordionItem from '@shared/components/RefundsAndExtraCharges/PaymentAccordionItem';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';

interface PaymentAccordionItemsProps {
    refunds: OrderRefundEntity[] | null;
    extraCharges: OrderExtraChargeEntity[] | null;
    mode: 'customer' | 'admin';
    orderId: string | number;
}
export function PaymentAccordionItems({ refunds, extraCharges, mode, orderId }: PaymentAccordionItemsProps) {
    return (
        <Grid
            container
            flexDirection={extraCharges?.length === 0 ? 'row-reverse' : 'row'}
            padding={'12px'}
            spacing={2}
            justifyContent={'space-between'}
            maxWidth={'100%'}
        >
            <Grid item sm={6} flexDirection={'column'}>
                {extraCharges && extraCharges?.length > 0 ? (
                    <Typography variant={'subtitle2'} marginBottom={'12px'}>
                        Extra Charges
                    </Typography>
                ) : null}
                {extraCharges?.map((item, index) => (
                    <PaymentAccordionItem
                        key={index}
                        mode={mode}
                        transactionId={item?.id}
                        orderId={orderId}
                        type={'extra_charge'}
                        amount={item?.amount}
                        notes={item?.notes}
                        author={item?.user?.getFullName()}
                        updatedAt={item?.createdAt}
                    />
                ))}
            </Grid>
            <Grid item sm={6} flexDirection={'column'}>
                {refunds && refunds?.length > 0 ? (
                    <Typography variant={'subtitle2'} marginBottom={'12px'}>
                        Refunds
                    </Typography>
                ) : null}
                {refunds?.map((item, index) => (
                    <PaymentAccordionItem
                        key={index}
                        mode={mode}
                        transactionId={item?.id}
                        orderId={orderId}
                        type={'refund'}
                        amount={item?.amount}
                        notes={item?.notes}
                        author={item?.user?.getFullName()}
                        updatedAt={item?.createdAt}
                    />
                ))}
            </Grid>
        </Grid>
    );
}
