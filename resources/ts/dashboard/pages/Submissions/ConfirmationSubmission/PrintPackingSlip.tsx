import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import FileDownloadIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import React, { useMemo } from 'react';

import packingSlip from '@shared/assets/packingSlip.jpg';

import { usePrintPackingSlipStyles } from './style';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: PrintPackingSlip
 * @date: 07.08.2021
 * @time: 01:33
 */
export function PrintPackingSlip() {
    const classes = usePrintPackingSlipStyles();

    const buttonClasses = useMemo(
        () => ({ root: classes.button, label: classes.buttonLabel }),
        [classes.button, classes.buttonLabel],
    );

    return (
        <Paper className={classes.root} square elevation={3}>
            <img
                src={packingSlip}
                width={164}
                height={212}
                className={classes.image}
                alt={'Packing slip print preview'}
            />

            <footer className={classes.footer}>
                <Button classes={buttonClasses}>
                    <FileDownloadIcon />
                    Save
                </Button>
                <Divider orientation={'vertical'} className={classes.divider} />
                <Button classes={buttonClasses}>
                    <PrintIcon />
                    Print
                </Button>
            </footer>
        </Paper>
    );
}

export default PrintPackingSlip;
