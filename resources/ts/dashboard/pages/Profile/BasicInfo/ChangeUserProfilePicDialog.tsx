import { Dialog, DialogActions, DialogContent } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useCallback, useState } from 'react';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import RobogradingAvatar from '@shared/assets/dummyAvatar.svg';
import makeStyles from '@mui/styles/makeStyles';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import ButtonBase from '@mui/material/ButtonBase';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ImageUploader from '@shared/components/ImageUploader';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

interface ChangeUserProfilePicDialogProps {
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

export function ChangeUserProfilePicDialog(props: ChangeUserProfilePicDialogProps) {
    const { toggle, show } = props;
    const classes = useStyles();

    const user$ = useSharedSelector((state) => state.authentication.user);
    const [viewMode, setViewMode] = useState<ViewModes>(
        user$?.profileImage ? ViewModes.hasProfilePic : ViewModes.noProfilePic,
    );
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);

    const handleClose = useCallback(() => {
        setViewMode(user$?.profileImage ? ViewModes.hasProfilePic : ViewModes.noProfilePic);
        toggle();
    }, [toggle]);

    const handleAddProfilePicPress = () => {
        setViewMode(ViewModes.uploadProfilePic);
    };

    const handleBackPress = () => {
        if (viewMode === ViewModes.uploadProfilePic) {
            setViewMode(ViewModes.noProfilePic);
        } else if (viewMode === ViewModes.previewProfilePic) {
            setViewMode(ViewModes.uploadProfilePic);
        }
    };

    const handleProfilePicUpload = useCallback(
        (file: File | null) => {
            setUploadedImage(file);
            setViewMode(ViewModes.previewProfilePic);
        },
        [uploadedImage, viewMode],
    );

    const handleSaveProfilePic = useCallback(() => {
        // dispatch action to upload image to backend
        setViewMode(ViewModes.hasProfilePic);
    }, [uploadedImage, viewMode]);

    const handleDeleteProfilePic = useCallback(() => {
        setViewMode(ViewModes.noProfilePic);
    }, [viewMode]);

    const handleEditProfilePic = useCallback(() => {
        setViewMode(ViewModes.uploadProfilePic);
    }, [viewMode]);

    if (viewMode === ViewModes.hasProfilePic) {
        if (!uploadedImage) {
            return null;
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
                        <img
                            src={URL.createObjectURL(uploadedImage)}
                            alt="Profile Avatar"
                            className={classes.profilePicture}
                        />
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
                    <Button onClick={handleSaveProfilePic} variant={'contained'}>
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
