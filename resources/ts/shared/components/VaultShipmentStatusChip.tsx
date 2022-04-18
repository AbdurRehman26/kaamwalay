import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { VaultShipmentStatusColorsMap, VaultShipmentStatusEnum } from '@shared/constants/VaultShipmentStatusEnum';

export type SubmissionStatusChipColor = keyof typeof VaultShipmentStatusColorsMap;

type VaultShipmentStatusChipProps = Omit<ChipProps, 'color'> & { color: VaultShipmentStatusEnum };

export const VaultShipmentStatusChip = styled(({ color, ...rest }: VaultShipmentStatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = VaultShipmentStatusEnum.PENDING }) => {
        return {
            backgroundColor: VaultShipmentStatusColorsMap[color].secondary,
            color: VaultShipmentStatusColorsMap[color].primary,
            padding: theme.spacing(1.25, 0.25),
            textTransform: 'uppercase',
            letterSpacing: '0.093em',
            borderRadius: 16,
            fontWeight: 500,
            fontSize: 12,
        };
    },
    {
        name: 'VaultShipmentStatusChip',
    },
);
