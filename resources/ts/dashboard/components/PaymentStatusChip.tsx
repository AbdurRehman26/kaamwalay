import Chip from '@mui/material/Chip';
import { PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';
import { PaymentStatusPrimaryColorCodesEnum } from '@shared/constants/PaymentStatusPrimaryColorCodesEnum';
import { PaymentStatusSecondaryColorCodesEnum } from '@shared/constants/PaymentStatusSecondaryColorCodesEnum';

interface PaymentPendingChipProps {
    paymentStatus: String;
}

export default function PaymentStatusChip(props: PaymentPendingChipProps) {
    return (
        <Chip
            label={PaymentStatusEnum[props.paymentStatus as keyof typeof PaymentStatusEnum]}
            variant={'outlined'}
            sx={{
                color: PaymentStatusPrimaryColorCodesEnum[
                    props.paymentStatus as keyof typeof PaymentStatusPrimaryColorCodesEnum
                ],
                borderColor: 'transparent',
                backgroundColor:
                    PaymentStatusSecondaryColorCodesEnum[
                        props.paymentStatus as keyof typeof PaymentStatusSecondaryColorCodesEnum
                    ],
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500,
            }}
        />
    );
}
