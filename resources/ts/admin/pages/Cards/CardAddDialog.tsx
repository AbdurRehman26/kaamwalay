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
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';
import { CardCategoryEntity } from '@shared/entities/CardCategoryEntity';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { CardSeriesEntity } from '@shared/entities/CardSeriesEntity';
import { CardSetEntity } from '@shared/entities/CardSetEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useManageCardDialogState } from '@shared/redux/hooks/useManageCardDialogState';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { APIService } from '@shared/services/APIService';

export interface CardAddDialogProps extends Omit<DialogProps, 'onSubmit'> {
    dialogTitle?: string;
    isUpdate?: boolean;
    updateCard?: CardProductEntity | never;
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

    const [createCardView, setCreateCardView] = useState(true);
    const [createSeriesView, setCreateSeriesView] = useState(false);
    const [createSetView, setCreateSetView] = useState(false);

    //
    const [newSetName, setNewSetName] = useState('');
    const [newSetLogo, setNewSetLogo] = useState<File | null>(null);
    const [newSetReleaseDate, setNewSetReleaseDate] = useState<Date | null>(null);

    //

    //
    const [newSeriesLogo, setNewSeriesLogo] = useState<File | null>(null);
    const [newSeriesName, setNewSeriesName] = useState('');
    //

    const Notifications = useNotifications();

    const apiService = useInjectable(APIService);

    const dispatch = useSharedDispatch();
    const handleClose = useCallback(() => {
        if (onClose) {
            (onClose as any)();
            setCreateCardView(true);
            setCreateSetView(false);
            setCreateSeriesView(false);
        }
    }, [onClose]);

    const fetchSeries = useCallback(
        async (categoryId: Number) => {
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

    // const fetchCard = useCallback(
    //     async (categoryId: Number) => {
    //         const endpoint = apiService.createEndpoint(`admin/cards/` + categoryId);
    //         const response = await endpoint.get('');

    //         console.log("AAAA A " , response)

    //     },
    //     [apiService],
    // );

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
                setCardCategory(categoryId);
                // fetchCard(3);
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
        setCreateCardView(false);
        setCreateSetView(false);
        setCreateSeriesView(true);
    }, []);

    const toggleNewSet = useCallback(() => {
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

    // set start
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
    // set end

    // series start
    const handleNewSeriesLogoChange = useCallback((newSeriesLogo: File | null) => setNewSeriesLogo(newSeriesLogo), []);

    const handleNewSeriesNameChange = useCallback((e) => setNewSeriesName(e.target.value), []);
    const showSaveButtonSeries = useMemo(() => {
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

    const handleModalBack = () => {
        setCreateCardView(true);
        setCreateSetView(false);
        setCreateSeriesView(false);
    };

    // series end

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
                {isUpdate ? 'Update Card' : 'Create a New Card'}
                {closeIcon}
            </DialogTitle>
            <DialogContent className={classes.dialog}>
                <Box display={'flex'} flexDirection={'column'} padding={'12px'}>
                    <FormControl sx={{ m: 1, minWidth: '97%' }}>
                        <FormHelperText sx={{ fontWeight: 'bold', color: '#000', marginLeft: 0 }}>
                            Category
                        </FormHelperText>
                        <Select
                            value={isUpdate ? updateCard?.cardCategoryName : cardCategory}
                            onChange={handleCardCategoryChange}
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
                                value={isUpdate ? updateCard?.cardSeriesName : selectedSeries}
                                onChange={handleSeriesChange}
                                options={availableSeries}
                                fullWidth
                                renderInput={(params) => <TextField {...params} placeholder={'Enter series'} />}
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

                    {selectedSeries || isUpdate ? (
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
                                    value={isUpdate ? updateCard?.cardSetName : selectedSet}
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
                            <Divider className={classes.topDivider} />
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
                                            imageUrl={isUpdate ? updateCard?.imagePath : ''}
                                            isSmall={true}
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
                                            value={isUpdate ? updateCard?.cardSetName : cardName}
                                            onChange={handleCardNameChange}
                                            placeholder={'Enter card name'}
                                            sx={{ minWidth: '333px' }}
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
                                            value={isUpdate ? updateCard?.cardNumberOrder : cardNumber}
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
                                            }}
                                        >
                                            Release Date
                                        </FormHelperText>
                                        <LocalizationProvider dateAdapter={DateAdapter}>
                                            <DesktopDatePicker
                                                inputFormat="MM/DD/yyyy"
                                                value={isUpdate ? updateCard?.releaseDate : releaseDate}
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
                                            value={isUpdate ? updateCard?.rarity : selectedRarity}
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
                                            value={isUpdate ? updateCard?.surface : selectedSurface}
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
                                        <Select
                                            value={isUpdate ? updateCard?.language : selectedLanguage || 'none'}
                                            onChange={handleLanguageChange}
                                        >
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
                                        <Select
                                            value={isUpdate ? updateCard?.edition : selectedEdition || 'none'}
                                            onChange={handleEditionChange}
                                        >
                                            <MenuItem value="none">Select edition</MenuItem>
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
                                            value={isUpdate ? updateCard.varient : productVariant}
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
                        justifyContent={selectedSet ? 'space-between' : 'end'}
                        minWidth={'150px'}
                        marginRight={'13px'}
                    >
                        <Button variant="text" sx={{ color: '#000' }} onClick={handleClose}>
                            Cancel
                        </Button>
                        {selectedSet ? (
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
                {createSeriesView ? createSeries : null}
                {createSetView ? createSet : null}
            </Dialog>
        </>
    );
};

export default CardAddDialog;
