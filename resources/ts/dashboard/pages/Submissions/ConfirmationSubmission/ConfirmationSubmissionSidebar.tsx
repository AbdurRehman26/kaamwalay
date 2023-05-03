import CheckIcon from '@mui/icons-material/Check';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Navigate } from 'react-router-dom';
import { PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { useOrderQuery } from '@shared/redux/hooks/useOrderQuery';
import { font } from '@shared/styles/utils';
import PayNowStatusNotice from '@dashboard/components/PayNow/PayNowStatusNotice';
import PaymentStatusNotice from '@dashboard/components/PaymentStatusNotice';
import { useConfirmationSubmissionSidebarStyles } from './style';

interface ConfirmationSubmissionsSidebarProps {
    orderId: number;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ConfirmationSubmissionSidebar
 * @date: 07.08.2021
 * @time: 00:11
 */
export function ConfirmationSubmissionSidebar({ orderId }: ConfirmationSubmissionsSidebarProps) {
    const classes = useConfirmationSubmissionSidebarStyles();
    const { isLoading, isError, data, error } = useOrderQuery({
        resourceId: orderId,
        config: {
            params: {
                include: [
                    'paymentPlan',
                    'invoice',
                    'shippingMethod',
                    'orderItems.orderItemStatus',
                    'orderItems.cardProduct.cardSet.cardSeries',
                    'orderItems.cardProduct.cardCategory',
                    'orderStatus',
                ],
            },
        },
    });
    const message = (error as Error)?.message || error;
    const endTime = new Date(new Date(data?.createdAt).getTime() + 86400000);
    const timeInMs = new Date() <= endTime ? new Date(data?.createdAt).getTime() + 86400000 : 0;
    const { featureOrderWalletCreditEnabled } = useConfiguration();

    if (message === 'This action is unauthorized.') {
        return <Navigate to={'/submissions'} replace />;
    }

    if (isLoading || isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {isLoading ? <CircularProgress /> : <Typography color={'error'}>Error loading submission</Typography>}
            </Box>
        );
    }

    if (!data) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                <Typography color={'error'}>Submission not found.</Typography>
            </Box>
        );
    }

    return (
        <>
            <Paper variant={'outlined'} className={classes.root}>
                <Box paddingY={3} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Avatar className={classes.successIconHolder}>
                        <CheckIcon className={classes.successIcon} />
                    </Avatar>
                    <Typography align={'center'} variant={'h6'} className={font.fontWeightBold} gutterBottom>
                        Submission Confirmed!
                    </Typography>
                    <Typography align={'center'} variant={'body2'}>
                        Follow the shipping instructions to send in your cards for grading.
                    </Typography>
                </Box>
                <Divider />
                <Box paddingY={3}>
                    <TableContainer>
                        <Table size={'small'}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Submission Number:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {data.orderNumber}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Service level:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {formatCurrency(data.paymentPlan.price)}&nbsp;/ Card
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>No. of Cards:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {data.numberOfCards}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Shipping Method:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {data.shippingMethod?.name}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Date:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {formatDate(data.createdAt, 'M/DD/YYYY')}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Total declared value:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {formatCurrency(data.totalDeclaredValue)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Divider />
                <Box paddingY={3}>
                    <Typography variant={'body1'} className={font.fontWeightMedium}>
                        Price Summary
                    </Typography>
                    <TableContainer>
                        <Table size={'small'}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Service Level Fee:</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'caption'} align={'right'} color={'textSecondary'}>
                                            ({formatCurrency(data.paymentPlan?.price)}&nbsp;×&nbsp;{data.numberOfCards})
                                            = &nbsp;
                                            <Typography
                                                component={'span'}
                                                variant={'body2'}
                                                align={'right'}
                                                color={'textPrimary'}
                                                className={font.fontWeightMedium}
                                            >
                                                {formatCurrency(data.paymentPlan?.price * data.numberOfCards)}
                                            </Typography>
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                {Number(data?.paymentMethodDiscountedAmount) > 0 ? (
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant={'body2'}>Collector Coin Discount:</Typography>
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <Typography
                                                component={'span'}
                                                variant={'body2'}
                                                align={'right'}
                                                color={'textPrimary'}
                                                className={font.fontWeightMedium}
                                            >
                                                -{formatCurrency(data?.paymentMethodDiscountedAmount)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                {Number(data?.amountPaidFromWallet) > 0 ? (
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant={'body2'}>Credit:</Typography>
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <Typography
                                                component={'span'}
                                                variant={'body2'}
                                                align={'right'}
                                                color={'textPrimary'}
                                                className={font.fontWeightMedium}
                                            >
                                                -{formatCurrency(data?.amountPaidFromWallet)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                {Number(data?.discountedAmount) > 0 ? (
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant={'body2'}>Promo Code Discount:</Typography>
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <Typography
                                                component={'span'}
                                                variant={'body2'}
                                                align={'right'}
                                                color={'textPrimary'}
                                                className={font.fontWeightMedium}
                                            >
                                                -{formatCurrency(data?.discountedAmount)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : null}

                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>
                                            <Box component={'span'} display={'inline-flex'} alignItems={'center'}>
                                                Insured Shipping:
                                                {/* <Tooltip title={'Insured Shipping'} placement={'top'}> */}
                                                {/*    <InfoIcon color={'disabled'} className={classes.tooltipIcon} /> */}
                                                {/* </Tooltip> */}
                                            </Box>
                                        </Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {formatCurrency(data.shippingFee)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>

                                {data.cleaningFee > 0 ? (
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant={'body2'}>
                                                <Box component={'span'} display={'inline-flex'} alignItems={'center'}>
                                                    Cleaning Fee:
                                                </Box>
                                            </Typography>
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <Typography
                                                variant={'body2'}
                                                align={'right'}
                                                className={font.fontWeightMedium}
                                            >
                                                {formatCurrency(data.cleaningFee)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Divider />
                <Box paddingY={3}>
                    <TableContainer>
                        <Table size={'small'}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant={'body2'}>Total</Typography>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <Typography variant={'body2'} align={'right'} className={font.fontWeightMedium}>
                                            {formatCurrency(data.grandTotal)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
            {data?.paymentStatus !== PaymentStatusEnum.PAID && timeInMs !== 0 && featureOrderWalletCreditEnabled ? (
                <Grid mt={'20px'}>
                    <PayNowStatusNotice
                        id={orderId}
                        countdownTimestampMs={timeInMs}
                        isConfirmationPage={true}
                        isPayPage={false}
                        isCoupon={false}
                    />
                </Grid>
            ) : null}
            {data?.paymentStatus !== PaymentStatusEnum.PAID && (!featureOrderWalletCreditEnabled || timeInMs === 0) ? (
                <Grid mt={'20px'}>
                    <PaymentStatusNotice id={orderId} paymentStatus={data?.paymentStatus} hasWidth={true} />
                </Grid>
            ) : null}
        </>
    );
}

export default ConfirmationSubmissionSidebar;
