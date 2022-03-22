import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { PaymentStatusColorsMap, PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';

export type SubmissionStatusChipColor = keyof typeof PaymentStatusColorsMap;

type PaymentStatusChipProps = Omit<ChipProps, 'color'> & { color: PaymentStatusEnum };

export const PaymentStatusChip = styled(({ color, ...rest }: PaymentStatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = PaymentStatusEnum.DUE }) => {
        return {
            backgroundColor: PaymentStatusColorsMap[color].secondary,
            color: PaymentStatusColorsMap[color].primary,
            padding: theme.spacing(1.25, 0.25),
            textTransform: 'uppercase',
            letterSpacing: '0.093em',
            fontWeight: 500,
        };
    },
    {
        name: 'PaymentStatusChip',
    },
);
