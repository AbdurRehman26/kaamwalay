import FileDownloadIcon from '@mui/icons-material/GetApp';
import PrintIcon from '@mui/icons-material/Print';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { plainToInstance } from 'class-transformer';
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
    const order = useAppSelector((state) => plainToInstance(OrderEntity, state.orders.entities[orderId]));
    const isLoading = useAppSelector((state) => state.orders.isLoading[orderId]);
    const error = useAppSelector((state) => state.orders.errors[`show_${orderId}`]);
    const isError = !!error;

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
            } catch (e: any) {
                notifications.exception(e);
            }
            setDownloading(false);
        },
        [downloading, invoice, invoiceNumber, notifications],
    );

    useRetry(
        async () => {
            await dispatch(showOrderAction({ resourceId: orderId, skipLoading: true }));
        },
        () => !isError && !invoice,
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
                        <Box p={1}>
                            <CircularProgress size={24} color={'inherit'} />
                        </Box>
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
