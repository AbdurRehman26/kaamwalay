import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import PaymentAccordionItem from '@shared/components/RefundsAndExtraCharges/PaymentAccordionItem';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';

interface PaymentAccordionItemsProps {
    refunds: OrderRefundEntity[];
    extraCharges: OrderExtraChargeEntity[];
    mode: 'customer' | 'admin';
    orderId: string | number;
}
export function PaymentAccordionItems({ refunds, extraCharges, mode, orderId }: PaymentAccordionItemsProps) {
    return (
        <Grid
            container
            flexDirection={extraCharges.length === 0 ? 'row-reverse' : 'row'}
            padding={'12px'}
            spacing={2}
            justifyContent={'space-between'}
            maxWidth={'100%'}
        >
            <Grid item sm={6} flexDirection={'column'}>
                {extraCharges.length === 0 ? null : (
                    <Typography variant={'subtitle2'} marginBottom={'12px'}>
                        Extra Charges
                    </Typography>
                )}
                {extraCharges.map((item, index) => {
                    return (
                        <PaymentAccordionItem
                            key={index}
                            mode={mode}
                            transactionId={item?.id}
                            orderId={orderId}
                            type={'extra_charge'}
                            amount={item.amount}
                            notes={item.notes}
                            author={item.author}
                            updatedAt={item.updatedAt}
                        />
                    );
                })}
            </Grid>
            <Grid item sm={6} flexDirection={'column'}>
                {refunds.length === 0 ? null : (
                    <Typography variant={'subtitle2'} marginBottom={'12px'}>
                        Refunds
                    </Typography>
                )}
                {refunds.map((item, index) => {
                    return (
                        <PaymentAccordionItem
                            key={index}
                            mode={mode}
                            transactionId={item?.id}
                            orderId={orderId}
                            type={'refund'}
                            amount={item.amount}
                            notes={item.notes}
                            author={item.author}
                            updatedAt={item.updatedAt}
                        />
                    );
                })}
            </Grid>
        </Grid>
    );
}
