import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FileDownloadIcon from '@material-ui/icons/GetApp';
import PrintIcon from '@material-ui/icons/Print';
import { plainToClass } from 'class-transformer';
import React, { useCallback, useMemo, useState } from 'react';
import packingSlip from '@shared/assets/packingSlip.jpg';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRetry } from '@shared/hooks/useRetry';
import { downloadFromUrl } from '@shared/lib/api/downloadFromUrl';
import { showOrderAction } from '@shared/redux/slices/ordersSlice';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { usePrintPackingSlipStyles } from './style';

interface PrintPackingSlipProps {
    orderId: number;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: PrintPackingSlip
 * @date: 07.08.2021
 * @time: 01:33
 */
export function PrintPackingSlip({ orderId }: PrintPackingSlipProps) {
    const [downloading, setDownloading] = useState(false);
    const notifications = useNotifications();
    const classes = usePrintPackingSlipStyles();
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.orders.isLoading[orderId]);
    const order = useAppSelector((state) => plainToClass(OrderEntity, state.orders.entities[orderId]));

    const invoiceNumber = order?.invoice?.invoiceNumber;
    const invoice = order?.invoice?.path;

    const buttonClasses = useMemo(
        () => ({ root: classes.button, label: classes.buttonLabel }),
        [classes.button, classes.buttonLabel],
    );

    const handleDownload = useCallback(
        async function handleDownload() {
            if (downloading) {
                return;
            }

            setDownloading(true);
            try {
                await downloadFromUrl(invoice!, `robograding-${invoiceNumber}.pdf`);
            } catch (e) {
                notifications.exception(e);
            }
            setDownloading(false);
        },
        [downloading, invoice, invoiceNumber, notifications],
    );

    useRetry(
        async () => {
            await dispatch(showOrderAction({ resourceId: orderId }));
        },
        () => !invoice,
    );

    return (
        <>
            {!isLoading && !invoice ? (
                <Typography color={'inherit'} variant={'body2'} paragraph>
                    We are preparing your packaging slip. You will be able to view and download it once it is ready.
                </Typography>
            ) : null}
            <Paper className={classes.root} square elevation={3}>
                <img
                    src={packingSlip}
                    width={164}
                    height={212}
                    className={classes.image}
                    alt={'Packing slip print preview'}
                />

                <footer className={classes.footer}>
                    {isLoading ? (
                        <CircularProgress size={24} color={'inherit'} />
                    ) : invoice ? (
                        <>
                            <Button onClick={handleDownload} color={'inherit'} classes={buttonClasses}>
                                {downloading ? (
                                    <CircularProgress size={24} color={'inherit'} />
                                ) : (
                                    <>
                                        <FileDownloadIcon />
                                        Save
                                    </>
                                )}
                            </Button>
                            <Divider orientation={'vertical'} className={classes.divider} />
                            <Button
                                href={invoice}
                                target={'_blank'}
                                rel={'noreferrer noopener'}
                                color={'inherit'}
                                classes={buttonClasses}
                            >
                                <PrintIcon />
                                Print
                            </Button>
                        </>
                    ) : (
                        <Box p={1}>
                            <Typography color={'inherit'} variant={'body2'}>
                                Processing
                            </Typography>
                        </Box>
                    )}
                </footer>
            </Paper>
        </>
    );
}

export default PrintPackingSlip;
