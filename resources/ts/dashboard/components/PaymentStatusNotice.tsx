import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PaymentStatusEnum } from '@shared/constants/PaymentStatusEnum';
import { PaymentNoticeHeadingEnum } from '@shared/constants/PaymentNoticeHeadingEnum';
import { PaymentNoticeTextEnum } from '@shared/constants/PaymentNoticeTextEnum';
import { PaymentStatusPrimaryColorCodesEnum } from '@shared/constants/PaymentStatusPrimaryColorCodesEnum';
import { PaymentStatusSecondaryColorCodesEnum } from '@shared/constants/PaymentStatusSecondaryColorCodesEnum';

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
    paymentStatus: string;
}

export default function PaymentStatusNotice(props: PaymentPendingNoticeProps) {
    const navigate = useNavigate();

    const { id } = props;

    return (
        <Paper
            sx={{
                ...styles.paymentNoteContainer,
                backgroundColor:
                    PaymentStatusSecondaryColorCodesEnum[
                        props.paymentStatus as keyof typeof PaymentStatusSecondaryColorCodesEnum
                    ],
                border:
                    '1px solid ' +
                    PaymentStatusPrimaryColorCodesEnum[
                        props.paymentStatus as keyof typeof PaymentStatusPrimaryColorCodesEnum
                    ],
            }}
        >
            <Typography variant={'h6'} sx={styles.paymentNoteHeading}>
                {props.paymentStatus === PaymentStatusEnum.PENDING ? (
                    <MonetizationOnOutlinedIcon
                        sx={{
                            ...styles.paymentNoteIcon,
                            color: PaymentStatusPrimaryColorCodesEnum.PENDING,
                        }}
                    />
                ) : null}
                {props.paymentStatus !== PaymentStatusEnum.PENDING ? (
                    <ErrorOutlineIcon
                        sx={{
                            ...styles.paymentNoteIcon,
                            color: PaymentStatusPrimaryColorCodesEnum.DUE,
                        }}
                    />
                ) : null}
                {PaymentNoticeHeadingEnum[props.paymentStatus as keyof typeof PaymentNoticeHeadingEnum]}
            </Typography>
            <Typography variant={'body2'} mt={1} mb={1}>
                {PaymentNoticeTextEnum[props.paymentStatus as keyof typeof PaymentNoticeTextEnum]}
            </Typography>
            <Button
                onClick={() => navigate(`${id}/pay`)}
                variant={'contained'}
                color={'primary'}
                sx={styles.payNowButton}
            >
                pay now
            </Button>
        </Paper>
    );
}
