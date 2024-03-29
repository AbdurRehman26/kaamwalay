import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import React, { useCallback, useEffect, useState } from 'react';
import InternationalPhoneNumberField from '@shared/components/InternationalPhoneNumberField';
import { useAuth } from '@shared/hooks/useAuth';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { toggleMarketingNotifications, updateUserPassword, updateUserProfile } from '@shared/redux/slices/userSlice';
import ReferralBanner from '@dashboard/pages/Referral/ReferralBanner';
import { BasicInfoRow } from './BasicInfoRow';
import { ChangeUserPictureDialog } from './ChangeUserPictureDialog';
import { ConfirmUserPasswordDialog } from './ConfirmUserPasswordDialog';
import { ProfileActions } from './ProfileActions';
import { SettingsSection } from './SettingsSection';

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
    marketingEnabledFormControl: {
        paddingLeft: 20,
        marginBottom: 26,
    },
    marketingEnabledFirstRadio: {
        marginRight: 52,
    },
    phoneFieldContainer: {
        '& .special-label': {
            top: '5px !important',
            left: '8px !important',
            backgroundColor: 'transparent !important',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '12px !important',
            lineHeight: '16px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.54)',
        },
    },
    phoneFieldInput: {
        width: '100% !important',
        border: '1px solid lightgray !important',
        borderRadius: '4px !important',
        padding: '26px 14px 10px 60px !important',
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',

        '&:focus': {
            border: '2px solid #20BFB8 !important',
            boxShadow: 'none !important',
        },
    },
    phoneFieldFlagButton: {
        '& .selected-flag': {
            '& .flag': {
                top: '64% !important',
            },
        },
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

    const [showPasswordText, setShowPasswordText] = useState(false);
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

    const [isMarketingNotificationsEnabled, setIsMarketingNotificationsEnabled] = useState<boolean>(
        user$.isMarketingNotificationsEnabled,
    );

    const toggleAskForPasswordDialog = useCallback(() => {
        setShowAskForPasswordDialog((prev) => !prev);
    }, []);

    const hideRows = () => {
        setShowName(false);
        setShowUserName(false);
        setShowPhone(false);
        setShowPassword(false);
    };

    const onToggleProfilePicDialog = useCallback(() => {
        setShowProfilePicDialog((prev) => !prev);
    }, []);

    const onToggleShowPasswordText = useCallback(() => {
        setShowPasswordText((prev) => !prev);
    }, []);

    const onCurrentPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(e.target.value);
    }, []);

    const onNewPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    }, []);

    const onConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }, []);

    const onNewUserNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUserName(e.target.value);
    }, []);

    const onNewFirstNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFirstName(e.target.value);
    }, []);

    const onNewLastNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewLastName(e.target.value);
    }, []);

    const toggleExceptFor = useCallback(
        (field: string) => {
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
        },
        [user$?.firstName, user$?.lastName, user$?.phone, user$?.username],
    );

    const handleOnNameEdit = useCallback(() => {
        toggleExceptFor('name');
    }, [toggleExceptFor]);

    const handleOnUserNameEdit = useCallback(() => {
        toggleExceptFor('userName');
    }, [toggleExceptFor]);

    const handleOnPhoneEdit = useCallback(() => {
        toggleExceptFor('phone');
    }, [toggleExceptFor]);

    const handleOnPasswordEdit = useCallback(() => {
        toggleExceptFor('password');
    }, [toggleExceptFor]);

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
    }, [dispatch, newFirstName, newLastName]);

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
    }, [dispatch, newUserName]);

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
    }, [dispatch, newPhone]);

    const onNewPasswordSave = useCallback(async () => {
        await dispatch(
            updateUserPassword({
                currentPassword,
                password: newPassword,
                passwordConfirmation: confirmPassword,
            }),
        );
        hideRows();
    }, [dispatch, currentPassword, newPassword, confirmPassword]);

    const handleMarketingNotificationsEnabledChange = useCallback(
        (e) => {
            setIsMarketingNotificationsEnabled(e.target.value);

            dispatch(
                toggleMarketingNotifications({
                    isMarketingNotificationsEnabled: e.target.value === 'true',
                }),
            );
        },
        [dispatch],
    );
    return (
        <>
            <ConfirmUserPasswordDialog
                open={showAskForPasswordDialog}
                onClose={toggleAskForPasswordDialog}
                afterSaveCallback={passwordConfirmCallback}
            />
            <ChangeUserPictureDialog show={showProfilePicDialog} toggle={onToggleProfilePicDialog} />
            {user$?.showReferralPromotionalPopup ? <ReferralBanner /> : null}
            <Typography variant={'h1'} className={classes.headingLabel}>
                Profile
            </Typography>

            <Divider className={classes.divider} />
            <SettingsSection headline={'Basic Info'}>
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
                            type={showPasswordText ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={onCurrentPasswordChange}
                            rows={1}
                            className={classes.textField}
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={onToggleShowPasswordText}
                                            edge="end"
                                        >
                                            {showPasswordText ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <CustomTextField
                            label="Enter New Password"
                            type={showPasswordText ? 'text' : 'password'}
                            rows={10}
                            value={newPassword}
                            onChange={onNewPasswordChange}
                            className={classes.textField}
                            fullWidth
                        />
                        <CustomTextField
                            label="Confirm New Password"
                            type={showPasswordText ? 'text' : 'password'}
                            rows={1}
                            value={confirmPassword}
                            onChange={onConfirmPasswordChange}
                            className={classes.textField}
                            fullWidth
                        />
                    </div>
                </BasicInfoRow>
                <BasicInfoRow label={'customer id'} value={user$?.customerNumber || '-'} shown={false} hideDivider />
            </SettingsSection>

            <SettingsSection headline={'Contact Info'}>
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

                        <InternationalPhoneNumberField
                            value={newPhone}
                            onChange={(value, data, event, formattedValue) => {
                                setNewPhone(formattedValue);
                            }}
                            specialLabel="Confirm New Phone Number"
                            containerClass={classes.phoneFieldContainer}
                            inputClass={classes.phoneFieldInput}
                            buttonClass={classes.phoneFieldFlagButton}
                        />
                    </div>
                </BasicInfoRow>
            </SettingsSection>
            <SettingsSection headline={'Text/Email Notifications'}>
                <Typography className={classes.valueLabel} pl={2.5} pb={2}>
                    Would you like to receive email/text updates & promotions from AGS?
                </Typography>
                <FormControl className={classes.marketingEnabledFormControl}>
                    <RadioGroup
                        row
                        name="isMarketingNotificationsEnabled"
                        value={isMarketingNotificationsEnabled}
                        onChange={handleMarketingNotificationsEnabledChange}
                    >
                        <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Yes"
                            className={classes.marketingEnabledFirstRadio}
                        />
                        <FormControlLabel value={false} control={<Radio />} label="No" />
                    </RadioGroup>
                </FormControl>
            </SettingsSection>
            <ProfileActions />
        </>
    );
}

export default BasicInfo;
