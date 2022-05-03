import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    payNowButtonConfirmation: {
        marginTop: 1,
        padding: '12px 36px 12px 36px',
        width: '100%',
    },
};

interface PaymentPendingNoticeProps {
    id: number;
    paymentStatus: PaymentStatusEnum;
    hasWidth: boolean;
}

export default function PaymentStatusNotice(props: PaymentPendingNoticeProps) {
    const navigate = useNavigate();
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const { id, hasWidth } = props;

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
                fullWidth={isMobile}
                onClick={() => navigate(`/submissions/${id}/pay`)}
                variant={'contained'}
                color={'primary'}
                sx={hasWidth ? styles.payNowButtonConfirmation : styles.payNowButton}
            >
                pay now
            </Button>
        </Paper>
    );
}
