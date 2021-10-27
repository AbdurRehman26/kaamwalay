import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { PropsWithChildren, ReactNode, ReactNodeArray, useCallback, useEffect } from 'react';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { cx } from '@shared/lib/utils/cx';

export interface ReviewCardDialogProps extends DialogProps {
    itemsLength: number;
    disableNext?: boolean;
    disablePrevious?: boolean;
    activeItem?: CardProductEntity;
    children?: ReactNode | ReactNodeArray;
    onNext?: () => void;
    onPrevious?: () => void;
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
            [theme.breakpoints.down('sm')]: {
                maxWidth: '100%',
                display: 'flex',
            },
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
            [theme.breakpoints.down('sm')]: {
                left: 8,
                transform: 'translate(0, -50%)',
            },
        },
        navigationButtonRight: {
            right: -64,
            transform: 'translate(100%, -50%)',
            [theme.breakpoints.down('sm')]: {
                right: 8,
                transform: 'translate(0, -50%)',
            },
        },
    }),
    { name: 'ReviewCardDialog' },
);

export function ReviewCardDialog(props: PropsWithChildren<ReviewCardDialogProps>) {
    const { onNext, onPrevious, disableNext, disablePrevious, onClose, itemsLength, activeItem, children, ...rest } =
        props;

    const classes = useStyles();
    const handleClose = useCallback(() => (onClose as any)(), [onClose]);

    const isFullscreen = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

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
        <Dialog
            scroll={'body'}
            classes={{ root: classes.dialog, paper: classes.paper }}
            onClose={onClose}
            fullScreen={isFullscreen}
            {...rest}
        >
            <Grid container direction={'column'} className={classes.root}>
                <Grid container direction={'column'}>
                    <Typography variant={'h4'} className={classes.heading}>
                        {activeItem?.name}
                    </Typography>
                    <Typography variant={'body2'} className={classes.subheading}>
                        {activeItem?.shortName}
                    </Typography>
                    <Typography variant={'body2'} className={classes.subheading}>
                        {activeItem?.longName}
                    </Typography>

                    <IconButton className={classes.closeButton} size={'small'} onClick={handleClose}>
                        <CloseIcon color={'inherit'} />
                    </IconButton>
                </Grid>
                <Grid container className={classes.imageHolder}>
                    {activeItem?.imagePath ? (
                        <img src={activeItem?.imagePath} alt="Card preview" className={classes.image} />
                    ) : null}
                </Grid>
                <Box flexGrow={1} />
                {children ? (
                    <Grid container spacing={2}>
                        {children}
                    </Grid>
                ) : null}
            </Grid>
            {!disablePrevious && onPrevious ? (
                <IconButton
                    onClick={onPrevious}
                    className={cx(classes.navigationButton, classes.navigationButtonLeft)}
                    size={isFullscreen ? 'small' : 'large'}
                >
                    <ChevronLeftIcon />
                </IconButton>
            ) : null}
            {!disableNext && onNext ? (
                <IconButton
                    onClick={onNext}
                    className={cx(classes.navigationButton, classes.navigationButtonRight)}
                    size={isFullscreen ? 'small' : 'large'}
                >
                    <ChevronRightIcon />
                </IconButton>
            ) : null}
        </Dialog>
    );
}

export default ReviewCardDialog;
