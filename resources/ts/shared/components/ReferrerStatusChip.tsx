import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { ReferrerStatusColorsMap, ReferrerStatusEnum } from '@shared/constants/ReferrerStatusEnum';

type ReferrerStatusChipProps = Omit<ChipProps, 'color'> & { color: ReferrerStatusEnum };

export const ReferrerStatusChip = styled(({ color, ...rest }: ReferrerStatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = ReferrerStatusEnum.ACTIVE }) => {
        return {
            backgroundColor: ReferrerStatusColorsMap[color].secondary,
            color: ReferrerStatusColorsMap[color].primary,
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
        name: 'ReferrerStatusChip',
    },
);
