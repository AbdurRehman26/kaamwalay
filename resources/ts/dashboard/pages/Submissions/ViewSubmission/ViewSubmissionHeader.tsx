import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/Print';
import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { useViewSubmissionHeaderStyles } from './styles';

interface ViewSubmissionHeaderProps {
    orderNumber: string;
    invoicePath?: string;
    invoiceNumber?: string;
}

/**
 * @parent ViewSubmissionHeader
 * @private
 * @constructor
 */
export function ViewSubmissionHeader({ orderNumber, invoicePath, invoiceNumber }: ViewSubmissionHeaderProps) {
    const classes = useViewSubmissionHeaderStyles();
    const { id }: any = useParams();
    const history = useHistory();

    const handlePrintPackingSlipPress = useCallback(() => {
        downloadFromUrl(invoicePath!, `robograding-${invoiceNumber}.pdf`);
    }, [id, invoicePath, invoiceNumber]);

    const shippingInstructionsPress = useCallback(() => {
        history.push(`/submissions/${id}/confirmation`);
    }, [id]);

    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Grid item xs>
                <Typography variant={'h5'}>
                    Submission <i>#</i> <b>{orderNumber}</b>
                </Typography>
            </Grid>

            <Grid item container xs justifyContent={'flex-end'}>
                <Button
                    startIcon={<PrintIcon />}
                    disabled={!invoicePath}
                    onClick={handlePrintPackingSlipPress}
                    color={'primary'}
                >
                    Print Packing Slip
                </Button>
                <Button className={classes.button} onClick={shippingInstructionsPress}>
                    Shipping Instructions
                </Button>
            </Grid>
        </Grid>
    );
}
