import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogProps } from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import { useCallback } from 'react';
import dummyCharizard from '@shared/assets/dummyCharizard.png';
import { cx } from '@shared/lib/utils/cx';

interface ReviewCardDialogProps extends DialogProps {
    index: number;
    disableNext?: boolean;
    disablePrevious?: boolean;
    onNext(): void;
    onPrevious(): void;
    onMissing(value: number): void;
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

export function ReviewCardDialog({
    index,
    onNext,
    onPrevious,
    onMissing,
    onConfirm,
    disableNext,
    disablePrevious,
    onClose,
    ...rest
}: ReviewCardDialogProps) {
    const classes = useStyles();

    const handleMissing = useCallback(() => onMissing(index), [onMissing, index]);
    const handleConfirm = useCallback(() => onConfirm(index), [onConfirm, index]);
    const handleClose = useCallback(() => (onClose as any)(), [onClose]);

    return (
        <Dialog scroll={'body'} classes={{ root: classes.dialog, paper: classes.paper }} onClose={onClose} {...rest}>
            <Grid container direction={'column'} className={classes.root}>
                <Grid container direction={'column'}>
                    <Typography variant={'h4'} className={classes.heading}>
                        Charizard
                    </Typography>
                    <Typography variant={'body2'} className={classes.subheading}>
                        2020 Pokemon Sword & Shield Vivid Voltage 025 Charizard
                    </Typography>

                    <IconButton className={classes.closeButton} size={'small'} onClick={handleClose}>
                        <CloseIcon color={'inherit'} />
                    </IconButton>
                </Grid>
                <Grid container className={classes.imageHolder}>
                    <img src={dummyCharizard} alt="Card preview" className={classes.image} />
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs>
                        <Button variant={'contained'} size={'large'} fullWidth onClick={handleMissing}>
                            Missing
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Button
                            variant={'contained'}
                            size={'large'}
                            fullWidth
                            onClick={handleConfirm}
                            color={'primary'}
                        >
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            {!disablePrevious ? (
                <IconButton onClick={onPrevious} className={cx(classes.navigationButton, classes.navigationButtonLeft)}>
                    <ChevronLeftIcon />
                </IconButton>
            ) : null}

            {!disableNext ? (
                <IconButton onClick={onNext} className={cx(classes.navigationButton, classes.navigationButtonRight)}>
                    <ChevronRightIcon />
                </IconButton>
            ) : null}
        </Dialog>
    );
}

export default ReviewCardDialog;
