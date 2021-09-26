import PrintIcon from '@mui/icons-material/Print';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useViewSubmissionHeaderStyles } from './styles';

interface ViewSubmissionHeaderProps {
    orderNumber: string;
}

/**
 * @parent ViewSubmissionHeader
 * @private
 * @constructor
 */
export function ViewSubmissionHeader({ orderNumber }: ViewSubmissionHeaderProps) {
    const classes = useViewSubmissionHeaderStyles();
    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Grid item xs>
                <Typography variant={'h5'}>
                    Submission <i>#</i> <b>{orderNumber}</b>
                </Typography>
            </Grid>

            <Grid item container xs justifyContent={'flex-end'}>
                <Button startIcon={<PrintIcon />} color={'primary'}>
                    Print Packing Slip
                </Button>
                <Button className={classes.button}>Shipping Instructions</Button>
            </Grid>
        </Grid>
    );
}
