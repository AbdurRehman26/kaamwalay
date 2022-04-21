import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';

type StatusColorProps = {
    primary: string;
    secondary: string;
};
const colorsMap: { [key in OrderStatusEnum]: StatusColorProps } = {
    [OrderStatusEnum.INCOMPLETE]: { primary: '#000000', secondary: 'rgba(0, 0, 0, 0.12)' },
    [OrderStatusEnum.PLACED]: { primary: 'rgba(154, 31, 149, 1)', secondary: 'rgba(154, 31, 149, 0.12)' },
    [OrderStatusEnum.CONFIRMED]: { primary: 'rgba(39, 153, 179, 1)', secondary: 'rgba(39, 153, 179, 0.12)' },
    [OrderStatusEnum.GRADED]: { primary: 'rgba(33, 70, 199, 1)', secondary: 'rgba(33, 70, 199, 0.12)' },
    [OrderStatusEnum.SHIPPED]: { primary: 'rgba(32, 169, 38, 1)', secondary: 'rgba(32, 169, 38, 0.12)' },
    [OrderStatusEnum.CANCELLED]: { primary: '#000000', secondary: 'rgba(0, 0, 0, 0.12)' },
    [OrderStatusEnum.REVIEWED]: { primary: '#000000', secondary: 'rgba(0, 0, 0, 0.12)' },
    [OrderStatusEnum.IN_VAULT]: { primary: 'rgba(32, 169, 38, 1)', secondary: 'rgba(32, 169, 38, 0.12)' },
};

export type SubmissionStatusChipColor = keyof typeof colorsMap;

type SubmissionStatusChipProps = Omit<ChipProps, 'color'> & { color: OrderStatusEnum };

export const SubmissionStatusChip = styled(({ color, ...rest }: SubmissionStatusChipProps) => <Chip {...rest} />)(
    ({ theme, color }) => {
        return {
            backgroundColor: colorsMap[color].secondary,
            color: colorsMap[color].primary,
            padding: theme.spacing(1.25, 0.25),
            textTransform: 'uppercase',
            letterSpacing: '0.093em',
            fontWeight: 500,
        };
    },
    {
        name: 'SubmissionStatusChip',
    },
);
