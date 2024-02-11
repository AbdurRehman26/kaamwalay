import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Form, Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import { SubmitButton } from '@shared/components/AuthDialog/SubmitButton';
import { ActionContent, FormRoot } from '@shared/components/AuthDialog/styles';
import { PopupSignUpValidationRules } from '@shared/components/AuthDialog/validation';
import InternationalPhoneNumberField from '@shared/components/InternationalPhoneNumberField';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { useInjectable } from '../../hooks/useInjectable';
import { AuthDialogContentProps } from './AuthDialogContentProps';
import { AuthDialogView } from './AuthDialogView';

const useStyles = makeStyles(
    () => ({
        notificationsCheckbox: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        notificationsControlLabel: {
            marginBottom: '24px',
            alignItems: 'flex-start',
        },
        deactivatedText: {
            color: '#DD323B',
            fontSize: '15px',
            fontWeight: 'bolder',
        },
        phoneFieldContainer: {
            marginBottom: '24px',

            '& .special-label': {
                top: '5px !important',
                left: '18px !important',
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
            borderRadius: '28px !important',
            padding: '26px 14px 10px 68px !important',
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '14px !important',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',

            '&:focus': {
                borderColor: '#20BFB8 !important',
                boxShadow: 'none !important',
                backgroundColor: 'rgba(32,191,184,0.05)',
            },
        },
        phoneFieldFlagButton: {
            '& .selected-flag': {
                paddingLeft: '22px !important',

                '& .flag': {
                    top: '64% !important',
                },
            },
        },
        phoneFieldDropdown: {
            maxHeight: '240px !important',
            width: '390px !important',
        },
    }),
    { name: 'SignUpContent' },
);

export function SignUpContent({
    onViewChange,
    onAuthSuccess,
    fromReferralHome,
    referralCode,
    isDisabled = false,
}: AuthDialogContentProps) {
    const classes = useStyles();
    const [phone, setPhone] = useState('');

    const authenticationRepository = useInjectable(AuthenticationRepository);
    const initialState = useMemo<SignUpRequestDto>(
        () => ({
            fullName: '',
            email: '',
            phone: '',
            password: '',
            passwordConfirmation: '',
            isMarketingNotificationsEnabled: true,
            referralCode: '',
        }),
        [],
    );

    const handleSignInClick = useCallback(() => onViewChange(AuthDialogView.SignIn), [onViewChange]);
    const handleSubmit = useCallback(
        async (values: SignUpRequestDto) => {
            values = { ...values, passwordConfirmation: values.password, referralCode: referralCode, phone };

            try {
                const authenticatedUser = await authenticationRepository.postRegister(values);
                NotificationsService.success('Register successfully!');
                onAuthSuccess(authenticatedUser);
            } catch (e: any) {
                NotificationsService.exception(e);
            }
        },
        [authenticationRepository, onAuthSuccess, referralCode, phone],
    );

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={PopupSignUpValidationRules}
            validateOnChange
        >
            {({ values, handleChange }) => (
                <Form>
                    <Grid container marginTop={4} sx={{ padding: '24px 24px 0 24px' }}>
                        {isDisabled ? (
                            <Grid container justifyContent={'center'} mb={2}>
                                <Typography className={classes.deactivatedText}>
                                    Sign Up Deactivated. Looks like you are already signed in.
                                </Typography>
                            </Grid>
                        ) : null}
                        <FormRoot>
                            <FormInput type={'text'} label={'Full Name'} name={'fullName'} disabled={isDisabled} />
                        </FormRoot>

                        <FormRoot>
                            <FormInput type={'text'} label={'Email'} name={'email'} disabled={isDisabled} />
                        </FormRoot>

                        <FormRoot>
                            <InternationalPhoneNumberField
                                value={values.phone}
                                onChange={(value, data, event, formattedValue) => {
                                    handleChange(event);
                                    setPhone(formattedValue);
                                }}
                                containerClass={classes.phoneFieldContainer}
                                inputClass={classes.phoneFieldInput}
                                buttonClass={classes.phoneFieldFlagButton}
                                dropdownClass={classes.phoneFieldDropdown}
                                specialLabel={'Phone Number'}
                                disabled={isDisabled}
                                inputProps={{
                                    name: 'phone',
                                }}
                            />
                        </FormRoot>

                        <FormRoot>
                            <FormInput
                                type={'password'}
                                label={'Create Password'}
                                name={'password'}
                                disabled={isDisabled}
                            />
                        </FormRoot>

                        <FormRoot>
                            <FormControlLabel
                                name={'isMarketingNotificationsEnabled'}
                                control={
                                    <Checkbox
                                        checked={values.isMarketingNotificationsEnabled}
                                        onChange={handleChange}
                                        className={classes.notificationsCheckbox}
                                    />
                                }
                                label={'Opt in to receive updates & promotions from AGS via email and text.'}
                                className={classes.notificationsControlLabel}
                                disabled={isDisabled}
                            />
                        </FormRoot>

                        <FormRoot>
                            <SubmitButton isModal isDisabled={isDisabled}>
                                Sign up
                            </SubmitButton>
                        </FormRoot>
                    </Grid>
                    {fromReferralHome ? null : (
                        <>
                            <Divider />
                            <ActionContent>
                                <Typography align={'center'} variant={'caption'} marginRight={2}>
                                    Already have an account?
                                </Typography>
                                <Button variant={'text'} onClick={handleSignInClick}>
                                    Log In
                                </Button>
                            </ActionContent>
                        </>
                    )}
                </Form>
            )}
        </Formik>
    );
}
