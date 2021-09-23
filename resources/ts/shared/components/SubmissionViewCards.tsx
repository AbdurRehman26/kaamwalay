import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import font from '@shared/styles/font.module.css';
import { OrderItemEntity } from '../entities/OrderItemEntity';
import { cx } from '../lib/utils/cx';
import { formatCurrency } from '../lib/utils/formatCurrency';

interface SubmissionViewCardsProps {
    items: OrderItemEntity[];
    serviceFee: number;
}

export const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(4),
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            '& $header, & $footer': {
                backgroundColor: '#f9f9f9',
            },
        },
        header: {},
        footer: {},
        gutterRight: {
            marginRight: theme.spacing(1),
        },
        cardImage: {
            width: 40,
            height: 56,
            objectFit: 'contain',
            objectPosition: 'center center',
        },
        gradeBadge: {
            width: 36,
            height: 36,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: 18,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }),
    { name: 'SubmissionViewCards' },
);

export function SubmissionViewCards({ items, serviceFee }: SubmissionViewCardsProps) {
    const classes = useStyles();

    return (
        <Box px={3}>
            <TableContainer className={classes.root}>
                <Table>
                    <TableHead className={classes.header}>
                        <TableRow>
                            <TableCell variant={'head'}>Card</TableCell>
                            <TableCell variant={'head'}>Grade</TableCell>
                            <TableCell variant={'head'}>Value (USD)</TableCell>
                            <TableCell variant={'head'} align={'right'}>
                                Paid
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Box display={'flex'} alignItems={'center'}>
                                        <img
                                            src={item.cardProduct.imagePath}
                                            className={classes.cardImage}
                                            alt={item.cardProduct.imagePath}
                                        />
                                        <Box display={'flex'} flexDirection={'column'} paddingLeft={1}>
                                            <Typography variant={'body2'}>{item.cardProduct.getName()}</Typography>
                                            <Typography variant={'body2'}>
                                                {item.cardProduct.getDescription()}
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    variant={'caption'}
                                                    color={'textSecondary'}
                                                    className={classes.gutterRight}
                                                >
                                                    Card #: {item.cardProduct.cardNumberOrder}
                                                </Typography>
                                                <Typography
                                                    variant={'caption'}
                                                    color={'textSecondary'}
                                                    className={classes.gutterRight}
                                                >
                                                    ID: {item.id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {!item ? (
                                        <Typography
                                            variant={'body2'}
                                            className={cx(font.fontWeightBold, classes.gradeBadge)}
                                        >
                                            8.7
                                        </Typography>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant={'body2'}>
                                        {formatCurrency(item.declaredValuePerUnit)}
                                    </Typography>
                                </TableCell>
                                <TableCell align={'right'}>
                                    <Typography variant={'body2'}>
                                        {formatCurrency(item.quantity * serviceFee)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default SubmissionViewCards;
