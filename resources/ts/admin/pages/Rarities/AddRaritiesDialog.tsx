import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useState } from 'react';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { getCardCategories } from '@shared/redux/slices/adminCardsSlice';
import { APIService } from '@shared/services/APIService';
import { useAppDispatch } from '@admin/redux/hooks';

export interface AddRaritiesDialogProps extends Omit<DialogProps, 'onSubmit'> {
    onSubmit(): Promise<void> | void;
    isUpdate?: boolean;
    title: string;
}

export function AddRaritiesDialog(props: AddRaritiesDialogProps) {
    const { onClose, isUpdate, title, onSubmit, ...rest } = props;
    const dispatch = useAppDispatch();

    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const [cardCategory, setCardCategory] = useState<number>(1);
    const [rarityName, setRarityName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const apiService = useInjectable(APIService);
    const notifications = useNotifications();

    const handleCardCategoryChange = (categoryId: number) => {
        setCardCategory(categoryId);
    };

    const handleAddRarity = async () => {
        setIsLoading(true);
        const endpoint = apiService.createEndpoint('/admin/cards/rarities');
        try {
            const rarityDto = {
                name: rarityName,
                cardCategoryId: cardCategory,
            };
            await endpoint.post('', rarityDto);
            setIsLoading(false);
            await onSubmit();
        } catch (e: any) {
            notifications.exception(e);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const result = await dispatch(getCardCategories());
            setAvailableCategories(result.payload);
        })();
    }, [dispatch]);

    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();
        }
    }, [onClose]);

    return (
        <>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Dialog onClose={handleClose} {...rest} fullWidth maxWidth={'sm'}>
                    <DialogTitle>
                        {' '}
                        {title}
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: 'black',
                            }}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container direction={'row'} padding={'16px'}>
                            <FormControl sx={{ minWidth: '100%' }}>
                                <FormHelperText sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}>
                                    Category
                                </FormHelperText>
                                <Select
                                    key={availableCategories.length > 0 ? availableCategories[0].id : ''}
                                    onChange={(e: any) => handleCardCategoryChange(e.target.value)}
                                    defaultValue={availableCategories.length > 0 ? availableCategories[0].id : ''}
                                >
                                    {availableCategories?.map((item) => {
                                        return (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container direction={'row'} padding={'16px'}>
                            <FormControl sx={{ minWidth: '100%' }}>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginLeft: 0,
                                    }}
                                >
                                    Rarity Name
                                </FormHelperText>
                                <TextField
                                    variant="outlined"
                                    value={rarityName}
                                    onChange={(e) => setRarityName(e.target.value)}
                                    placeholder={'Enter rarity name'}
                                />
                            </FormControl>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} marginBottom={'8px'}>
                            <Box display={'flex'} flexDirection={'row'} minWidth={'150px'} marginRight={'13px'}>
                                <Button variant="text" sx={{ color: '#000' }} onClick={handleClose}>
                                    Cancel
                                </Button>
                                <LoadingButton loading={isLoading} variant={'contained'} onClick={handleAddRarity}>
                                    {title}
                                </LoadingButton>
                            </Box>
                        </Box>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
