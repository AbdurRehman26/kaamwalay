import AddIcon from '@mui/icons-material/Add';
import DateAdapter from '@mui/lab/AdapterMoment';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, { ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { batch } from 'react-redux';
import ImageUploader from '@shared/components/ImageUploader';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { APIService } from '@shared/services/APIService';
import ManageCardDialogHeader from './ManageCardDialogHeader';

export interface ManageCardDialogCreateCardViewProps {
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

// TODO: These interfaces will be moved to entities, once we'll have some time to think about this.
interface CardSets {
    id: number;
    cardSeriesId: number;
    label: string;
    name: string;
    imagePath: string;
    releaseDate: string;
}

interface CardSeries {
    id: number;
    label: string;
    name: string;
    imagePath: string;
}

interface CardRarity {
    label: string;
    name: string;
}

interface CardSurface {
    label: string;
    name: string;
}
export const ManageCardDialogCreateCardView = forwardRef(
    (
        { onAdd, isSwappable, declaredValue = 0 }: ManageCardDialogCreateCardViewProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const classes = useStyles();
        const dialogState = useManageCardDialogState();

        const filesRepository = useRepository(FilesRepository);

        const [isLoading, setIsLoading] = useState(false);
        const [cardCategory, setCardCategory] = useState<number | null>(dialogState.selectedCategory?.id ?? null);
        const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
        const [availableSeries, setAvailableSeries] = useState<CardSeries[]>([]);
        const [availableSets, setAvailableSets] = useState<CardSets[]>([]);
        const [selectedSeries, setSelectedSeries] = useState<CardSeries | null | undefined>(null);
        const [selectedSet, setSelectedSet] = useState<CardSets | null>(null);
        const [selectedCardPhoto, setSelectedCardPhoto] = useState<File | null>(null);
        const [availableRarities, setAvailableRarities] = useState<CardRarity[]>([]);
        const [selectedRarity, setSelectedRarity] = useState<CardRarity | null>(null);
        const [availableSurfaces, setAvailableSurfaces] = useState<CardSurface[]>([]);
        const [selectedSurface, setSelectedSurface] = useState<CardSurface | null>(null);
        const [releaseDate, setReleaseDate] = useState<Date | null>(null);
        const [availableLanguages, setAvailableLanguages] = useState<string[] | null>(null);
        const [selectedLanguage, setSelectedLanguage] = useState<string>('none');
        const [availableEditions, setAvailableEditions] = useState<string[] | null>(null);
        const [selectedEdition, setSelectedEdition] = useState<string>('none');
        const [productVariant, setProductVariant] = useState<string>('');
        const [cardName, setCardName] = useState('');
        const [cardNumber, setCardNumber] = useState('');

        const Notifications = useNotifications();

        const apiService = useInjectable(APIService);

        const dispatch = useSharedDispatch();
        const handleClose = useCallback(() => {
            dispatch(manageCardDialogActions.setOpen(false));
        }, [dispatch]);

        const fetchSeries = useCallback(
            async (categoryId: Number) => {
                const endpoint = apiService.createEndpoint(`admin/cards/series?category_id=` + categoryId);
                const response = await endpoint.get('');
                setAvailableSeries(
                    response.data.map((item: CardSeries) => {
                        // TODO: This is a workaround to add 'label' alongside name on these objects. I'm sure there's a better way to do this but it's 4AM and I can't think of it.
                        return {
                            id: item.id,
                            label: item.name,
                            name: item.name,
                            imagePath: item.imagePath,
                        };
                    }),
                );
            },
            [apiService],
        );

        const fetchSets = useCallback(
            async (seriesId: Number) => {
                const endpoint = apiService.createEndpoint(`admin/cards/sets?series_id=` + seriesId);
                const response = await endpoint.get('');
                setAvailableSets(
                    response.data.map((item: CardSets) => {
                        // TODO: This is a workaround to add 'label' alongside name on these objects. I'm sure there's a better way to do this but it's 4AM and I can't think of it.
                        return {
                            id: item.id,
                            cardSeriesId: item.cardSeriesId,
                            label: item.name,
                            name: item.name,
                            imagePath: item.imagePath,
                            releaseDate: item.releaseDate,
                        };
                    }),
                );
            },
            [apiService],
        );

        const fetchDropdownsData = useCallback(
            async (categoryId: Number) => {
                const endpoint = apiService.createEndpoint(`admin/cards/options/` + categoryId);
                const response = await endpoint.get('');
                setAvailableRarities(
                    response.data.rarity.map((item: string) => {
                        return {
                            label: item,
                            name: item,
                        };
                    }),
                );
                setAvailableSurfaces(
                    response.data.surface.map((item: string) => {
                        return {
                            label: item,
                            name: item,
                        };
                    }),
                );
                setAvailableLanguages(response.data.language);
                setAvailableEditions(response.data.edition);
            },
            [apiService],
        );

        const setSelectedSeriesFromState = useCallback(() => {
            if (dialogState.selectedCardSeries) {
                const filteredSeries = availableSeries.filter((series) => {
                    return series.id === dialogState?.selectedCardSeries?.id;
                })[0];

                if (filteredSeries) {
                    setSelectedSeries(filteredSeries);

                    fetchSets(filteredSeries?.id);
                }
            }
        }, [availableSeries, dialogState.selectedCardSeries, fetchSets]);

        const setSelectedSetFromState = useCallback(() => {
            if (dialogState.selectedCardSet) {
                const filteredSet = availableSets.filter((set) => {
                    return set.id === dialogState?.selectedCardSet?.id;
                })[0];

                if (filteredSet) {
                    setSelectedSet(filteredSet);

                    setReleaseDate(new Date(filteredSet?.releaseDate));
                }
            }
        }, [availableSets, dialogState.selectedCardSet]);

        useEffect(
            () => {
                async function fetchCategories() {
                    const endpoint = apiService.createEndpoint(`admin/cards/categories`);
                    const response = await endpoint.get('');
                    const categoryId = dialogState.selectedCategory?.id ?? response.data[0].id;
                    setAvailableCategories(response.data);
                    setCardCategory(categoryId);

                    dispatch(
                        manageCardDialogActions.setSelectedCategory(dialogState.selectedCategory ?? response.data[0]),
                    );

                    await fetchSeries(categoryId);

                    setSelectedSeriesFromState();

                    fetchDropdownsData(categoryId);
                }

                fetchCategories();
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [],
        );

        useEffect(() => {
            setSelectedSeriesFromState();
        }, [setSelectedSeriesFromState]);

        useEffect(() => {
            setSelectedSetFromState();
        }, [setSelectedSetFromState]);

        const handleCardCategoryChange = useCallback(
            (e) => {
                setCardCategory(e.target.value);

                const category = availableCategories.filter((cat) => {
                    return cat.id === e.target.value;
                })[0];

                batch(() => {
                    dispatch(manageCardDialogActions.setSelectedCategory(category));
                    dispatch(manageCardDialogActions.setSelectedCardSeries(null));
                    dispatch(manageCardDialogActions.setSelectedCardSet(null));
                });

                setSelectedSeries(null);
                setSelectedSet(null);
                setSelectedRarity(null);
                setSelectedSurface(null);
                setReleaseDate(null);

                fetchSeries(e.target.value);
                fetchDropdownsData(e.target.value);
            },
            [fetchSeries, fetchDropdownsData, dispatch, availableCategories],
        );

        const handleSeriesChange = useCallback(
            (e, newValue) => {
                setSelectedSeries(newValue);
                setSelectedSet(null);
                batch(() => {
                    dispatch(manageCardDialogActions.setSelectedCardSeries(newValue));
                    dispatch(manageCardDialogActions.setSelectedCardSet(null));
                });

                fetchSets(newValue.id);
            },
            [fetchSets, dispatch],
        );

        const handleSetChange = useCallback(
            (e, newValue) => {
                setSelectedSet(newValue);
                dispatch(manageCardDialogActions.setSelectedCardSet(newValue));

                setReleaseDate(new Date(newValue?.releaseDate));
            },
            [setReleaseDate, dispatch],
        );

        const handleCardPhotoChange = useCallback((cardImage: File | null) => {
            setSelectedCardPhoto(cardImage);
        }, []);

        const handleCardNameChange = useCallback((e) => {
            setCardName(e.target.value);
        }, []);

        const handleReleaseDateChange = useCallback((newReleaseDate: Date | null) => {
            setReleaseDate(newReleaseDate);
        }, []);

        const toggleNewSeries = useCallback(() => {
            dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.CreateSeries));
        }, [dispatch]);

        const toggleNewSet = useCallback(() => {
            dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.CreateSet));
        }, [dispatch]);

        const handleRarityChange = useCallback((e, newValue) => {
            setSelectedRarity(newValue);
        }, []);
        const handleSurfaceChange = useCallback((e, newValue) => {
            setSelectedSurface(newValue);
        }, []);
        const handleLanguageChange = useCallback((e) => setSelectedLanguage(e.target.value), []);
        const handleEditionChange = useCallback((e) => setSelectedEdition(e.target.value), []);
        const handleProductVariantChange = useCallback((e) => setProductVariant(e.target.value), []);
        const handleCardNumberChange = useCallback((e) => setCardNumber(e.target.value), []);
        const showSaveButton = useMemo(() => {
            return !!(
                selectedSeries &&
                selectedSet &&
                selectedCardPhoto &&
                cardName &&
                cardNumber &&
                selectedRarity &&
                selectedLanguage !== 'none'
            );
        }, [selectedSeries, selectedSet, selectedCardPhoto, cardName, selectedLanguage, selectedRarity, cardNumber]);

        const handleAddCard = async () => {
            const endpoint = apiService.createEndpoint('/admin/cards');

            setIsLoading(true);
            try {
                const cardPublicImage = await filesRepository.uploadFile(selectedCardPhoto!);
                const DTO = {
                    imagePath: cardPublicImage,
                    name: cardName,
                    category: cardCategory,
                    releaseDate: releaseDate,
                    seriesId: selectedSeries?.id,
                    seriesName: null,
                    seriesImage: null,
                    setId: selectedSet?.id,
                    setName: null,
                    setImage: null,
                    cardNumber: cardNumber,
                    language: selectedLanguage,
                    rarity: selectedRarity?.name,
                    edition: selectedEdition !== 'none' ? selectedEdition : null,
                    surface: selectedSurface?.name ?? null,
                    variant: productVariant,
                };
                const responseItem = await endpoint.post('', DTO);
                batch(() => {
                    dispatch(manageCardDialogActions.setSelectedCard(responseItem.data as CardProductEntity));
                    dispatch(manageCardDialogActions.setView(ManageCardDialogViewEnum.Edit));
                });
            } catch (e: any) {
                Notifications.exception(e);
            }
            setIsLoading(false);
        };

        return (
            <div ref={ref}>
                <ManageCardDialogHeader back={!isSwappable} label={'Create a New Card'} />
                <Divider className={classes.topDivider} />
                <Box display={'flex'} flexDirection={'column'} padding={'12px'}>
                    <FormControl sx={{ m: 1, minWidth: '97%' }}>
                        <FormHelperText sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0, marginBottom: '12px' }}>
                            Category
                        </FormHelperText>
                        <Select value={cardCategory} onChange={handleCardCategoryChange}>
                            {availableCategories?.map((item) => {
                                return (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        alignItems={'flex-end'}
                        padding={'6px'}
                        marginTop={'12px'}
                    >
                        <FormControl sx={{ minWidth: '70%' }}>
                            <FormHelperText
                                sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0, marginBottom: '12px' }}
                            >
                                Series
                            </FormHelperText>
                            <Autocomplete
                                value={selectedSeries}
                                onChange={handleSeriesChange}
                                options={availableSeries}
                                fullWidth
                                renderInput={(params) => <TextField {...params} placeholder={'Enter series'} />}
                            />
                        </FormControl>
                        <Button
                            variant={'outlined'}
                            color={'primary'}
                            sx={{ minHeight: '56px', width: '145px' }}
                            startIcon={<AddIcon />}
                            onClick={toggleNewSeries}
                        >
                            New series
                        </Button>
                    </Box>

                    {selectedSeries ? (
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            alignItems={'flex-end'}
                            padding={'6px'}
                            marginTop={'12px'}
                        >
                            <FormControl sx={{ minWidth: '70%' }}>
                                <FormHelperText
                                    sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0, marginBottom: '12px' }}
                                >
                                    Set
                                </FormHelperText>
                                <Autocomplete
                                    value={selectedSet}
                                    onChange={handleSetChange}
                                    options={availableSets}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} placeholder={'Enter set'} />}
                                />
                            </FormControl>
                            <Button
                                variant={'outlined'}
                                color={'primary'}
                                sx={{ minHeight: '56px', width: '145px' }}
                                startIcon={<AddIcon />}
                                onClick={toggleNewSet}
                            >
                                New set
                            </Button>
                        </Box>
                    ) : null}
                    {selectedSet ? (
                        <>
                            <Divider className={classes.topDivider} />
                            <Grid container direction={'row'} sx={{ marginTop: '12px' }} padding={'12px'}>
                                <Grid item md={5}>
                                    <FormControl>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Card Photo
                                        </FormHelperText>
                                        <ImageUploader onChange={handleCardPhotoChange} />
                                    </FormControl>
                                </Grid>

                                <Grid item md={7}>
                                    <FormControl>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Card Name
                                        </FormHelperText>
                                        <TextField
                                            variant="outlined"
                                            value={cardName}
                                            onChange={handleCardNameChange}
                                            placeholder={'Enter card name'}
                                            sx={{ minWidth: '333px' }}
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
                                            Card Number
                                        </FormHelperText>
                                        <TextField
                                            variant="outlined"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder={'Enter card number'}
                                            sx={{ minWidth: '333px' }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container direction={'row'} sx={{ marginTop: '12px' }} spacing={2} padding={'12px'}>
                                <Grid item md={6}>
                                    <FormControl fullWidth>
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
                                                value={releaseDate}
                                                disabled
                                                onChange={handleReleaseDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ marginTop: '12px' }}>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Rarity
                                        </FormHelperText>
                                        <Autocomplete
                                            value={selectedRarity}
                                            onChange={handleRarityChange}
                                            options={availableRarities}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder={'Select Rarity'} />
                                            )}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth sx={{ marginTop: '12px' }}>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Surface (optional)
                                        </FormHelperText>
                                        <Autocomplete
                                            value={selectedSurface}
                                            onChange={handleSurfaceChange}
                                            options={availableSurfaces}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder={'Select Surface'} />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={6}>
                                    <FormControl fullWidth>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Language
                                        </FormHelperText>
                                        <Select value={selectedLanguage || 'none'} onChange={handleLanguageChange}>
                                            <MenuItem value="none" disabled>
                                                <em>Select Language</em>
                                            </MenuItem>
                                            {availableLanguages?.map((item) => {
                                                return (
                                                    <MenuItem key={item} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ marginTop: '12px' }}>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Edition (optional)
                                        </FormHelperText>
                                        <Select value={selectedEdition || 'none'} onChange={handleEditionChange}>
                                            <MenuItem value="none">
                                                <em>Select edition</em>
                                            </MenuItem>
                                            {availableEditions?.map((item) => {
                                                return (
                                                    <MenuItem key={item} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ marginTop: '12px' }}>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                                marginBottom: '12px',
                                            }}
                                        >
                                            Product/Variant (optional)
                                        </FormHelperText>
                                        <TextField
                                            variant="outlined"
                                            value={productVariant}
                                            onChange={handleProductVariantChange}
                                            placeholder={'Enter product/variant'}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    ) : null}

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
                                onClick={handleAddCard}
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

export default ManageCardDialogCreateCardView;
