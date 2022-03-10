import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
    PaymentNoticeHeadingMap,
    PaymentNoticeTextMap,
    PaymentStatusColorsMap,
    PaymentStatusEnum,
} from '@shared/constants/PaymentStatusEnum';

const styles = {
    paymentNoteContainer: {
        borderRadius: 1.5,
        padding: 1.5,
    },
    paymentNoteIcon: {
        minWidth: 24,
        height: 24,
        marginRight: 1.25,
    },
    paymentNoteHeading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        alignItems: 'center',
    },
    payNowButton: {
        marginTop: 1,
        padding: '12px 36px 12px 36px',
    },
};

interface PaymentPendingNoticeProps {
    id: number;
    paymentStatus: PaymentStatusEnum;
}

export default function PaymentStatusNotice(props: PaymentPendingNoticeProps) {
    const navigate = useNavigate();

    const { id } = props;

    return (
        <Paper
            sx={{
                ...styles.paymentNoteContainer,
                backgroundColor: PaymentStatusColorsMap[props.paymentStatus].secondary,
                border: '1px solid ' + PaymentStatusColorsMap[props.paymentStatus].primary,
            }}
        >
            <Typography variant={'h6'} sx={styles.paymentNoteHeading}>
                {props.paymentStatus === PaymentStatusEnum.PENDING ? (
                    <MonetizationOnOutlinedIcon
                        sx={{
                            ...styles.paymentNoteIcon,
                            color: PaymentStatusColorsMap[props.paymentStatus].primary,
                        }}
                    />
                ) : null}
                {props.paymentStatus !== PaymentStatusEnum.PENDING ? (
                    <ErrorOutlineIcon
                        sx={{
                            ...styles.paymentNoteIcon,
                            color: PaymentStatusColorsMap[props.paymentStatus].primary,
                        }}
                    />
                ) : null}
                {PaymentNoticeHeadingMap[props.paymentStatus]}
            </Typography>
            <Typography variant={'body2'} mt={1} mb={1}>
                {PaymentNoticeTextMap[props.paymentStatus]}
            </Typography>
            <Button
                onClick={() => navigate(`/submissions/${id}/pay`)}
                variant={'contained'}
                color={'primary'}
                sx={styles.payNowButton}
            >
                pay now
            </Button>
        </Paper>
    );
}
