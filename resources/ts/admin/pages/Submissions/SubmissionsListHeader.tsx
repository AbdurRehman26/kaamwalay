import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import React from 'react';

function SubmissionsListHeader(props) {
    return (
        <Grid container>
            <Grid container>
                <Grid item xs>
                    <Typography>Submissions</Typography>
                </Grid>
                <Grid item xs>
                    <Button variant={'contained'} color={'primary'} startIcon={<Icon>qr_code_scanner</Icon>} disabled>
                        Scan Barcode
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SubmissionsListHeader;
