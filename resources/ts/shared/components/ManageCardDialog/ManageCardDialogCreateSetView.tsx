import DateAdapter from '@mui/lab/AdapterMoment';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, { ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { batch } from 'react-redux';
import ImageUploader from '@shared/components/ImageUploader';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { CardSetEntity } from '@shared/entities/CardSetEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { APIService } from '@shared/services/APIService';
import ManageCardDialogHeader from './ManageCardDialogHeader';

export interface ManageCardDialogCreateSetViewProps {
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
        swapButton: {
            marginTop: 19,
            height: 38,
        },
    }),
    { name: 'ManageCardDialogView' },
);

export const ManageCardDialogCreateSetView = forwardRef(
    (
        { onAdd, isSwappable, declaredValue = 0 }: ManageCardDialogCreateSetViewProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const classes = useStyles();
        const dialogState = useManageCardDialogState();

        const filesRepository = useRepository(FilesRepository);

        const [isLoading, setIsLoading] = useState(false);

        const Notifications = useNotifications();
        // New Set section
        const [newSetName, setNewSetName] = useState('');
        const [newSetLogo, setNewSetLogo] = useState<File | null>(null);
        const [newSetReleaseDate, setNewSetReleaseDate] = useState<Date | null>(null);

        const apiService = useInjectable(APIService);

        const dispatch = useSharedDispatch();
        const handleClose = useCallback(() => {
            dispatch(manageCardDialogActions.setOpen(false));
        }, [dispatch]);

        useEffect(
            () => {},
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [],
        );

        const handleNewSetLogoChange = useCallback((newSetLogo: File | null) => {
            setNewSetLogo(newSetLogo);
        }, []);

        const handleNewSetReleaseDateChange = useCallback((newReleaseDate: Date | null) => {
            setNewSetReleaseDate(newReleaseDate);
        }, []);

        const handleNewSetNameChange = useCallback((e) => setNewSetName(e.target.value), []);
        const showSaveButton = useMemo(() => {
            return !!(newSetLogo && newSetName);
        }, [newSetLogo, newSetName]);

        const handleAddSet = async () => {
            const endpoint = apiService.createEndpoint('/admin/cards/sets');
            setIsLoading(true);
            try {
                const SetLogoPublicImage = await filesRepository.uploadFile(newSetLogo!);

                const DTO = {
                    cardSeriesId: dialogState.selectedCardSeries?.id,
                    name: newSetName,
                    releaseDate: newSetReleaseDate,
                    imagePath: SetLogoPublicImage,
                };
                const responseItem = await endpoint.post('', DTO);
                batch(() => {
                    dispatch(manageCardDialogActions.setSelectedCardSet(responseItem.data as CardSetEntity));
                    dispatch(manageCardDialogActions.navigateToPreviousView());
                });
            } catch (e: any) {
                Notifications.exception(e);
            }
            setIsLoading(false);
        };

        return (
            <div ref={ref}>
                <ManageCardDialogHeader back={true} label={'Create a New Set'} />
                <Divider className={classes.topDivider} />
                <Box display={'flex'} flexDirection={'column'} padding={'12px'}>
                    <Grid container padding={'12px'} spacing={24}>
                        <Grid item md={4}>
                            <FormControl>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginLeft: 0,
                                        marginBottom: '12px',
                                    }}
                                >
                                    Set Logo
                                </FormHelperText>
                                <ImageUploader onChange={handleNewSetLogoChange} />
                            </FormControl>
                        </Grid>
                        <Grid item md={8}>
                            <FormControl>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginLeft: 0,
                                        marginBottom: '12px',
                                    }}
                                >
                                    Set Name
                                </FormHelperText>
                                <TextField
                                    variant="outlined"
                                    value={newSetName}
                                    onChange={handleNewSetNameChange}
                                    placeholder={'Enter set name'}
                                    fullWidth
                                    sx={{ minWidth: '231px' }}
                                />
                            </FormControl>

                            <FormControl sx={{ marginTop: '12px' }}>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginLeft: 0,
                                        marginBottom: '12px',
                                    }}
                                >
                                    Release Date
                                </FormHelperText>
                                <LocalizationProvider dateAdapter={DateAdapter}>
                                    <DesktopDatePicker
                                        inputFormat="MM/DD/yyyy"
                                        value={newSetReleaseDate}
                                        onChange={handleNewSetReleaseDateChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            minWidth={'150px'}
                            marginRight={'13px'}
                        >
                            <Button variant="text" sx={{ color: '#000' }} onClick={handleClose}>
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                color={'primary'}
                                onClick={handleAddSet}
                                disabled={!showSaveButton || isLoading}
                            >
                                {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </div>
        );
    },
);

export default ManageCardDialogCreateSetView;
