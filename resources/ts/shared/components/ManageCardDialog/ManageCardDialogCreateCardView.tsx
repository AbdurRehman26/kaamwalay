import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { ForwardedRef, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import ManageCardDialogHeader from './ManageCardDialogHeader';
import { CircularProgress, FormControl, FormHelperText, Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useInjectable } from '@shared/hooks/useInjectable';
import { APIService } from '@shared/services/APIService';
import { Autocomplete, DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import ImageUploader from '@shared/components/ImageUploader';
import DateAdapter from '@mui/lab/AdapterMoment';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useRepository } from '@shared/hooks/useRepository';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { useNotifications } from '@shared/hooks/useNotifications';
import { batch } from 'react-redux';
import { ManageCardDialogViewEnum } from '@shared/constants/ManageCardDialogViewEnum';

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
    cardSets: CardSets[];
}

export const ManageCardDialogCreateCardView = forwardRef(
    (
        { onAdd, isSwappable, declaredValue = 0 }: ManageCardDialogCreateCardViewProps,
        ref: ForwardedRef<HTMLDivElement>,
    ) => {
        const classes = useStyles();

        const filesRepository = useRepository(FilesRepository);

        const [isLoading, setIsLoading] = useState(false);
        const [cardCategory, setCardCategory] = useState<number | null>(null);
        const [availableCategories, setAvailableCategories] = useState<{ id: number; name: string }[]>([]);
        const [availableSeriesWithSets, setAvailableSeriesWithSets] = useState<CardSeries[]>([]);
        const [selectedSeries, setSelectedSeries] = useState<CardSeries | null | undefined>(null);
        const [selectedSet, setSelectedSet] = useState<CardSets | null>(null);
        const [selectedCardPhoto, setSelectedCardPhoto] = useState<File | null>(null);
        const [availableRarities, setAvailableRarities] = useState<string[] | null>(null);
        const [selectedRarity, setSelectedRarity] = useState<string>('none');
        const [availableSurfaces, setAvailableSurfaces] = useState<string[] | null>(null);
        const [selectedSurface, setSelectedSurface] = useState<string>('none');
        const [releaseDate, setReleaseDate] = useState<Date | null>(null);
        const [availableLanguages, setAvailableLanguages] = useState<string[] | null>(null);
        const [selectedLanguage, setSelectedLanguage] = useState<string>('none');
        const [availableEditions, setAvailableEditions] = useState<string[] | null>(null);
        const [selectedEdition, setSelectedEdition] = useState<string>('none');
        const [productVariant, setProductVariant] = useState<string>('');
        const [cardName, setCardName] = useState('');
        const [cardNumber, setCardNumber] = useState('');

        const Notifications = useNotifications();
        // New series section
        const [showNewSeries, setShowNewSeries] = useState(false);
        const [newSeriesLogo, setNewSeriesLogo] = useState<File | null>(null);
        const [newSeriesName, setNewSeriesName] = useState('');

        // New set section
        const [showNewSetBox, setShowNewSetBox] = useState(false);
        const [newSetName, setNewSetName] = useState('');
        const [newSetLogo, setNewSetLogo] = useState<File | null>(null);
        const [newSetReleaseDate, setNewSetReleaseDate] = useState<Date | null>(null);

        const apiService = useInjectable(APIService);

        const dispatch = useSharedDispatch();
        const handleClose = useCallback(() => {
            dispatch(manageCardDialogActions.setOpen(false));
        }, [dispatch]);

        useEffect(() => {
            async function fetchDropdownsData() {
                const endpoint = apiService.createEndpoint(`admin/cards/options`);
                const response = await endpoint.get('');
                setAvailableCategories(response.data.category);
                setCardCategory(response.data.category[0].id);
                setAvailableSeriesWithSets(
                    response.data.series.map((item: CardSeries) => {
                        // TODO: This is a workaround to add 'label' alongside name on these objects. I'm sure there's a better way to do this but it's 4AM and I can't think of it.
                        return {
                            id: item.id,
                            label: item.name,
                            name: item.name,
                            imagePath: item.imagePath,
                            cardSets: item.cardSets.map((set) => ({
                                id: set.id,
                                cardSeriesId: set.cardSeriesId,
                                label: set.name,
                                name: set.name,
                                imagePath: set.imagePath,
                                releaseDate: set.releaseDate,
                            })),
                        };
                    }),
                );
                setAvailableRarities(response.data.rarity);
                setAvailableSurfaces(response.data.surface);
                setAvailableLanguages(response.data.language);
                setAvailableEditions(response.data.edition);
            }
            fetchDropdownsData();
        }, []);

        const handleSeriesChange = useCallback(
            (e, newValue) => {
                setSelectedSeries(newValue);
                setSelectedSet(null);
            },
            [availableSeriesWithSets, selectedSeries, selectedSet],
        );

        const handleSetChange = useCallback(
            (e, newValue) => {
                setSelectedSet(newValue);
                setReleaseDate(new Date(newValue?.releaseDate));
            },
            [availableSeriesWithSets, selectedSeries, selectedSet],
        );

        const handleCardPhotoChange = useCallback((cardImage: File | null) => {
            setSelectedCardPhoto(cardImage);
        }, []);

        const handleNewSeriesLogoChange = useCallback(
            (newSeriesLogo: File | null) => setNewSeriesLogo(newSeriesLogo),
            [],
        );
        const handleNewSetLogoChange = useCallback((newSetLogo: File | null) => {
            setNewSetLogo(newSetLogo);
        }, []);

        const handleCardNameChange = useCallback((e) => {
            setCardName(e.target.value);
        }, []);

        const handleReleaseDateChange = useCallback((newReleaseDate: Date | null) => {
            setReleaseDate(newReleaseDate);
        }, []);

        const handleNewSetReleaseDateChange = useCallback((newReleaseDate: Date | null) => {
            setNewSetReleaseDate(newReleaseDate);
        }, []);

        const toggleNewSeries = useCallback(() => {
            setNewSeriesLogo(null);
            setNewSeriesName('');
            setShowNewSeries(!showNewSeries);
        }, [showNewSeries, newSeriesLogo, newSeriesName]);

        const toggleNewSet = useCallback(() => {
            setNewSetLogo(null);
            setNewSetName('');
            setNewSetReleaseDate(null);
            setShowNewSetBox(!showNewSetBox);
        }, [showNewSetBox, newSetLogo, newSetName, newSetReleaseDate]);

        const handleCardCategoryChange = useCallback((e) => setCardCategory(e.target.value), []);
        const handleRarityChange = useCallback((e) => setSelectedRarity(e.target.value), []);
        const handleSurfaceChange = useCallback((e) => setSelectedSurface(e.target.value), []);
        const handleLanguageChange = useCallback((e) => setSelectedLanguage(e.target.value), []);
        const handleEditionChange = useCallback((e) => setSelectedEdition(e.target.value), []);
        const handleProductVariantChange = useCallback((e) => setProductVariant(e.target.value), []);
        const handleNewSeriesNameChange = useCallback((e) => setNewSeriesName(e.target.value), []);
        const handleNewSetNameChange = useCallback((e) => setNewSetName(e.target.value), []);
        const handleCardNumberChange = useCallback((e) => setCardNumber(e.target.value), []);
        const showSaveButton = useMemo(() => {
            if (showNewSetBox && !showNewSeries) {
                return !!(
                    newSetLogo &&
                    newSetName &&
                    newSetReleaseDate &&
                    selectedCardPhoto &&
                    cardName &&
                    cardNumber &&
                    selectedRarity !== 'none' &&
                    selectedLanguage !== 'none'
                );
            }

            if (!showNewSeries && !showNewSetBox) {
                return !!(
                    selectedSeries &&
                    selectedSet &&
                    selectedCardPhoto &&
                    cardName &&
                    cardNumber &&
                    selectedRarity !== 'none' &&
                    selectedLanguage !== 'none'
                );
            }

            if (showNewSeries) {
                return !!(
                    newSeriesLogo &&
                    newSeriesName &&
                    newSetLogo &&
                    newSetName &&
                    newSetReleaseDate &&
                    selectedCardPhoto &&
                    cardName &&
                    cardNumber &&
                    selectedRarity !== 'none' &&
                    selectedLanguage !== 'none'
                );
            }
        }, [
            cardCategory,
            selectedSeries,
            showNewSeries,
            newSeriesLogo,
            newSeriesName,
            showNewSetBox,
            newSetLogo,
            newSetName,
            newSetReleaseDate,
            selectedSet,
            selectedCardPhoto,
            cardName,
            releaseDate,
            selectedLanguage,
            selectedRarity,
            selectedEdition,
            selectedSurface,
            productVariant,
            cardNumber,
        ]);

        const handleAddCard = async () => {
            const endpoint = apiService.createEndpoint('/admin/cards');
            // Saving card with existing series but new set
            if (showNewSetBox && !showNewSeries) {
                setIsLoading(true);
                try {
                    const cardPublicImage = await filesRepository.uploadFile(selectedCardPhoto!);
                    const setLogoPublicImage = await filesRepository.uploadFile(newSetLogo!);
                    const DTO = {
                        imagePath: cardPublicImage,
                        name: cardName,
                        category: cardCategory,
                        releaseDate: newSetReleaseDate,
                        seriesId: selectedSeries?.id,
                        seriesName: null,
                        seriesImage: null,
                        setId: null,
                        setName: newSetName,
                        setImage: setLogoPublicImage,
                        cardNumber: cardNumber,
                        language: selectedLanguage,
                        rarity: selectedRarity,
                        edition: selectedEdition !== 'none' ? selectedEdition : null,
                        surface: selectedSurface !== 'none' ? selectedSurface : null,
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
            }

            // Saving card with existing set & series
            if (!showNewSeries && !showNewSetBox) {
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
                        rarity: selectedRarity,
                        edition: selectedEdition !== 'none' ? selectedEdition : null,
                        surface: selectedSurface !== 'none' ? selectedSurface : null,
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
            }

            if (showNewSeries) {
                setIsLoading(true);
                try {
                    const cardPublicImage = await filesRepository.uploadFile(selectedCardPhoto!);
                    const seriesLogoPublicImage = await filesRepository.uploadFile(newSeriesLogo!);
                    const setLogoPublicImage = await filesRepository.uploadFile(newSetLogo!);

                    const DTO = {
                        imagePath: cardPublicImage,
                        name: cardName,
                        category: cardCategory,
                        releaseDate: newSetReleaseDate,
                        seriesId: null,
                        seriesName: newSeriesName,
                        seriesImage: seriesLogoPublicImage,
                        setId: null,
                        setName: newSetName,
                        setImage: setLogoPublicImage,
                        cardNumber: cardNumber,
                        language: selectedLanguage,
                        rarity: selectedRarity,
                        edition: selectedEdition !== 'none' ? selectedEdition : null,
                        surface: selectedSurface !== 'none' ? selectedSurface : null,
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
            }
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

                    {showNewSeries ? (
                        <Box padding={'12px'}>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                sx={{
                                    border: '1px solid #CCCCCC',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    padding={'12px'}
                                    alignItems={'center'}
                                    sx={{
                                        backgroundColor: '#F9F9F9',
                                        borderBottomColor: '#CCCCCC',
                                        borderBottomStyle: 'solid',
                                        borderBottomWidth: '1px',
                                    }}
                                >
                                    <Typography variant={'subtitle2'}>New Series</Typography>
                                    <IconButton onClick={toggleNewSeries}>
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                </Box>

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
                        </Box>
                    ) : null}

                    {!showNewSeries ? (
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
                                    options={availableSeriesWithSets}
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
                    ) : null}

                    {showNewSeries || showNewSetBox ? (
                        <Box padding={'12px'}>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                sx={{
                                    border: '1px solid #CCCCCC',
                                    width: '100%',
                                }}
                            >
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    padding={'12px'}
                                    alignItems={'center'}
                                    sx={{
                                        backgroundColor: '#F9F9F9',
                                        borderBottomColor: '#CCCCCC',
                                        borderBottomStyle: 'solid',
                                        borderBottomWidth: '1px',
                                    }}
                                >
                                    <Typography variant={'subtitle2'}>Set</Typography>
                                    {!showNewSeries ? (
                                        <IconButton onClick={toggleNewSet}>
                                            <DeleteOutlineOutlinedIcon />
                                        </IconButton>
                                    ) : null}
                                </Box>

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
                            </Box>
                        </Box>
                    ) : null}

                    {selectedSeries && !showNewSetBox && !showNewSeries ? (
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
                                    options={selectedSeries.cardSets}
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
                    {selectedSet || showNewSetBox || showNewSeries ? (
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
                                        <Select value={selectedRarity || 'none'} onChange={handleRarityChange}>
                                            <MenuItem value="none" disabled>
                                                <em>Select Rarity</em>
                                            </MenuItem>
                                            {availableRarities?.map((item) => {
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
                                            Surface (optional)
                                        </FormHelperText>
                                        <Select value={selectedSurface || 'none'} onChange={handleSurfaceChange}>
                                            <MenuItem value="none">
                                                <em>Select Surface</em>
                                            </MenuItem>
                                            {availableSurfaces?.map((item) => {
                                                return (
                                                    <MenuItem key={item} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
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
                                {isLoading ? <CircularProgress color={'secondary'} /> : 'Save'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </div>
        );
    },
);

export default ManageCardDialogCreateCardView;
