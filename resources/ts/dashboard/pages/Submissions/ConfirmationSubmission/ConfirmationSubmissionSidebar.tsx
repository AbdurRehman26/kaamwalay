import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import React from 'react';
import { useOrderQuery } from '@shared/hooks/useOrderQuery';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { formatCurrency } from '@shared/lib/utils/formatCurrency';
import { font } from '@shared/styles/utils';
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
    const { isLoading, isError, data } = useOrderQuery({ resourceId: orderId });

    if (isLoading || isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {isLoading ? <CircularProgress /> : <Typography color={'error'}>Error loading submission</Typography>}
            </Box>
        );
    }
    return (
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
                                        {data.shippingMethod.name}
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
                                        ({formatCurrency(data.paymentPlan.price)}&nbsp;×&nbsp;{data.numberOfCards}) =
                                        &nbsp;
                                        <Typography
                                            component={'span'}
                                            variant={'body2'}
                                            align={'right'}
                                            color={'textPrimary'}
                                            className={font.fontWeightMedium}
                                        >
                                            {formatCurrency(data.paymentPlan.price * data.numberOfCards)}
                                        </Typography>
                                    </Typography>
                                </TableCell>
                            </TableRow>
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
    );
}

export default ConfirmationSubmissionSidebar;
