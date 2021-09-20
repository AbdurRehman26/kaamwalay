import Button, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatusEnum } from '@shared/constants/OrderStatusEnum';
import { OrderStatusEntity } from '@shared/entities/OrderStatusEntity';

const useStyles = makeStyles(
    (theme) => ({
        button: {
            borderRadius: 24,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
    { name: 'SubmissionActionButton' },
);

interface SubmissionActionButtonProps extends ButtonProps {
    orderId: number | string;
    orderStatus: OrderStatusEntity;
}

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SubmissionActionButton
 * @date: 14.09.2021
 * @time: 21:43
 */
export function SubmissionActionButton({ orderId, orderStatus, ...rest }: SubmissionActionButtonProps) {
    const classes = useStyles();

    const sharedProps: any = useMemo(
        () => ({
            variant: 'contained',
            color: 'primary',
            size: 'large',
            className: classes.button,
            ...rest,
        }),
        [classes.button, rest],
    );

    if (!orderStatus || orderStatus.is(OrderStatusEnum.PLACED)) {
        return (
            <Button component={Link} to={`/submissions/${orderId}/review`} {...sharedProps}>
                Review
            </Button>
        );
    }

    if (orderStatus.is(OrderStatusEnum.ARRIVED)) {
        return (
            <Button component={Link} to={`/submissions/${orderId}/grade`} {...sharedProps}>
                Grade
            </Button>
        );
    }

    if (orderStatus.is(OrderStatusEnum.GRADED)) {
        return <Button {...sharedProps}> Mark Shipped</Button>;
    }

    if (orderStatus.is(OrderStatusEnum.SHIPPED)) {
        return (
            <Button size={'large'} color={'primary'}>
                Edit Tracking
            </Button>
        );
    }

    return (
        <Button component={Link} to={`/submissions/${orderId}/view`} {...sharedProps}>
            View
        </Button>
    );
}

export default SubmissionActionButton;
