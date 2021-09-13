import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import { useCallback } from 'react';
import { AddCardDialogViewEnum } from '@shared/constants/AddCardDialogViewEnum';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
import { setAddCardDialogState, setAddCardDialogView } from '@shared/redux/slices/addCardDialogSlice';
import { font } from '@shared/styles/utils';

interface AddCardDialogHeaderProps {
    back?: boolean;
}

const useStyles = makeStyles<Theme, AddCardDialogHeaderProps>(
    (theme) => ({
        root: ({ back }) => ({
            padding: theme.spacing(2, 2, 0, back ? 1.5 : 3),
        }),
        backButton: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'AddCardDialogHeader' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: AddCardDialogHeader
 * @date: 13.09.2021
 * @time: 22:33
 */
export function AddCardDialogHeader({ back }: AddCardDialogHeaderProps) {
    const classes = useStyles({ back });
    const dispatch = useSharedDispatch();

    const handleClose = useCallback(() => {
        dispatch(setAddCardDialogState(false));
    }, [dispatch]);

    const handleBack = useCallback(() => {
        dispatch(setAddCardDialogView(AddCardDialogViewEnum.List));
    }, [dispatch]);

    return (
        <Grid container alignItems={'center'} className={classes.root}>
            <Grid container item xs={9} alignItems={'center'}>
                {back ? (
                    <IconButton onClick={handleBack} size={'small'} className={classes.backButton}>
                        <ArrowBackIcon />
                    </IconButton>
                ) : null}
                <Typography variant={'h6'} className={font.fontWeightMedium}>
                    Add Extra Card
                </Typography>
            </Grid>
            <Grid container item xs={3} alignItems={'center'} justifyContent={'flex-end'}>
                <IconButton onClick={handleClose} size={'small'}>
                    <CloseIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}

export default AddCardDialogHeader;
