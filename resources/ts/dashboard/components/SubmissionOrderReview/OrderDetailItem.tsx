import Typography from '@material-ui/core/Typography';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import useStyles from '@dashboard/components/SubmissionOrderReview/style';
import { useAppDispatch } from '@dashboard/redux/hooks';
import { setCustomStep } from '@dashboard/redux/slices/newSubmissionSlice';

type OrderDetailItemProps = {
    children: any;
    title: string;
    editStep: number;
    spaced?: boolean;
};

function OrderDetailItem(props: OrderDetailItemProps) {
    const classes = useStyles(props);
    const { title, children, editStep } = props;
    const dispatch = useAppDispatch();

    const handleEditPress = useCallback(() => {
        dispatch(setCustomStep(editStep));
    }, []);

    return (
        <div className={classes.orderDetailItemContainer}>
            <div className={classes.orderDetailItemTitleContainer}>
                <Typography variant={'subtitle2'} className={classes.orderDetailItemTitle}>
                    {title}
                </Typography>
                <Typography variant={'subtitle2'} onClick={handleEditPress} className={classes.orderDetailEditBtn}>
                    EDIT
                </Typography>
            </div>
            <div className={classes.orderDetailItemBody}>{children}</div>
        </div>
    );
}

export default OrderDetailItem;
