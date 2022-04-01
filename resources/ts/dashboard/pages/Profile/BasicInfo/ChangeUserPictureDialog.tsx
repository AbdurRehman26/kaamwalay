import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import ImageUploader from '@shared/components/ImageUploader';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useRepository } from '@shared/hooks/useRepository';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import { updateUserProfile } from '@shared/redux/slices/userSlice';
import { FilesRepository } from '@shared/repositories/FilesRepository';
import { ConfirmUserPasswordDialog } from '@dashboard/pages/Profile/BasicInfo/ConfirmUserPasswordDialog';

interface ChangeUserPictureDialogProps {
    show: boolean;
    toggle: () => void;
}

enum ViewModes {
    noProfilePic,
    uploadProfilePic,
    previewProfilePic,
    hasProfilePic,
}

const useStyles = makeStyles(() => {
    return {
        defaultAvatar: {
            width: '292px',
            height: '292px',
        },
        profilePicture: {
            width: '292px',
            height: '292px',
            objectFit: 'cover',
            borderRadius: '146px', // 146px = 292px / 2
        },
        profilePicLabel: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '24px',
            lineHeight: '24px',
            marginTop: '24px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        profilePicDescription: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.54)',
            marginTop: '8px',
        },
        dialogTitle: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: '20px',
            textAlign: 'center',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginLeft: '12px',
        },
    };
});

export function ChangeUserPictureDialog(props: ChangeUserPictureDialogProps) {
    const { toggle, show } = props;
    const classes = useStyles();

    const dispatch = useSharedDispatch();
    const filesRepository = useRepository(FilesRepository);
    const notifications = useNotifications();
    const userProfileImage = useSharedSelector((state) => state.authentication.user?.profileImage);
    const [viewMode, setViewMode] = useState<ViewModes>(
        userProfileImage ? ViewModes.hasProfilePic : ViewModes.noProfilePic,
    );
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [showAskForPasswordDialog, setShowAskForPasswordDialog] = useState<boolean>(false);
    const [passwordConfirmCallback, setPasswordConfirmCallback] = useState<any>(() => {});

    const toggleAskForPasswordDialog = useCallback(() => {
        setShowAskForPasswordDialog((prev) => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setViewMode(userProfileImage ? ViewModes.hasProfilePic : ViewModes.noProfilePic);
        toggle();
    }, [toggle, userProfileImage]);

    const handleAddProfilePicPress = () => {
        setViewMode(ViewModes.uploadProfilePic);
    };

    const handleBackPress = () => {
        if (viewMode === ViewModes.uploadProfilePic) {
            if (userProfileImage) {
                setViewMode(ViewModes.hasProfilePic);
            } else {
                setViewMode(ViewModes.noProfilePic);
            }
        } else if (viewMode === ViewModes.previewProfilePic) {
            setViewMode(ViewModes.uploadProfilePic);
        }
    };

    const handleProfilePicUpload = useCallback((file: File | null) => {
        setUploadedImage(file);
        setViewMode(ViewModes.previewProfilePic);
    }, []);

    const handleSaveProfilePic = useCallback(async () => {
        try {
            setIsUploading(true);
            const imageUrl = await filesRepository.uploadFile(uploadedImage!);
            const result: any = await dispatch(
                updateUserProfile({
                    profileImage: imageUrl,
                }),
            );
            if (result?.payload?.response?.status === 400) {
                setShowAskForPasswordDialog(true);
                setPasswordConfirmCallback(() => async () => {
                    await dispatch(
                        updateUserProfile({
                            profileImage: imageUrl,
                        }),
                    );
                    setViewMode(ViewModes.hasProfilePic);
                });
            }

            if (!result?.error) {
                setViewMode(ViewModes.hasProfilePic);
            }

            setIsUploading(false);
        } catch (e: any) {
            notifications.exception(e);
            setIsUploading(false);
        }
    }, [filesRepository, uploadedImage, dispatch, notifications]);

    const handleDeleteProfilePic = useCallback(async () => {
        try {
            await dispatch(
                updateUserProfile({
                    profileImage: '',
                }),
            );
            setViewMode(ViewModes.noProfilePic);
        } catch (e: any) {
            notifications.exception(e);
        }
    }, [dispatch, notifications]);

    const handleEditProfilePic = useCallback(() => {
        setViewMode(ViewModes.uploadProfilePic);
    }, []);

    useEffect(() => {
        setViewMode(userProfileImage ? ViewModes.hasProfilePic : ViewModes.noProfilePic);
    }, [dispatch, userProfileImage]);

    if (viewMode === ViewModes.hasProfilePic) {
        return (
            <Dialog open={show} onClose={handleClose} fullWidth maxWidth={'sm'}>
                <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} padding={'16px'}>
                    <ButtonBase onClick={handleClose}>
                        <CloseOutlinedIcon />
                    </ButtonBase>
                </Box>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <img src={userProfileImage} alt="Profile Avatar" className={classes.profilePicture} />
                        <Typography variant={'h2'} className={classes.profilePicLabel}>
                            Profile Picture
                        </Typography>
                        <Typography variant={'h4'} className={classes.profilePicDescription}>
                            Personalize your account with a photo
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{ padding: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                    <Button
                        onClick={handleDeleteProfilePic}
                        fullWidth
                        startIcon={<DeleteOutlinedIcon />}
                        variant={'outlined'}
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={handleEditProfilePic}
                        fullWidth
                        startIcon={<ModeEditOutlineOutlinedIcon />}
                        variant={'contained'}
                    >
                        Change
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (viewMode === ViewModes.previewProfilePic) {
        if (!uploadedImage) {
            return null;
        }
        return (
            <Dialog open={show} onClose={handleClose} fullWidth maxWidth={'sm'}>
                <ConfirmUserPasswordDialog
                    open={showAskForPasswordDialog}
                    onClose={toggleAskForPasswordDialog}
                    afterSaveCallback={passwordConfirmCallback}
                />
                <Box
                    width={'100%'}
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    padding={'16px'}
                >
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <ButtonBase onClick={handleBackPress}>
                            <ArrowBackOutlinedIcon />
                        </ButtonBase>
                        <Typography className={classes.dialogTitle}>Upload Profile Photo</Typography>
                    </Box>
                    <ButtonBase onClick={handleClose}>
                        <CloseOutlinedIcon />
                    </ButtonBase>
                </Box>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <img
                            src={URL.createObjectURL(uploadedImage)}
                            alt="Preview profile avatar"
                            className={classes.profilePicture}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: '16px' }}>
                    <Button onClick={handleClose} variant="text">
                        Close
                    </Button>
                    <Button
                        onClick={handleSaveProfilePic}
                        startIcon={isUploading ? <CircularProgress color={'primary'} /> : null}
                        disabled={isUploading}
                        variant={'contained'}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    if (viewMode === ViewModes.uploadProfilePic) {
        return (
            <Dialog open={show} onClose={handleClose} fullWidth maxWidth={'sm'}>
                <Box
                    width={'100%'}
                    display={'flex'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    padding={'16px'}
                >
                    <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                        <ButtonBase onClick={handleBackPress}>
                            <ArrowBackOutlinedIcon />
                        </ButtonBase>
                        <Typography className={classes.dialogTitle}>Upload Profile Photo</Typography>
                    </Box>
                    <ButtonBase onClick={toggle}>
                        <CloseOutlinedIcon />
                    </ButtonBase>
                </Box>
                <DialogContent>
                    <ImageUploader onChange={handleProfilePicUpload} profilePicMode />
                </DialogContent>
                <DialogActions sx={{ padding: '16px' }}>
                    <Button onClick={handleClose} variant="text">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={show} onClose={handleClose} fullWidth maxWidth={'sm'}>
            <Box width={'100%'} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} padding={'16px'}>
                <ButtonBase onClick={handleClose}>
                    <CloseOutlinedIcon />
                </ButtonBase>
            </Box>
            <DialogContent>
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <img src={RobogradingAvatar} alt={'Existing profile avatar'} className={classes.defaultAvatar} />
                    <Typography variant={'h2'} className={classes.profilePicLabel}>
                        Profile Picture
                    </Typography>
                    <Typography variant={'h4'} className={classes.profilePicDescription}>
                        Personalize your account with a photo
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px' }}>
                <Button
                    onClick={handleAddProfilePicPress}
                    startIcon={<AddAPhotoOutlinedIcon />}
                    variant={'contained'}
                    fullWidth
                >
                    Add Profile Photo
                </Button>
            </DialogActions>
        </Dialog>
    );
}
