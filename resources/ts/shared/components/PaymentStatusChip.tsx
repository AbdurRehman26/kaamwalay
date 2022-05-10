import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { PaymentStatusColorsMap, PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';

export type SubmissionStatusChipColor = keyof typeof PaymentStatusColorsMap;

type PaymentStatusChipProps = Omit<ChipProps, 'color'> & { color: PaymentStatusEnum; mode?: string };

export const PaymentStatusChip = styled(({ color, mode, ...rest }: PaymentStatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = PaymentStatusEnum.DUE, mode = 'admin' }) => {
        return {
            backgroundColor: PaymentStatusColorsMap[color].secondary,
            color: PaymentStatusColorsMap[color].primary,
            padding: theme.spacing(1.25, 0.25),
            textTransform: 'uppercase',
            letterSpacing: '0.093em',
            borderRadius: mode === 'admin' ? 4 : 16,
            fontWeight: 500,
            [theme.breakpoints.down('sm')]: {
                letterSpacing: '0',
            },
        };
    },
    {
        name: 'PaymentStatusChip',
    },
);
