import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

export const ColoredStatusChip = styled(({ color, textColor, ...rest }: any) => <Chip {...rest} />)(
    ({ theme, color, textColor }) => {
        return {
            backgroundColor: color,
            color: textColor,
            borderRadius: 16,
            padding: theme.spacing(0.75, 0.25),
        };
    },
    {
        name: 'ColoredStatusChip',
    },
);
