import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import { useCallback } from 'react';
import { batch } from 'react-redux';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { useSharedDispatch } from '@shared/hooks/useSharedSelector';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { font } from '@shared/styles/utils';

interface ManageCardDialogHeaderProps {
    back?: boolean;
    label?: string | null;
}

const useStyles = makeStyles<Theme, ManageCardDialogHeaderProps>(
    (theme) => ({
        root: ({ back }) => ({
            padding: theme.spacing(2, 2, 0, back ? 1.5 : 3),
        }),
        backButton: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'ManageCardDialogHeader' },
);

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ManageCardDialogHeader
 * @date: 13.09.2021
 * @time: 22:33
 */
export function ManageCardDialogHeader({ back, label }: ManageCardDialogHeaderProps) {
    const classes = useStyles({ back });
    const dispatch = useSharedDispatch();

    const handleClose = useCallback(() => {
        dispatch(manageCardDialogActions.setOpen(false));
    }, [dispatch]);

    const handleBack = useCallback(() => {
        batch(() => {
            dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.List));
            dispatch(manageCardDialogActions.setSelectedCard(null));
        });
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
                    {label ?? 'Add Extra Card'}
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

export default ManageCardDialogHeader;
