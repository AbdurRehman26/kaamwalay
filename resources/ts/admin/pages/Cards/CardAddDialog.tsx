import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DateAdapter from '@mui/lab/AdapterMoment';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { batch } from 'react-redux';
import ImageUploader from '@shared/components/ImageUploader';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { CardSeriesEntity } from '@shared/entities/CardSeriesEntity';
import { CardSetEntity } from '@shared/entities/CardSetEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { APIService } from '@shared/services/APIService';
import { NotificationsService } from '@shared/services/NotificationsService';

export interface CardAddDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    isUpdate?: boolean;
    updateCard?: CardProductEntity | any;
    addressId?: number;
    onSubmit(): Promise<void> | void;
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
        dialog: {
            padding: 1,
        },
        label: {
            color: '#0000008A',
        },
        validationStyle: {
            color: '#0000008A',
            fontSize: '12px',
            fontWeight: '400',
            marginTop: '4px',
        },
    }),
    { name: 'CardAddDialog' },
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
export const CardAddDialog = (props: CardAddDialogProps) => {
    const { onClose, onSubmit, isUpdate, updateCard, dialogTitle, addressId, ...rest } = props;
    const classes = useStyles();
    const dialogState = useManageCardDialogState();

    const filesRepository = useRepository(FilesRepository);

    const [isLoading, setIsLoading] = useState(false);
    const [cardCategory, setCardCategory] = useState<CardCategoryEntity | null | undefined>(null);
    const [availableCategories, setAvailableCategories] = useState<CardCategoryEntity[]>([]);
    const [availableSeries, setAvailableSeries] = useState<CardSeries[]>([]);
    const [availableSets, setAvailableSets] = useState<CardSets[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<CardSeries | undefined | null>(null);
    const [selectedSet, setSelectedSet] = useState<CardSets | undefined | null>(null);
    const [selectedCardPhoto, setSelectedCardPhoto] = useState<File | null | undefined>(null);
    const [availableRarities, setAvailableRarities] = useState<CardRarity[]>([]);
    const [selectedRarity, setSelectedRarity] = useState<CardRarity | undefined | null>(null);
    const [availableSurfaces, setAvailableSurfaces] = useState<CardSurface[]>([]);
    const [selectedSurface, setSelectedSurface] = useState<CardSurface | null | undefined>(null);
    const [releaseDate, setReleaseDate] = useState<Date | string | undefined | null>(null);
    const [availableLanguages, setAvailableLanguages] = useState<string[] | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null | undefined>(null);
    const [availableEditions, setAvailableEditions] = useState<string[] | null>(null);
    const [selectedEdition, setSelectedEdition] = useState<string | null | undefined>(null);
    const [productVariant, setProductVariant] = useState<string | null | undefined>(null);
    const [cardName, setCardName] = useState<string | null | undefined>(null);
    const [cardNumber, setCardNumber] = useState<string | null | undefined>(null);
    const [createCardView, setCreateCardView] = useState(true);
    const [createCategoryView, setCreateCategoryView] = useState(false);
    const [createSeriesView, setCreateSeriesView] = useState(false);
    const [createSetView, setCreateSetView] = useState(false);
    const [newSetName, setNewSetName] = useState('');
    const [newSetLogo, setNewSetLogo] = useState<File | null>(null);
    const [newSetReleaseDate, setNewSetReleaseDate] = useState<Date | null>(null);
    const [newSeriesLogo, setNewSeriesLogo] = useState<File | null>(null);
    const [newSeriesName, setNewSeriesName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryLogo, setNewCategoryLogo] = useState<File | null>(null);
    const apiService = useInjectable(APIService);

    const dispatch = useSharedDispatch();
    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();

            setSelectedSeries(null);
            setSelectedSet(null);
            setSelectedLanguage(null);
            setSelectedRarity(null);
            setSelectedSurface(null);
            setProductVariant(null);
            setReleaseDate(null);

            setCreateCardView(true);
            setCreateCategoryView(false);
            setCreateSetView(false);
            setCreateSeriesView(false);
        }
    }, [onClose]);

    const fetchSeries = useCallback(
        async (categoryId: any) => {
            const endpoint = apiService.createEndpoint(`admin/cards/series?category_id=` + categoryId);
            const response = await endpoint.get('');
            setAvailableSeries(
                response.data.map((item: CardSeries) => {
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
                dispatch(manageCardDialogActions.setSelectedCategory(dialogState.selectedCategory ?? response.data[0]));

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
        (e, newValue) => {
            setCardCategory(newValue);

            const category = availableCategories.filter((cat) => {
                return cat.id === newValue.id;
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

            fetchSeries(newValue.id);
            fetchDropdownsData(newValue.id);
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

    const toggleNewCategory = useCallback(() => {
        setCreateCategoryView(true);
        setCreateCardView(false);
        setCreateSetView(false);
        setCreateSeriesView(false);
    }, []);

    const toggleNewSeries = useCallback(() => {
        setCreateCategoryView(false);
        setCreateCardView(false);
        setCreateSetView(false);
        setCreateSeriesView(true);
    }, []);

    const toggleNewSet = useCallback(() => {
        setCreateCategoryView(false);
        setCreateSeriesView(false);
        setCreateCardView(false);
        setCreateSetView(true);
    }, []);

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
    }, [selectedSeries, selectedSet, cardName, selectedCardPhoto, selectedLanguage, selectedRarity, cardNumber]);

    const handleAddCard = async () => {
        const endpoint = apiService.createEndpoint(isUpdate ? `admin/cards/${updateCard?.id}` : `admin/cards`);

        setIsLoading(true);
        try {
            const cardPublicImage = updateCard?.imagePath
                ? updateCard.imagePath
                : await filesRepository.uploadFile(selectedCardPhoto!);
            const DTO = {
                imagePath: cardPublicImage,
                name: cardName || updateCard?.cardSetName,
                category: cardCategory,
                releaseDate: releaseDate || updateCard?.releaseDate,
                seriesId: selectedSeries?.id,
                seriesName: null,
                seriesImage: null,
                setId: selectedSet?.id,
                setName: null,
                setImage: null,
                cardNumber: cardNumber,
                language: selectedLanguage || updateCard?.language,
                rarity: selectedRarity?.name || updateCard?.rarity,
                edition: selectedEdition !== 'none' ? selectedEdition : updateCard?.edition,
                surface: selectedSurface?.name,
                variant: productVariant,
            };
            if (isUpdate) {
                await endpoint.put('', DTO);
                NotificationsService.success('Card Updated successfully!');
            } else {
                await endpoint.post('', DTO);
                NotificationsService.success('Card Added successfully!');
            }
            onSubmit();
        } catch (e: any) {
            NotificationsService.exception(e);
        }
        setIsLoading(false);
    };

    const handleNewSetLogoChange = useCallback((newSetLogo: File | null) => {
        setNewSetLogo(newSetLogo);
    }, []);

    const handleNewSetReleaseDateChange = useCallback((newReleaseDate: Date | null) => {
        setNewSetReleaseDate(newReleaseDate);
    }, []);

    const handleNewSetNameChange = useCallback((e) => setNewSetName(e.target.value), []);
    const showSaveButtonSet = useMemo(() => {
        return !!(newSetLogo && newSetName);
    }, [newSetLogo, newSetName]);

    const handleAddSet = async () => {
        const endpoint = apiService.createEndpoint('/admin/cards/sets');
        setIsLoading(true);
        try {
            const setLogoPublicImage = await filesRepository.uploadFile(newSetLogo!);

            const DTO = {
                cardSeriesId: dialogState.selectedCardSeries?.id,
                name: newSetName,
                releaseDate: newSetReleaseDate,
                imagePath: setLogoPublicImage,
            };
            const responseItem = await endpoint.post('', DTO);
            NotificationsService.success('Set Added Successfully');
            setSelectedSeriesFromState();

            batch(() => {
                dispatch(manageCardDialogActions.setSelectedCardSet(responseItem.data as CardSetEntity));
            });
        } catch (e: any) {
            NotificationsService.exception(e);
        }
        setIsLoading(false);
    };

    const handleNewSeriesLogoChange = useCallback((newSeriesLogo: File | null) => setNewSeriesLogo(newSeriesLogo), []);
    const handleNewCategoryLogoChange = useCallback(
        (newCategoryLogo: File | null) => setNewCategoryLogo(newCategoryLogo),
        [],
    );

    const handleNewCategoryNameChange = useCallback((e) => setNewCategoryName(e.target.value), []);
    const showSaveButtonCategory = useMemo(() => {
        return !!(newCategoryLogo && newCategoryName);
    }, [newCategoryLogo, newCategoryName]);

    const handleNewSeriesNameChange = useCallback((e) => setNewSeriesName(e.target.value), []);
    const showSaveButtonSeries = useMemo(() => {
        return !!(newSeriesLogo && newSeriesName);
    }, [newSeriesLogo, newSeriesName]);

    const handleAddCategory = async () => {
        const endpoint = apiService.createEndpoint('/admin/cards/categories', { version: 'v3' });
        setIsLoading(true);
        try {
            const categoriesLogo = await filesRepository.uploadFile(newCategoryLogo!);

            const DTO = {
                name: newCategoryName,
                imageUrl: categoriesLogo,
            };
            const responseItem = await endpoint.post('', DTO);
            batch(() => {
                dispatch(manageCardDialogActions.setSelectedCardSeries(responseItem.data as CardSeriesEntity));
                dispatch(manageCardDialogActions.navigateToPreviousView());
            });
            setCreateCardView(true);
            setCreateCategoryView(false);
            NotificationsService.success('Category Added Successfully');
        } catch (e: any) {
            NotificationsService.exception(e);
        }
        setIsLoading(false);
    };

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
            NotificationsService.success('Series Added Successfully');
            setSelectedSeriesFromState();

            await fetchSeries(dialogState.selectedCategory?.id);
            batch(() => {
                dispatch(manageCardDialogActions.setSelectedCardSeries(responseItem.data as CardSeriesEntity));
            });
        } catch (e: any) {
            NotificationsService.exception(e);
        }
        setIsLoading(false);
    };

    useEffect(
        () => {
            setCardCategory(updateCard?.id);
            setSelectedSeries(updateCard?.cardSeriesName);
            setSelectedSet(
                dialogState.selectedCardSet
                    ? {
                          id: dialogState.selectedCardSet.id,
                          cardSeriesId: dialogState.selectedCardSet.cardSeriesId,
                          label: dialogState.selectedCardSet.name,
                          name: dialogState.selectedCardSet.name,
                          imagePath: dialogState.selectedCardSet.imagePath,
                          releaseDate: dialogState.selectedCardSet.releaseDate,
                      }
                    : updateCard?.cardSetName,
            );
            setCardName(updateCard?.name);
            setCardNumber(updateCard?.cardNumber);
            setReleaseDate(updateCard?.releaseDate);
            setSelectedRarity(updateCard?.rarity);
            setSelectedSurface(updateCard?.surface);
            setSelectedEdition(updateCard?.edition);
            setSelectedLanguage(updateCard?.language);
            setProductVariant(updateCard?.variant);
            setSelectedCardPhoto(updateCard?.imagePath);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isUpdate, updateCard],
    );

    const handleModalBack = () => {
        setCreateCardView(true);
        setCreateCategoryView(false);
        setCreateSetView(false);
        setCreateSeriesView(false);
    };

    const closeIcon = (
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
    );

    const modalBack = (
        <IconButton onClick={handleModalBack} size={'small'} sx={{ color: 'black', marginBottom: 0.5 }}>
            <ArrowBackIcon />
        </IconButton>
    );

    const createCategory = (
        <div>
            <DialogTitle>
                {modalBack}
                Create a New Category
                {closeIcon}
            </DialogTitle>
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
                                    }}
                                >
                                    Category Logo*
                                </FormHelperText>
                                <ImageUploader isCategoryImage={true} onChange={handleNewCategoryLogoChange} />
                                <span className={classes.validationStyle}>
                                    Only upload .png file with a transparent background.
                                </span>
                            </FormControl>
                        </Grid>
                        <Grid item md={8}>
                            <FormControl>
                                <FormHelperText
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#000',
                                        marginLeft: 0,
                                    }}
                                >
                                    Category Name*
                                </FormHelperText>
                                <TextField
                                    variant="outlined"
                                    value={newCategoryName}
                                    onChange={handleNewCategoryNameChange}
                                    placeholder={'Enter category name'}
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
                            onClick={handleAddCategory}
                            disabled={!showSaveButtonCategory || isLoading}
                        >
                            {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );

    const createSeries = (
        <div>
            <DialogTitle>
                {modalBack}
                Create a New Series
                {closeIcon}
            </DialogTitle>
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
                            disabled={!showSaveButtonSeries || isLoading}
                        >
                            {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );

    const createSet = (
        <div>
            <DialogTitle>
                {modalBack}
                Create a New Set
                {closeIcon}
            </DialogTitle>
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
                            disabled={!showSaveButtonSet || isLoading}
                        >
                            {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );

    const createCard = (
        <>
            <DialogTitle>
                {isUpdate ? 'Edit Card' : 'Create a New Card'}
                {closeIcon}
            </DialogTitle>
            <DialogContent className={classes.dialog}>
                <Box display={'flex'} flexDirection={'column'} padding={'12px'}>
                    {!isUpdate ? (
                        <>
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
                                        Category
                                    </FormHelperText>
                                    <Autocomplete
                                        value={cardCategory}
                                        onChange={handleCardCategoryChange}
                                        options={availableCategories}
                                        getOptionLabel={(option) => option.name || ''}
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField {...params} placeholder={'Select Category'} />
                                        )}
                                    />
                                </FormControl>
                                <Button
                                    variant={'outlined'}
                                    color={'primary'}
                                    sx={{ minHeight: '56px', width: '145px' }}
                                    onClick={toggleNewCategory}
                                >
                                    Add Category
                                </Button>
                            </Box>
                            {cardCategory && !isUpdate ? (
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'flex-end'}
                                    padding={'6px'}
                                    marginTop={'12px'}
                                >
                                    <FormControl sx={{ minWidth: '70%' }}>
                                        <FormHelperText sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}>
                                            Series
                                        </FormHelperText>
                                        <Autocomplete
                                            value={selectedSeries}
                                            onChange={handleSeriesChange}
                                            options={availableSeries}
                                            fullWidth
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder={'Enter Series'}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: selectedSeries ? (
                                                            <img
                                                                src={selectedSeries?.imagePath}
                                                                alt=""
                                                                style={{
                                                                    height: '19px',
                                                                    width: '49px',
                                                                    marginLeft: '10px',
                                                                }}
                                                            />
                                                        ) : null,
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <Button
                                        disabled={isUpdate}
                                        variant={'outlined'}
                                        color={'primary'}
                                        sx={{ minHeight: '56px', width: '145px' }}
                                        onClick={toggleNewSeries}
                                    >
                                        Add series
                                    </Button>
                                </Box>
                            ) : null}
                        </>
                    ) : null}
                    {selectedSeries && !isUpdate ? (
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            alignItems={'flex-end'}
                            padding={'6px'}
                            marginTop={'12px'}
                        >
                            <FormControl sx={{ minWidth: '70%' }}>
                                <FormHelperText sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}>
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
                                disabled={isUpdate}
                                variant={'outlined'}
                                color={'primary'}
                                sx={{ minHeight: '56px', width: '145px' }}
                                onClick={toggleNewSet}
                            >
                                Add Set
                            </Button>
                        </Box>
                    ) : null}

                    {selectedSet || isUpdate ? (
                        <>
                            {!isUpdate ? <Divider className={classes.topDivider} /> : null}
                            <Grid container direction={'row'} sx={{ marginTop: '12px' }} padding={'12px'}>
                                <Grid item md={4}>
                                    <FormControl>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                            }}
                                        >
                                            Card Photo
                                        </FormHelperText>
                                        <ImageUploader
                                            imageUrl={isUpdate ? selectedCardPhoto : null}
                                            isSmall={true}
                                            onDelete={() => setSelectedCardPhoto(null)}
                                            maxHeight="150px"
                                            maxWidth="155px"
                                            onChange={handleCardPhotoChange}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={8}>
                                    <FormControl>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                            }}
                                        >
                                            Card Name
                                        </FormHelperText>
                                        <TextField
                                            variant="outlined"
                                            value={cardName}
                                            onChange={handleCardNameChange}
                                            placeholder={'Enter card name'}
                                            sx={{ width: '366px' }}
                                        />
                                    </FormControl>

                                    <FormControl sx={{ marginTop: '15px' }}>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                            }}
                                        >
                                            Card Number
                                        </FormHelperText>
                                        <TextField
                                            variant="outlined"
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                            placeholder={'Enter card number'}
                                            sx={{ width: '366px' }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {isUpdate ? (
                                <>
                                    <Grid container direction={'row'} spacing={2} padding={'16px'}>
                                        <FormControl sx={{ minWidth: '99%', ml: 1.5 }}>
                                            <FormHelperText
                                                className={classes.label}
                                                sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}
                                            >
                                                Category
                                            </FormHelperText>
                                            <Select displayEmpty disabled value={updateCard?.cardCategoryName}>
                                                <MenuItem value={updateCard?.cardCategoryName}>
                                                    {updateCard?.cardCategoryName}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid container direction={'row'} spacing={2} padding={'16px'}>
                                        <FormControl sx={{ minWidth: '99%', ml: 1.5 }}>
                                            <FormHelperText
                                                className={classes.label}
                                                sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}
                                            >
                                                Series
                                            </FormHelperText>
                                            <Select displayEmpty value={updateCard?.cardSeriesName} disabled>
                                                <MenuItem value={updateCard?.cardSeriesName}>
                                                    {updateCard?.cardSeriesName}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid container direction={'row'} spacing={2} padding={'16px'}>
                                        <FormControl sx={{ minWidth: '99%', ml: 1.5 }}>
                                            <FormHelperText
                                                className={classes.label}
                                                sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}
                                            >
                                                Set
                                            </FormHelperText>
                                            <Select displayEmpty value={updateCard?.cardSetName} disabled>
                                                <MenuItem value={updateCard?.cardSetName}>
                                                    {updateCard?.cardSetName}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </>
                            ) : null}

                            <Grid
                                container
                                direction={'row'}
                                sx={{ marginTop: isUpdate ? 0 : '12px' }}
                                spacing={2}
                                padding={'12px'}
                            >
                                <Grid item md={6}>
                                    <FormControl fullWidth>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginLeft: 0,
                                            }}
                                        >
                                            Release Date
                                        </FormHelperText>
                                        <LocalizationProvider dateAdapter={DateAdapter}>
                                            <DesktopDatePicker
                                                inputFormat="MM/DD/yyyy"
                                                value={releaseDate}
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
                                            }}
                                        >
                                            Surface <span className={classes.label}>(optional)</span>
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
                                            }}
                                        >
                                            Language
                                        </FormHelperText>
                                        <Select value={selectedLanguage || 'none'} onChange={handleLanguageChange}>
                                            <MenuItem value="none" disabled>
                                                Select Language
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
                                            }}
                                        >
                                            Edition <span className={classes.label}>(optional)</span>
                                        </FormHelperText>
                                        <Select value={selectedEdition || 'none'} onChange={handleEditionChange}>
                                            <MenuItem value="none" disabled>
                                                Select edition
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
                                            }}
                                        >
                                            Product/Variant <span className={classes.label}>(optional)</span>
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
                </Box>
            </DialogContent>
            <DialogActions sx={{ margin: '16px' }}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={selectedSet || isUpdate ? 'space-between' : 'end'}
                        minWidth={'150px'}
                        marginRight={'13px'}
                    >
                        <Button variant="text" sx={{ color: '#000' }} onClick={handleClose}>
                            Cancel
                        </Button>
                        {selectedSet || isUpdate ? (
                            <Button
                                variant="contained"
                                color={'primary'}
                                onClick={handleAddCard}
                                disabled={!showSaveButton || isLoading}
                            >
                                {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                            </Button>
                        ) : null}
                    </Box>
                </Box>
            </DialogActions>
        </>
    );

    return (
        <>
            <Dialog onClose={handleClose} {...rest} fullWidth scroll={'body'}>
                {createCardView ? createCard : null}
                {createCategoryView ? createCategory : null}
                {createSeriesView ? createSeries : null}
                {createSetView ? createSet : null}
            </Dialog>
        </>
    );
};

export default CardAddDialog;
