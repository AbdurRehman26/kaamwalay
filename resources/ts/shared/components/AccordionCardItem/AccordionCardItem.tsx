import makeStyles from '@mui/styles/makeStyles';
import { PropsWithChildren } from 'react';
import { cx } from '@shared/lib/utils/cx';
import { AccordionCardItemProvider } from './AccordionCardItemContext';

export interface AccordionCardItemProps {
    divider?: boolean;
    variant?: 'outlined';
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(1.5, 2),
            position: 'relative',
        },

        divider: {
            borderBottom: `1px solid ${theme.palette.divider}`,
            '&:last-child': {
                borderBottom: 'none',
            },
        },

        outlined: {
            border: `1px solid #e0e0e0`,
            borderRadius: 4,
            marginBottom: theme.spacing(4),
        },
    }),
    { name: 'AccordionCardItem' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AccordionCardItem
 * @date: 28.08.2021
 * @time: 19:06
 */
export function AccordionCardItem({ children, divider, variant }: PropsWithChildren<AccordionCardItemProps>) {
    const classes = useStyles();

    return (
        <AccordionCardItemProvider>
            <section
                className={cx(classes.root, {
                    [classes.outlined]: variant === 'outlined',
                    [classes.divider]: divider,
                })}
            >
                {children}
            </section>
        </AccordionCardItemProvider>
    );
}

export default AccordionCardItem;
