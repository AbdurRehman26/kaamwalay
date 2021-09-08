import Chip, { ChipProps } from '@material-ui/core/Chip';
import { styled, Theme } from '@material-ui/core/styles';

const colorsMap = {
    pending: '#e1e1e1',
    reviewed: '#fff06c',
    graded: '#81d5f9',
    shipped: '#8feca9',
};

export type StatusChipColor = 'primary' | 'secondary' | keyof typeof colorsMap;

type StatusChipProps = Omit<ChipProps, 'color'> & { color?: StatusChipColor };

export const StatusChip = styled(({ color, ...rest }: StatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = 'pending' }: StatusChipProps & { theme: Theme }) => {
        let color$: string = color;
        if (color$ && color$ in colorsMap) {
            color$ = colorsMap[color$ as keyof typeof colorsMap];
        } else if (color$ && color$ in theme.palette) {
            color$ = (theme.palette[color$ as keyof typeof theme.palette] as any)?.main;
        }

        return {
            backgroundColor: color$ || colorsMap.pending,
            color: theme.palette.getContrastText(color$ || colorsMap.pending),
            borderRadius: 4,
            padding: theme.spacing(0.75, 0.25),
        };
    },
    {
        name: 'StatusChip',
    },
);
