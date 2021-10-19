import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UndoIcon from '@mui/icons-material/Undo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import MuiLink from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { plainToClass } from 'class-transformer';
import { Form, Formik, FormikProps } from 'formik';
import { ForwardedRef, forwardRef, useCallback, useMemo, useRef } from 'react';
import { batch } from 'react-redux';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { font } from '@shared/styles/utils';
import ManageCardDialogHeader from './ManageCardDialogHeader';

export interface ManageCardDialogViewProps {
    isSwappable?: boolean;
    declaredValue?: number;

    onAdd(data: { declaredValue: number; card: CardProductEntity; orderItemId?: number | null }): Promise<void> | void;
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
        form: {
            marginTop: theme.spacing(2),
        },
        dialogContent: {
            paddingTop: '0 !important',
            paddingBottom: '0 !important',
        },
        actions: {
            padding: theme.spacing(2, 3),
        },
        swapButton: {
            marginTop: 19,
            height: 38,
        },
    }),
    { name: 'ManageCardDialogView' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogView
 * @date: 13.09.2021
 * @time: 22:11
 */
export const ManageCardDialogView = forwardRef(
    ({ onAdd, isSwappable, declaredValue = 0 }: ManageCardDialogViewProps, ref: ForwardedRef<HTMLDivElement>) => {
        const classes = useStyles();
        const dialogState = useManageCardDialogState();
        const dispatch = useSharedDispatch();
        const formikRef = useRef<FormikProps<{ declaredValue: number }> | null>(null);

        const card = useMemo(
            () => plainToClass(CardProductEntity, dialogState.selectedCard),
            [dialogState.selectedCard],
        );

        const handleSubmit = useCallback(
            async ({ declaredValue }) => {
                await onAdd({
                    card,
                    orderItemId: dialogState.orderItemId,
                    declaredValue: parseFloat(String(declaredValue)),
                });

                batch(() => {
                    dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.List));
                    dispatch(manageCardDialogActions.setSelectedCard(null));
                    dispatch(manageCardDialogActions.setOpen(false));
                });
            },
            [card, dialogState.orderItemId, dispatch, onAdd],
        );

        const handleList = useCallback(() => {
            batch(() => {
                dispatch(manageCardDialogActions.setSelectedCard(null));
                dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.List));
            });
        }, [dispatch]);

        const handleSwapCard = useCallback(() => {
            batch(() => {
                dispatch(manageCardDialogActions.backup());
                dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.List));
            });
        }, [dispatch]);

        const handleUndo = useCallback(() => {
            dispatch(manageCardDialogActions.restore());
        }, [dispatch]);

        const handleClose = useCallback(() => {
            dispatch(manageCardDialogActions.setOpen(false));
        }, [dispatch]);

        return (
            <div className={classes.root} ref={ref}>
                <ManageCardDialogHeader back={!isSwappable} label={isSwappable ? 'Edit Card' : null} />
                <Divider className={classes.topDivider} />
                <Formik initialValues={{ declaredValue }} onSubmit={handleSubmit} innerRef={formikRef}>
                    {({ handleChange, handleBlur, values, isSubmitting }) => (
                        <Form>
                            <DialogContent className={classes.dialogContent}>
                                {dialogState.backup && isSwappable ? (
                                    <Box
                                        px={2}
                                        mt={2}
                                        py={1.25}
                                        display={'flex'}
                                        borderRadius="3px"
                                        bgcolor={'#f5f5f5'}
                                        alignItems={'center'}
                                        border={'1px solid #ccc'}
                                    >
                                        <Box display={'inline-flex'} flexGrow={1}>
                                            <Typography variant={'body2'} className={font.fontWeightMedium}>
                                                Card swapped.
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button startIcon={<UndoIcon />} color={'primary'} onClick={handleUndo}>
                                                Undo
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : null}
                                {card ? (
                                    <Box display={'flex'} alignItems={'flex-start'} py={3}>
                                        <img src={card.imagePath} alt={card.getName()} className={classes.image} />
                                        <Box paddingLeft={2} paddingTop={1}>
                                            <Typography variant={'h6'} gutterBottom>
                                                {card.getName()}
                                            </Typography>
                                            <Typography variant={'body2'}>{card.getDescription()}</Typography>

                                            <Grid
                                                container
                                                alignItems={'flex-start'}
                                                spacing={2}
                                                className={classes.form}
                                            >
                                                <Grid container item xs direction={'column'}>
                                                    <Typography
                                                        variant={'caption'}
                                                        color={'textPrimary'}
                                                        display={'block'}
                                                    >
                                                        Value
                                                    </Typography>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        type={'number'}
                                                        name={'declaredValue'}
                                                        variant={'outlined'}
                                                        size={'small'}
                                                        value={values.declaredValue}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        inputProps={{ min: 0 }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position={'start'}>
                                                                    <AttachMoneyIcon
                                                                        fontSize={'small'}
                                                                        color={'disabled'}
                                                                    />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid item xs container justifyContent={'flex-end'}>
                                                    {isSwappable ? (
                                                        <Button
                                                            fullWidth
                                                            size={'small'}
                                                            variant={'contained'}
                                                            color={'inherit'}
                                                            className={classes.swapButton}
                                                            onClick={handleSwapCard}
                                                        >
                                                            Swap Card
                                                        </Button>
                                                    ) : null}
                                                </Grid>
                                            </Grid>
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
                                <Button color={'inherit'} disabled={isSubmitting} onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type={'submit'}
                                    variant={'contained'}
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={18} color={'inherit'} /> : null}
                                >
                                    {isSwappable ? 'Save' : 'Confirm'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    },
);

export default ManageCardDialogView;
