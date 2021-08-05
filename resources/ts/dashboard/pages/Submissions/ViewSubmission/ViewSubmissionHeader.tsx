import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/Print';
import { useParams } from 'react-router-dom';

import { useViewSubmissionHeaderStyles } from './styles';

/**
 * @parent ViewSubmissionHeader
 * @private
 * @constructor
 */
export function ViewSubmissionHeader() {
    const params = useParams<{ id: string }>();
    const classes = useViewSubmissionHeaderStyles();
    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Grid item xs>
                <Typography variant={'h5'}>
                    Submission <i>#</i> <b>{params.id}</b>
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
