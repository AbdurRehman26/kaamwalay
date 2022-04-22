import Button from '@mui/material/Button';
import { PropsWithChildren, useState } from 'react';
import ReactGA from 'react-ga';
import { useNavigate } from 'react-router-dom';
import { EventCategories, PaymentMethodEvents } from '@shared/constants/GAEventsTypes';
import { useNotifications } from '@shared/hooks/useNotifications';
import { invalidateOrders } from '@shared/redux/slices/ordersSlice';
import theme from '@shared/styles/theme';
import { useAppDispatch } from '../redux/hooks';
import { clearSubmissionState, createOrder, setIsNextLoading } from '../redux/slices/newSubmissionSlice';

interface CompleteSubmissonButtonProps {
    buttonText: string;
    hasStyle: boolean;
}

const styles = {
    completeSubmissonButton: {
        height: 48,
        borderRadius: 24,
        margin: theme.spacing(0, 0.75),
        boxShadow: theme.shadows[3],
    },
};

export function CompleteSubmissonButton({ buttonText, hasStyle }: PropsWithChildren<CompleteSubmissonButtonProps>) {
    const notifications = useNotifications();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [submitting, setIsSubmitting] = useState(false);

    const handleCompleteSubmission = async () => {
        try {
            setIsSubmitting(true);
            const order = await dispatch(createOrder()).unwrap();
            ReactGA.event({
                category: EventCategories.Submissions,
                action: PaymentMethodEvents.payLater,
            });
            dispatch(clearSubmissionState());
            dispatch(invalidateOrders());
            navigate(`/submissions/${order.id}/confirmation`);
        } catch (error: any) {
            dispatch(setIsNextLoading(false));
            notifications.exception(error);
            return;
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteSubmission}
            disabled={submitting}
            fullWidth
            sx={hasStyle ? styles.completeSubmissonButton : null}
        >
            {buttonText}
        </Button>
    );
}

export default CompleteSubmissonButton;
