import CircularProgress from '@mui/material/CircularProgress';
import Grow from '@mui/material/Grow';
import makeStyles from '@mui/styles/makeStyles';

interface AccordionCardItemLoaderProps {
    show: boolean;
}

const useStyles = makeStyles(
    () => ({
        root: {
            backgroundColor: 'rgba(255, 255, 255, .7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            zIndex: 20,
        },
    }),
    { name: 'AccordionCardItemLoader' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AccordionCardItemLoader
 * @date: 11.09.2021
 * @time: 01:18
 */
export function AccordionCardItemLoader({ show }: AccordionCardItemLoaderProps) {
    const classes = useStyles();

    return (
        <Grow in={show} unmountOnExit>
            <div className={classes.root}>
                <CircularProgress size={24} color={'primary'} />
            </div>
        </Grow>
    );
}

export default AccordionCardItemLoader;
