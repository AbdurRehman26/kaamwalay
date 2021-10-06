import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/core/styles';
import { PropsWithChildren } from 'react';
import { useAccordionCardItemContext } from './AccordionCardItemContext';

interface AccordionCardItemHeaderContent {}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
    }),
    { name: 'AccordionCardItemContent' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AccordionCardItemContent
 * @date: 30.08.2021
 * @time: 21:33
 */
export function AccordionCardItemContent({ children }: PropsWithChildren<AccordionCardItemHeaderContent>) {
    const { isExpanded } = useAccordionCardItemContext();
    const classes = useStyles();

    return (
        <main className={classes.root}>
            <Collapse in={isExpanded} unmountOnExit timeout={100}>
                {children}
            </Collapse>
        </main>
    );
}

export default AccordionCardItemContent;
