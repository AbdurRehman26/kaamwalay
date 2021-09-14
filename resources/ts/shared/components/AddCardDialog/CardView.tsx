import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiLink from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { plainToClass } from 'class-transformer';
import { ForwardedRef, forwardRef, useCallback, useMemo, useState } from 'react';
import { batch } from 'react-redux';
import { AddCardDialogViewEnum } from '@shared/constants/AddCardDialogViewEnum';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
import { useAddCardDialogState } from '@shared/redux/hooks/useAddCardDialogState';
import {
    selectAddCardDialog,
    setAddCardDialogState,
    setAddCardDialogView,
} from '@shared/redux/slices/addCardDialogSlice';
import AddCardDialogHeader from './AddCardDialogHeader';

export interface CardViewProps {
    onAdd(data: { declaredValue: number; card: CardProductEntity }): Promise<void> | void;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        topDivider: {
            marginTop: theme.spacing(2),
        },
        image: {
            width: 127,
        },
        actions: {
            padding: theme.spacing(2, 3),
        },
    }),
    { name: 'CardView' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: CardView
 * @date: 13.09.2021
 * @time: 22:11
 */
export const CardView = forwardRef(({ onAdd }: CardViewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const classes = useStyles();
    const state = useAddCardDialogState();
    const card = useMemo(() => plainToClass(CardProductEntity, state.selectedCard), [state.selectedCard]);
    const dispatch = useSharedDispatch();

    const [declaredValue, setDeclaredValue] = useState(0.0);
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback(
        (e) => {
            setDeclaredValue(e.target.value);
        },
        [setDeclaredValue],
    );

    const handleSubmit = useCallback(async () => {
        setLoading(true);
        await onAdd({ declaredValue: parseFloat(String(declaredValue)), card });
        batch(() => {
            dispatch(setAddCardDialogView(AddCardDialogViewEnum.List));
            dispatch(selectAddCardDialog(null));
            dispatch(setAddCardDialogState(false));
        });
        setLoading(false);
    }, [card, declaredValue, dispatch, onAdd]);

    const handleList = useCallback(() => {
        batch(() => {
            dispatch(setAddCardDialogView(AddCardDialogViewEnum.List));
            dispatch(selectAddCardDialog(null));
        });
    }, [dispatch]);

    return (
        <div className={classes.root} ref={ref}>
            <AddCardDialogHeader back />
            <Divider className={classes.topDivider} />
            <DialogContent>
                {card ? (
                    <Box display={'flex'} alignItems={'flex-start'} py={3}>
                        <img src={card.imagePath} alt={card.getName()} className={classes.image} />
                        <Box paddingLeft={2} paddingTop={1}>
                            <Typography variant={'h6'} gutterBottom>
                                {card.getName()}
                            </Typography>
                            <Typography variant={'body2'}>{card.getDescription()}</Typography>

                            <Box display={'block'} pt={3} maxWidth={160}>
                                <Typography variant={'caption'} color={'textPrimary'} display={'block'}>
                                    Value
                                </Typography>
                                <TextField
                                    type={'number'}
                                    variant={'outlined'}
                                    size={'small'}
                                    value={declaredValue}
                                    onChange={handleChange}
                                    inputProps={{ min: 0 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position={'start'}>
                                                <AttachMoneyIcon fontSize={'small'} color={'disabled'} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        flexDirection={'column'}
                        py={3}
                    >
                        <Typography>There's no card selected.</Typography>
                        <Typography>
                            You can select one from the{' '}
                            <MuiLink color={'primary'} onClick={handleList}>
                                list of the cards
                            </MuiLink>
                            .
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <Divider />
            <DialogActions className={classes.actions}>
                <Button disabled={loading}>Cancel</Button>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    disabled={loading}
                    onClick={handleSubmit}
                    startIcon={loading ? <CircularProgress size={18} color={'inherit'} /> : null}
                >
                    Confirm
                </Button>
            </DialogActions>
        </div>
    );
});

export default CardView;
