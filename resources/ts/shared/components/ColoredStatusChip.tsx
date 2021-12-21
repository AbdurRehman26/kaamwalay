import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';

export const ColoredStatusChip = styled(({ color, ...rest }: any) => <Chip {...rest} />)(
    ({ theme, color }) => {
        return {
            backgroundColor: color,
            color: theme.palette.getContrastText(color),
            borderRadius: 4,
            padding: theme.spacing(0.75, 0.25),
        };
    },
    {
        name: 'ColoredStatusChip',
    },
);
