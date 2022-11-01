import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { SalesRapStatusColorsMap, SalesRapStatusEnum } from '@shared/constants/SalesRapStatusEnum';

export type SubmissionStatusChipColor = keyof typeof SalesRapStatusColorsMap;

type SalesRepStatusChipProps = Omit<ChipProps, 'color'> & { color: SalesRapStatusEnum };

export const SalesRepStatusChip = styled(({ color, ...rest }: SalesRepStatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = SalesRapStatusEnum.ACTIVE }) => {
        return {
            backgroundColor: SalesRapStatusColorsMap[color].secondary,
            color: SalesRapStatusColorsMap[color].primary,
            padding: theme.spacing(1.25, 0.25),
            textTransform: 'uppercase',
            letterSpacing: '0.093em',
            borderRadius: 4,
            fontWeight: 500,
            [theme.breakpoints.down('sm')]: {
                letterSpacing: '0',
            },
        };
    },
    {
        name: 'SalesRepStatusChip',
    },
);
