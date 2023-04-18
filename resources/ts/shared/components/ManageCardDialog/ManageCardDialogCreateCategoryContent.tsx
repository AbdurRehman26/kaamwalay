import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useMemo, useState } from 'react';
import { batch } from 'react-redux';
import ImageUploader from '@shared/components/ImageUploader';
import { CardSeriesEntity } from '@shared/entities/CardSeriesEntity';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { manageCardDialogActions } from '@shared/redux/slices/manageCardDialogSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { APIService } from '@shared/services/APIService';

export interface ManageCardDialogCreateCategoryContentProps {
    onAdd?: () => void | undefined | null;
    onCancel?: () => void | undefined | null;
    margin?: string;
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
        validationStyle: {
            color: '#0000008A',
            fontSize: '12px',
            fontWeight: '400',
            marginTop: '4px',
        },
        textFieldStyle: {
            minWidth: '231px',
            '& p': {
                fontSize: '12px',
                color: '#FF0000 !important',
                fontWeight: 500,
            },
        },
    }),
    { name: 'ManageCardDialogView' },
);

export function ManageCardDialogCreateCategoryContent(props: ManageCardDialogCreateCategoryContentProps) {
    const { margin = '0px' } = props;
    const classes = useStyles();
    const filesRepository = useRepository(FilesRepository);

    const [isLoading, setIsLoading] = useState(false);

    const Notifications = useNotifications();
    // New category section
    const [newCategoryLogo, setNewCategoryLogo] = useState<File | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const apiService = useInjectable(APIService);

    const dispatch = useSharedDispatch();
    const handleClose = useCallback(() => {
        dispatch(manageCardDialogActions.setOpen(false));
        props.onCancel?.();
    }, [dispatch, props]);

    const handleNewCategoryLogoChange = useCallback(
        (newCategoryLogo: File | null) => setNewCategoryLogo(newCategoryLogo),
        [],
    );

    const handleNewCategoryNameChange = useCallback((e) => setNewCategoryName(e.target.value), []);
    const showSaveButton = useMemo(() => {
        return !!(newCategoryLogo && newCategoryName);
    }, [newCategoryLogo, newCategoryName]);

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
                dispatch(manageCardDialogActions.setSelectedCategory(responseItem.data));
                dispatch(manageCardDialogActions.setSelectedCardSeries(responseItem.data as CardSeriesEntity));
                dispatch(manageCardDialogActions.navigateToPreviousView());
            });
            Notifications.success('Category Added Successfully');
            props.onAdd?.();
        } catch (e: any) {
            if (e.message) {
                setErrorMessage(e.message);
                setTimeout(() => {
                    setErrorMessage('');
                }, 2500);
            }
            Notifications.exception(e);
        }
        setIsLoading(false);
    };

    return (
        <div>
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
                                        marginBottom: margin,
                                    }}
                                >
                                    Category Logo*
                                </FormHelperText>
                                <ImageUploader accept={'image/png'} onChange={handleNewCategoryLogoChange} />
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
                                        marginBottom: margin,
                                    }}
                                >
                                    Category Name*
                                </FormHelperText>
                                <TextField
                                    variant="outlined"
                                    value={newCategoryName}
                                    className={classes.textFieldStyle}
                                    onChange={handleNewCategoryNameChange}
                                    placeholder={'Enter Category Name'}
                                    fullWidth
                                    error={errorMessage !== ''}
                                    helperText={errorMessage ?? null}
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
                            disabled={!showSaveButton || isLoading}
                        >
                            {isLoading ? <CircularProgress color={'primary'} /> : 'Save'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
export default ManageCardDialogCreateCategoryContent;
