import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { plainToClass } from 'class-transformer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useNotifications } from '@shared/hooks/useNotifications';
import { cx } from '@shared/lib/utils/cx';
import { useAppSelector } from '@admin/redux/hooks';

interface ReviewCardDialogProps extends DialogProps {
    indexId: number;
    orderId: number;
    itemsLength: number;
    disableNext?: boolean;
    disablePrevious?: boolean;

    onNext(): void;

    onPrevious(): void;

    onMissing(value: number): void;
    onEdit(value: number): void;

    onConfirm(value: number): void;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(2.75, 3),
            '& $heading, & $subheading, & $closeButton': {
                color: '#fff',
            },
        },
        dialog: {
            '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(32, 32, 32, 0.8)',
            },
        },
        heading: {
            fontWeight: 700,
            marginBottom: 4,
        },
        subheading: {},
        imageHolder: {
            padding: theme.spacing(2.5, 0),
        },
        image: {
            width: '100%',
            height: 'auto',
        },
        paper: {
            maxWidth: 484,
            borderRadius: 4,
            backgroundColor: '#373737',
            border: '1px solid #fff',
            overflow: 'unset',
        },
        closeButton: {
            position: 'absolute',
            right: 12,
            top: 12,
        },
        navigationButton: {
            position: 'absolute',
            top: '50%',
            backgroundColor: '#ececec',
            boxShadow: theme.shadows[4],
            '&:hover': {
                backgroundColor: '#fff',
            },
        },
        navigationButtonLeft: {
            left: -64,
            transform: 'translate(-100%, -50%)',
        },
        navigationButtonRight: {
            right: -64,
            transform: 'translate(100%, -50%)',
        },
    }),
    { name: 'ReviewCardDialog' },
);

export function ReviewCardDialog(props: ReviewCardDialogProps) {
    const {
        indexId,
        orderId,
        onNext,
        onPrevious,
        onMissing,
        onConfirm,
        onEdit,
        disableNext,
        disablePrevious,
        onClose,
        itemsLength,
        ...rest
    } = props;

    const classes = useStyles();
    const [loading, setLoading] = useState('');

    const notification = useNotifications();

    const entities = useAppSelector((state) => state.adminOrders.entities);
    const order = useMemo(() => plainToClass(OrderEntity, entities[orderId]), [entities, orderId]);
    const activeItem = useMemo(() => (order?.orderItems ?? [])[indexId], [order?.orderItems, indexId]);

    const handleClose = useCallback(() => (onClose as any)(), [onClose]);

    const handleConfirm = useCallback(async () => {
        setLoading('confirm');
        try {
            await onConfirm(activeItem?.id);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
        onNext && onNext();
    }, [onNext, onConfirm, activeItem?.id, notification]);

    const handleMissing = useCallback(async () => {
        setLoading('missing');
        try {
            await onMissing(activeItem?.id);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
        onNext && onNext();
    }, [onNext, onMissing, activeItem?.id, notification]);

    const handleEdit = useCallback(async () => {
        setLoading('missing');
        try {
            await onEdit(activeItem?.id);
        } catch (e: any) {
            notification.exception(e);
        }
        setLoading('');
        onNext && onNext();
    }, [onNext, onEdit, activeItem?.id, notification]);

    useEffect(
        () => {
            if (rest.open && itemsLength === 0) {
                handleClose();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [itemsLength, rest.open],
    );

    return (
        <Dialog scroll={'body'} classes={{ root: classes.dialog, paper: classes.paper }} onClose={onClose} {...rest}>
            <Grid container direction={'column'} className={classes.root}>
                <Grid container direction={'column'}>
                    <Typography variant={'h4'} className={classes.heading}>
                        {activeItem?.cardProduct?.getName()}
                    </Typography>
                    <Typography variant={'body2'} className={classes.subheading}>
                        {activeItem?.cardProduct?.getDescription()}
                    </Typography>

                    <IconButton className={classes.closeButton} size={'small'} onClick={handleClose}>
                        <CloseIcon color={'inherit'} />
                    </IconButton>
                </Grid>
                <Grid container className={classes.imageHolder}>
                    {activeItem?.cardProduct?.imagePath ? (
                        <img src={activeItem?.cardProduct?.imagePath} alt="Card preview" className={classes.image} />
                    ) : null}
                </Grid>
                <Grid container spacing={2}>
                    <Grid item container spacing={2} xs>
                        <Grid item xs>
                            <Button
                                variant={'contained'}
                                size={'large'}
                                fullWidth
                                onClick={handleMissing}
                                disabled={loading !== ''}
                                startIcon={
                                    loading === 'missing' ? <CircularProgress size={24} color={'inherit'} /> : null
                                }
                            >
                                Missing
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button
                                variant={'contained'}
                                size={'large'}
                                fullWidth
                                onClick={handleEdit}
                                disabled={loading !== ''}
                                startIcon={
                                    loading === 'missing' ? <CircularProgress size={24} color={'inherit'} /> : null
                                }
                            >
                                Edit
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            size={'large'}
                            fullWidth
                            onClick={handleConfirm}
                            disabled={loading !== ''}
                            startIcon={loading === 'confirm' ? <CircularProgress size={24} color={'inherit'} /> : null}
                        >
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            {!disablePrevious ? (
                <IconButton
                    onClick={onPrevious}
                    className={cx(classes.navigationButton, classes.navigationButtonLeft)}
                    size="large"
                >
                    <ChevronLeftIcon />
                </IconButton>
            ) : null}

            {!disableNext ? (
                <IconButton
                    onClick={onNext}
                    className={cx(classes.navigationButton, classes.navigationButtonRight)}
                    size="large"
                >
                    <ChevronRightIcon />
                </IconButton>
            ) : null}
        </Dialog>
    );
}

export default ReviewCardDialog;
