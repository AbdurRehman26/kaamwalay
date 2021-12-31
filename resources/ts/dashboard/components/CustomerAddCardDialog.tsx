import { markCardAsSelected, SearchResultItemCardProps } from '@dashboard/redux/slices/newSubmissionSlice';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ImageUploader from '@shared/components/ImageUploader';
import { useCallback, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import ReactGA from 'react-ga';
import { CardsSelectionEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { useAppDispatch } from '@dashboard/redux/hooks';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { useRepository } from '@shared/hooks/useRepository';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { useNotifications } from '@shared/hooks/useNotifications';

interface CustomerAddCardDialogProps {
    showDialog: boolean | null;
    onClose: () => void;
}

export default function CustomerAddCardDialog({ onClose, showDialog }: CustomerAddCardDialogProps) {
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [cardName, setCardName] = useState('');
    const [cardDescription, setCardDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const filesRepository = useRepository(FilesRepository);
    const apiService = useInjectable(APIService);
    const Notifications = useNotifications();
    const isAddCardButtonDisabled = useMemo(() => {
        return !uploadedImage || !cardName || !cardDescription;
    }, [uploadedImage, cardName, cardDescription]);

    const selectCard = useCallback(
        (item: SearchResultItemCardProps) => {
            ReactGA.event({
                category: EventCategories.Cards,
                action: CardsSelectionEvents.added,
            });
            dispatch(markCardAsSelected(item));
        },
        [dispatch],
    );

    const handleOnClose = useCallback(() => {
        setUploadedImage(null);
        setCardName('');
        setCardDescription('');
        onClose();
    }, [onClose]);

    const handleAddCard = useCallback(async () => {
        if (uploadedImage === null) {
            return;
        }

        setIsLoading(true);
        // Here we'll make the API call add the card and then with the data we get from the API
        // we'll call the function below
        const endpoint = apiService.createEndpoint(`customer/cards`);
        try {
            const publicImageUrl = await filesRepository.uploadFile(uploadedImage);
            const response = await endpoint.post('', {
                imagePath: publicImageUrl,
                name: cardName,
                description: cardDescription,
            });
            selectCard({
                id: response.data.id,
                image: response.data.imagePath,
                name: response.data.name,
                shortName: response.data.shortName,
                longName: response.data.longName,
            });
        } catch (e: any) {
            Notifications.exception(e);
        }
        setIsLoading(false);
        handleOnClose();
    }, [
        uploadedImage,
        apiService,
        handleOnClose,
        filesRepository,
        cardName,
        cardDescription,
        selectCard,
        Notifications,
    ]);

    return (
        <Dialog fullScreen={isSm} maxWidth={'md'} fullWidth open={Boolean(showDialog)} onClose={onClose}>
            <DialogTitle>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant={'h6'}>Add Card Manually</Typography>
                    {isSm ? (
                        <IconButton onClick={handleOnClose}>
                            <CloseIcon />
                        </IconButton>
                    ) : null}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12} md={5}>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Typography variant={'subtitle2'} sx={{ fontWeight: 'bold', marginBottom: '6px' }}>
                                Photo of Front of Card*
                            </Typography>
                            <ImageUploader onChange={(img) => setUploadedImage(img)} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            paddingLeft={isSm ? '0' : '12px'}
                            marginTop={isSm ? '12px' : '0'}
                        >
                            <Typography variant={'subtitle2'} sx={{ fontWeight: 'bold', marginBottom: '-9px' }}>
                                Card Name*
                            </Typography>
                            <TextField
                                placeholder="Enter card name"
                                value={cardName}
                                onChange={(e: any) => setCardName(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: '4px' }}
                                size={'small'}
                                variant={'outlined'}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <Typography
                                variant={'subtitle2'}
                                sx={{ fontWeight: 'bold', marginBottom: '-8px', marginTop: '25px' }}
                            >
                                Card Description*
                            </Typography>
                            <TextField
                                placeholder="Enter card description"
                                value={cardDescription}
                                rows={5}
                                multiline
                                onChange={(e: any) => setCardDescription(e.target.value)}
                                fullWidth
                                size={'small'}
                                variant={'outlined'}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Typography
                                variant={'subtitle2'}
                                sx={{
                                    color: 'rgba(0, 0, 0, 0.54)',
                                    fontSize: '12px',
                                }}
                            >
                                Card Year released, series, set, edition, card number etc. *
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: '20px' }}>
                <Button variant="text" sx={{ color: '#000 ' }} fullWidth={isSm} onClick={handleOnClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    disabled={isLoading || isAddCardButtonDisabled}
                    onClick={handleAddCard}
                    fullWidth={isSm}
                    color={'primary'}
                >
                    {isLoading ? <CircularProgress color={'primary'} /> : 'Add Card'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
