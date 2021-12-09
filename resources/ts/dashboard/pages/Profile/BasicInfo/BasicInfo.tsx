import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Divider from '@mui/material/Divider';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { BasicInfoRow } from '@dashboard/pages/Profile/BasicInfo/BasicInfoRow';
import Box from '@mui/material/Box';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { updateUserPassword, updateUserProfile } from '@shared/redux/slices/userSlice';
import { useAuth } from '@shared/hooks/useAuth';
import { ChangeUserPictureDialog } from '@dashboard/pages/Profile/BasicInfo/ChangeUserPictureDialog';
import { ConfirmUserPasswordDialog } from '@dashboard/pages/Profile/BasicInfo/ConfirmUserPasswordDialog';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        width: '100%',
        marginTop: '0px',
        marginBottom: 25,
    },
    editInputsContainer: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F9F9F9',
    },
    headingLabel: {
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '32px',
        lineHeight: '44px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    subHeadingLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
        marginBottom: 20,
    },
    textLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    valueLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    emptyStateContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    table: {
        minWidth: '100%',
        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
            borderBottom: 'none',
        },
    },
    textField: {
        marginTop: '16px',
        width: '300px',
    },
    divider: {
        width: '100%',
        margin: theme.spacing(2.5, 0, 2.5),
    },
    subscriptionCheckBtn: {
        marginTop: 5,
        paddingLeft: 0,
        paddingTop: 10,
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'right',
        marginTop: '40px',
        marginBottom: '64px',
    },
    saveBtn: {
        color: '#fff',
        width: '140px',
        height: '48px',
    },
    cancelBtn: {
        marginRight: '12px',
        color: '#20BFB8',
    },
}));

const CustomTextField = withStyles({
    root: {
        backgroundColor: '#fff',
    },
    checked: {},
})((props: TextFieldProps) => <TextField {...props} />);

const HTTP_AGS_UNAUTHORIZED = 400;

export function BasicInfo() {
    const classes = useStyles();
    const user$ = useAuth().user;
    const dispatch = useSharedDispatch();

    const [showName, setShowName] = useState<boolean>(false);
    const [showUserName, setShowUserName] = useState<boolean>(false);
    const [showPhone, setShowPhone] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showProfilePicDialog, setShowProfilePicDialog] = useState<boolean>(false);

    const [newFirstName, setNewFirstName] = useState<string>(user$?.firstName || '');
    const [newLastName, setNewLastName] = useState<string>(user$?.lastName || '');
    const [isNewNameSaveDisabled, setIsNewNameSaveDisabled] = useState<boolean>(false);

    const [newUserName, setNewUserName] = useState<string>(user$?.username || '');
    const [isNewUserNameSaveDisabled, setIsNewUserNameSaveDisabled] = useState<boolean>(false);

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isPasswordSaveDisabled, setIsPasswordSaveDisabled] = useState<boolean>(false);

    const [newPhone, setNewPhone] = useState<string>(user$?.phone || '');
    const [isNewPhoneSaveDisabled, setIsNewPhoneSaveDisabled] = useState<boolean>(false);

    const [showAskForPasswordDialog, setShowAskForPasswordDialog] = useState<boolean>(false);
    const [passwordConfirmCallback, setPasswordConfirmCallback] = useState<any>(() => {});

    const toggleAskForPasswordDialog = useCallback(() => {
        setShowAskForPasswordDialog((prev) => !prev);
    }, [showAskForPasswordDialog]);

    const hideRows = () => {
        setShowName(false);
        setShowUserName(false);
        setShowPhone(false);
        setShowPassword(false);
    };

    const onToggleProfilePicDialog = useCallback(() => {
        setShowProfilePicDialog((prev) => !prev);
    }, [showProfilePicDialog]);

    const onPhoneChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setNewPhone(event.target.value);
        },
        [setNewPhone],
    );

    const onCurrentPasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentPassword(e.target.value);
        },
        [currentPassword],
    );

    const onNewPasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewPassword(e.target.value);
        },
        [newPassword],
    );

    const onConfirmPasswordChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setConfirmPassword(e.target.value);
        },
        [confirmPassword],
    );

    const onNewUserNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewUserName(e.target.value);
        },
        [newUserName],
    );

    const onNewFirstNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewFirstName(e.target.value);
        },
        [newFirstName],
    );

    const onNewLastNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewLastName(e.target.value);
        },
        [newLastName],
    );

    const handleOnNameEdit = useCallback(() => {
        toggleExceptFor('name');
    }, [showName]);

    const handleOnUserNameEdit = useCallback(() => {
        toggleExceptFor('userName');
    }, [showUserName]);

    const handleOnPhoneEdit = useCallback(() => {
        toggleExceptFor('phone');
    }, [showPhone]);

    const handleOnPasswordEdit = useCallback(() => {
        toggleExceptFor('password');
    }, [showPassword]);

    function toggleExceptFor(field: string) {
        switch (field) {
            case 'name':
                setShowName((prev) => !prev);
                setNewFirstName(user$?.firstName || '');
                setNewLastName(user$?.lastName || '');
                setShowUserName(false);
                setShowPhone(false);
                setShowPassword(false);
                break;
            case 'userName':
                setShowName(false);
                setShowUserName((prev) => !prev);
                setNewUserName(user$?.username || '');
                setShowPhone(false);
                setShowPassword(false);
                break;
            case 'phone':
                setShowName(false);
                setShowUserName(false);
                setShowPhone((prev) => !prev);
                setNewPhone(user$?.phone || '');
                setShowPassword(false);
                break;
            case 'password':
                setShowName(false);
                setShowUserName(false);
                setShowPhone(false);
                setShowPassword((prev) => !prev);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (newFirstName.length > 0 && newLastName.length > 0) {
            setIsNewNameSaveDisabled(false);
        } else {
            setIsNewNameSaveDisabled(true);
        }
    }, [newFirstName, newLastName]);

    useEffect(() => {
        if (newUserName.length > 4) {
            setIsNewUserNameSaveDisabled(false);
        } else {
            setIsNewUserNameSaveDisabled(true);
        }
    }, [newUserName]);

    useEffect(() => {
        if (newPassword.length > 0 && confirmPassword.length > 0 && currentPassword.length > 0) {
            if (newPassword === confirmPassword) {
                setIsPasswordSaveDisabled(false);
            } else {
                setIsPasswordSaveDisabled(true);
            }
        } else {
            setIsPasswordSaveDisabled(true);
        }
    }, [newPassword, confirmPassword, currentPassword]);

    useEffect(() => {
        if (newPhone.length > 1) {
            setIsNewPhoneSaveDisabled(false);
        } else {
            setIsNewPhoneSaveDisabled(true);
        }
    }, [newPhone]);

    const onNewNameSave = useCallback(async () => {
        const result: any = await dispatch(
            updateUserProfile({
                firstName: newFirstName,
                lastName: newLastName,
            }),
        );
        hideRows();
        if (result?.payload?.response?.status === HTTP_AGS_UNAUTHORIZED) {
            setShowAskForPasswordDialog(true);
            setPasswordConfirmCallback(() => async () => {
                await dispatch(
                    updateUserProfile({
                        firstName: newFirstName,
                        lastName: newLastName,
                    }),
                );
            });
        }
    }, [newFirstName, newLastName, user$?.firstName, user$?.lastName]);

    const onNewUserNameSave = useCallback(async () => {
        const result: any = await dispatch(
            updateUserProfile({
                username: newUserName,
            }),
        );
        hideRows();
        if (result?.payload?.response?.status === HTTP_AGS_UNAUTHORIZED) {
            setShowAskForPasswordDialog(true);
            setPasswordConfirmCallback(() => async () => {
                await dispatch(
                    updateUserProfile({
                        username: newUserName,
                    }),
                );
            });
        }
    }, [newUserName, user$?.username]);

    const onNewPhoneSave = useCallback(async () => {
        const result: any = await dispatch(
            updateUserProfile({
                phone: newPhone,
            }),
        );
        if (result?.payload?.response?.status === HTTP_AGS_UNAUTHORIZED) {
            setShowAskForPasswordDialog(true);
            setPasswordConfirmCallback(() => async () => {
                await dispatch(
                    updateUserProfile({
                        phone: newPhone,
                    }),
                );
            });
        }
        hideRows();
    }, [newPhone, user$?.phone]);

    const onNewPasswordSave = useCallback(async () => {
        await dispatch(
            updateUserPassword({
                currentPassword,
                password: newPassword,
                passwordConfirmation: confirmPassword,
            }),
        );
        hideRows();
    }, [newPassword, currentPassword, confirmPassword]);

    return (
        <>
            <ConfirmUserPasswordDialog
                open={showAskForPasswordDialog}
                onClose={toggleAskForPasswordDialog}
                afterSaveCallback={passwordConfirmCallback}
            />
            <ChangeUserPictureDialog show={showProfilePicDialog} toggle={onToggleProfilePicDialog} />
            <Typography variant={'h1'} className={classes.headingLabel}>
                Profile
            </Typography>

            <Divider className={classes.divider} />

            <Paper className={classes.mainContainer} variant={'outlined'}>
                <Box paddingLeft={'16px'} paddingTop={'24px'}>
                    <Typography variant={'h1'} className={classes.subHeadingLabel}>
                        Basic Info
                    </Typography>
                </Box>

                <BasicInfoRow
                    label={'photo'}
                    value={'Personalize your account with a photo'}
                    shown={false}
                    showProfilePic
                    onProfilePicPress={onToggleProfilePicDialog}
                />
                <BasicInfoRow
                    label={'Name'}
                    value={user$?.firstName + ' ' + user$?.lastName}
                    shown={showName}
                    onSave={onNewNameSave}
                    onEdit={handleOnNameEdit}
                    isSaveBtnDisabled={isNewNameSaveDisabled}
                    onCancel={handleOnNameEdit}
                >
                    <div className={classes.editInputsContainer}>
                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                            Name
                        </Typography>

                        <CustomTextField
                            label="Enter first name"
                            rows={1}
                            value={newFirstName}
                            onChange={onNewFirstNameChange}
                            className={classes.textField}
                            fullWidth
                        />
                        <CustomTextField
                            label="Enter last name"
                            rows={1}
                            value={newLastName}
                            onChange={onNewLastNameChange}
                            className={classes.textField}
                            fullWidth
                        />
                    </div>
                </BasicInfoRow>
                <BasicInfoRow
                    label={'username'}
                    value={user$?.username || '-'}
                    shown={showUserName}
                    onSave={onNewUserNameSave}
                    onEdit={handleOnUserNameEdit}
                    onCancel={handleOnUserNameEdit}
                    isSaveBtnDisabled={isNewUserNameSaveDisabled}
                >
                    <div className={classes.editInputsContainer}>
                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                            Username
                        </Typography>

                        <CustomTextField
                            label="Enter Username "
                            value={newUserName}
                            onChange={onNewUserNameChange}
                            rows={1}
                            className={classes.textField}
                            fullWidth
                        />
                    </div>
                </BasicInfoRow>
                <BasicInfoRow
                    label={'password'}
                    value={'********'}
                    shown={showPassword}
                    onSave={onNewPasswordSave}
                    onEdit={handleOnPasswordEdit}
                    onCancel={handleOnPasswordEdit}
                    isSaveBtnDisabled={isPasswordSaveDisabled}
                >
                    <div className={classes.editInputsContainer}>
                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                            Change Password
                        </Typography>

                        <CustomTextField
                            label="Enter Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={onCurrentPasswordChange}
                            rows={1}
                            className={classes.textField}
                            fullWidth
                        />
                        <CustomTextField
                            label="Enter New Password"
                            type="password"
                            rows={10}
                            value={newPassword}
                            onChange={onNewPasswordChange}
                            className={classes.textField}
                            fullWidth
                        />
                        <CustomTextField
                            label="Confirm New Password"
                            type="password"
                            rows={1}
                            value={confirmPassword}
                            onChange={onConfirmPasswordChange}
                            className={classes.textField}
                            fullWidth
                        />
                    </div>
                </BasicInfoRow>
                <BasicInfoRow label={'customer id'} value={user$?.customerNumber || '-'} shown={false} hideDivider />
            </Paper>

            <Paper className={classes.mainContainer} variant={'outlined'}>
                <Box paddingLeft={'16px'} paddingTop={'24px'}>
                    <Typography variant={'h1'} className={classes.subHeadingLabel}>
                        Contact Info
                    </Typography>
                </Box>
                <div className={classes.emptyStateContainer}>
                    <BasicInfoRow label={'Email'} value={user$?.email || '-'} shown={false} />

                    <BasicInfoRow
                        label={'Phone'}
                        value={user$?.phone || '-'}
                        shown={showPhone}
                        onSave={onNewPhoneSave}
                        onEdit={handleOnPhoneEdit}
                        onCancel={handleOnPhoneEdit}
                        hideDivider
                        isSaveBtnDisabled={isNewPhoneSaveDisabled}
                    >
                        <div className={classes.editInputsContainer}>
                            <Typography variant={'subtitle1'} className={classes.valueLabel}>
                                Change Phone Number
                            </Typography>

                            <CustomTextField
                                label="Confirm New Phone Number"
                                rows={1}
                                value={newPhone}
                                onChange={onPhoneChange}
                                className={classes.textField}
                                fullWidth
                            />
                        </div>
                    </BasicInfoRow>
                </div>
            </Paper>
        </>
    );
}

export default BasicInfo;
