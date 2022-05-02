import Chip, { ChipProps } from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const colorsMap = {
    incomplete: '#e1e1e1',
    placed: '#e1e1e1',
    reviewed: '#fff06c',
    confirmed: '#fff06c',
    graded: '#81d5f9',
    shipped: '#8feca9',
    // eslint-disable-next-line camelcase
    in_vault: '#8feca9',
    // eslint-disable-next-line camelcase
    pending_payment: '#e1e1e1',
};

export type StatusChipColor = 'primary' | 'secondary' | keyof typeof colorsMap;

type StatusChipProps = Omit<ChipProps, 'color'> & { color?: StatusChipColor };

export const StatusChip = styled(({ color, ...rest }: StatusChipProps) => <Chip {...rest} />)(
    ({ theme, color = 'incomplete' }) => {
        let color$: string = color;
        if (color$ && color$ in colorsMap) {
            color$ = colorsMap[color$ as keyof typeof colorsMap];
        } else if (color$ && color$ in theme.palette) {
            color$ = (theme.palette[color$ as keyof typeof theme.palette] as any)?.main;
        } else {
            color$ = colorsMap.incomplete;
        }

        return {
            backgroundColor: color$ || colorsMap.incomplete,
            color: theme.palette.getContrastText(color$ || colorsMap.incomplete),
            borderRadius: 4,
            padding: theme.spacing(0.75, 0.25),
        };
    },
    {
        name: 'StatusChip',
    },
);
