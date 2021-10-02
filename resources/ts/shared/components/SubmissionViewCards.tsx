import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import font from '@shared/styles/font.module.css';
import { OrderItemEntity } from '../entities/OrderItemEntity';
import { cx } from '../lib/utils/cx';
import { formatCurrency } from '../lib/utils/formatCurrency';

interface SubmissionViewCardsProps {
    items: OrderItemEntity[];
    serviceLevelPrice: number;
    orderStatusID?: number;
}

export const useStyles = makeStyles(
    (theme) => ({
        containerBox: {
            padding: 0,
            [theme.breakpoints.down('xs')]: {
                maxWidth: '98%',
            },
        },
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
        viewGradeText: {
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            textAlign: 'center',
            letterSpacing: '0.35px',
            color: '#20BFB8',
            textDecoration: 'none',
        },
        cardDataKeyText: {
            fontWeight: 'bold',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        cardDataKeyValue: {
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
    }),
    { name: 'SubmissionViewCards' },
);

export function SubmissionViewCards({ items, serviceLevelPrice, orderStatusID }: SubmissionViewCardsProps) {
    const classes = useStyles();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const GradeRoot = isMobile ? 'a' : Box;
    return (
        <Box px={3} className={classes.containerBox}>
            <TableContainer className={classes.root}>
                <Table>
                    <TableHead className={classes.header}>
                        <TableRow>
                            <TableCell variant={'head'}>Card</TableCell>
                            <TableCell variant={'head'}>Grade</TableCell>
                            {isMobile ? null : (
                                <>
                                    <TableCell variant={'head'}>Value (USD)</TableCell>
                                    <TableCell variant={'head'} align={'right'}>
                                        Paid
                                    </TableCell>
                                </>
                            )}
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

                                            {!isMobile ? (
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
                                            ) : null}

                                            {!isMobile ? null : (
                                                <>
                                                    <Box>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyText}
                                                        >
                                                            Card ID:
                                                        </Typography>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyValue}
                                                        >
                                                            &nbsp;{item.id}
                                                        </Typography>
                                                    </Box>

                                                    {item.certificateNumber ? (
                                                        <Box>
                                                            <Typography
                                                                variant={'caption'}
                                                                color={'textSecondary'}
                                                                className={classes.cardDataKeyText}
                                                            >
                                                                Certificate ID:
                                                            </Typography>
                                                            <Typography
                                                                variant={'caption'}
                                                                color={'textSecondary'}
                                                                className={classes.cardDataKeyValue}
                                                            >
                                                                &nbsp;{item.certificateNumber}
                                                            </Typography>
                                                        </Box>
                                                    ) : null}

                                                    <Box>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyText}
                                                        >
                                                            Value (USD):
                                                        </Typography>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyValue}
                                                        >
                                                            &nbsp;{formatCurrency(item.declaredValuePerUnit)}
                                                        </Typography>
                                                    </Box>

                                                    <Box>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyText}
                                                        >
                                                            Paid:
                                                        </Typography>
                                                        <Typography
                                                            variant={'caption'}
                                                            color={'textSecondary'}
                                                            className={classes.cardDataKeyValue}
                                                        >
                                                            &nbsp;{formatCurrency(serviceLevelPrice)}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {(orderStatusID === OrderStatusEnum.GRADED ||
                                        orderStatusID === OrderStatusEnum.SHIPPED) &&
                                    item?.userCard?.overallGrade !== '0' &&
                                    item?.userCard?.overallGradeNickname ? (
                                        <GradeRoot
                                            target={'_blank'}
                                            href={`https://robograding.com/feed/${item.certificateNumber}/view/`}
                                            flexDirection={'column'}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Typography
                                                variant={'body2'}
                                                className={cx(
                                                    font.fontWeightBold,
                                                    isMobile ? classes.gradeBadge : null,
                                                )}
                                            >
                                                {item?.userCard?.overallGrade}
                                            </Typography>
                                            {isMobile ? null : (
                                                <a
                                                    target={'_blank'}
                                                    href={`https://robograding.com/feed/${item.certificateNumber}/view/`}
                                                    style={{ textDecoration: 'none' }}
                                                    rel="noreferrer"
                                                >
                                                    <Typography variant={'body2'} className={classes.viewGradeText}>
                                                        View Grade
                                                    </Typography>
                                                </a>
                                            )}
                                        </GradeRoot>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                {isMobile ? null : (
                                    <>
                                        <TableCell>
                                            <Typography variant={'body2'}>
                                                {formatCurrency(item.declaredValuePerUnit)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <Typography variant={'body2'}>
                                                {formatCurrency(serviceLevelPrice)}
                                            </Typography>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default SubmissionViewCards;
