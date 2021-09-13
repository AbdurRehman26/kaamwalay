import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { ForwardedRef, forwardRef } from 'react';
import { AddCardDialogViewEnum } from '../../constants/AddCardDialogViewEnum';
import { useSharedDispatch } from '../../hooks/useSharedSelector';
import { setAddCardDialogView } from '../../redux/slices/addCardDialogSlice';
import AddCardDialogHeader from './AddCardDialogHeader';

interface CardViewProps {}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
    }),
    { name: 'CardView' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CardView
 * @date: 13.09.2021
 * @time: 22:11
 */
export const CardView = forwardRef((props: CardViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const classes = useStyles();
    const dispatch = useSharedDispatch();

    return (
        <div className={classes.root} ref={ref}>
            <AddCardDialogHeader back />
            <Button onClick={() => dispatch(setAddCardDialogView(AddCardDialogViewEnum.Card))}>Back Page</Button>
        </div>
    );
});

export default CardView;
