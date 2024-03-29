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
import { CardSeriesEntity } from '@shared/entities/CardSeriesEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { APIService } from '@shared/services/APIService';
import ManageCardDialogHeader from './ManageCardDialogHeader';

export interface ManageCardDialogCreateSeriesViewProps {
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

export const ManageCardDialogCreateSeriesView = forwardRef(
    (
        { onAdd, isSwappable, declaredValue = 0 }: ManageCardDialogCreateSeriesViewProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const classes = useStyles();
        const dialogState = useManageCardDialogState();

        const filesRepository = useRepository(FilesRepository);

        const [isLoading, setIsLoading] = useState(false);

        const Notifications = useNotifications();
        // New series section
        const [newSeriesLogo, setNewSeriesLogo] = useState<File | null>(null);
        const [newSeriesName, setNewSeriesName] = useState('');

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

        const handleNewSeriesLogoChange = useCallback(
            (newSeriesLogo: File | null) => setNewSeriesLogo(newSeriesLogo),
            [],
        );

        const handleNewSeriesNameChange = useCallback((e) => setNewSeriesName(e.target.value), []);
        const showSaveButton = useMemo(() => {
            return !!(newSeriesLogo && newSeriesName);
        }, [newSeriesLogo, newSeriesName]);

        const handleAddSeries = async () => {
            const endpoint = apiService.createEndpoint('/admin/cards/series');
            setIsLoading(true);
            try {
                const seriesLogoPublicImage = await filesRepository.uploadFile(newSeriesLogo!);

                const DTO = {
                    cardCategoryId: dialogState.selectedCategory?.id,
                    name: newSeriesName,
                    imagePath: seriesLogoPublicImage,
                };
                const responseItem = await endpoint.post('', DTO);
                batch(() => {
                    dispatch(manageCardDialogActions.setSelectedCardSeries(responseItem.data as CardSeriesEntity));
                    dispatch(manageCardDialogActions.navigateToPreviousView());
                });
            } catch (e: any) {
                Notifications.exception(e);
            }
            setIsLoading(false);
        };

        return (
            <div ref={ref}>
                <ManageCardDialogHeader back={true} label={'Create a New Series'} />
                <Divider className={classes.topDivider} />
                <Box display={'flex'} flexDirection={'column'} padding={'12px'}>
                    <Box padding={'12px'}>
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
                                        Series Logo
                                    </FormHelperText>
                                    <ImageUploader onChange={handleNewSeriesLogoChange} />
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
                                        Series Name
                                    </FormHelperText>
                                    <TextField
                                        variant="outlined"
                                        value={newSeriesName}
                                        onChange={handleNewSeriesNameChange}
                                        placeholder={'Enter series name'}
                                        fullWidth
                                        sx={{ minWidth: '231px' }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
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
                                onClick={handleAddSeries}
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

export default ManageCardDialogCreateSeriesView;
