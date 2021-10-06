import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useCallback } from 'react';
import { batch } from 'react-redux';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
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
