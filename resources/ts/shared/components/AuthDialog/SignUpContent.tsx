import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import ReactGA from 'react-ga';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import { SubmitButton } from '@shared/components/AuthDialog/SubmitButton';
import { ActionContent, FormRoot } from '@shared/components/AuthDialog/styles';
import { PopupSignUpValidationRules } from '@shared/components/AuthDialog/validation';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { AuthenticationEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { NotificationsService } from '@shared/services/NotificationsService';
import { useInjectable } from '../../hooks/useInjectable';
import { AuthDialogContentProps } from './AuthDialogContentProps';
import { AuthDialogView } from './AuthDialogView';

export function SignUpContent({ onViewChange, onAuthSuccess }: AuthDialogContentProps) {
    const authenticationRepository = useInjectable(AuthenticationRepository);
    const initialState = useMemo<SignUpRequestDto>(
        () => ({
            fullName: '',
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        }),
        [],
    );

    const handleSignInClick = useCallback(() => onViewChange(AuthDialogView.SignIn), [onViewChange]);

    const handleSubmit = useCallback(
        async (values: SignUpRequestDto) => {
            values = { ...values, passwordConfirmation: values.password };
            try {
                const authenticatedUser = await authenticationRepository.postRegister(values);
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.registerSuccess });
                trackFacebookPixelEvent(FacebookPixelEvents.CompleteRegistration);
                NotificationsService.success('Register successfully!');
                onAuthSuccess(authenticatedUser);
            } catch (e: any) {
                NotificationsService.exception(e);
            }
        },
        [authenticationRepository, onAuthSuccess],
    );

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={PopupSignUpValidationRules}
            validateOnChange
        >
            <Form>
                <Grid container marginTop={4} sx={{ padding: '24px 24px 0 24px' }}>
                    <FormRoot>
                        <FormInput type={'text'} label={'Full Name'} name={'fullName'} />
                    </FormRoot>

                    <FormRoot>
                        <FormInput type={'text'} label={'Create Username'} name={'username'} />
                    </FormRoot>

                    <FormRoot>
                        <FormInput type={'text'} label={'Email'} name={'email'} />
                    </FormRoot>

                    <FormRoot>
                        <FormInput type={'password'} label={'Create Password'} name={'password'} />
                    </FormRoot>

                    <FormRoot>
                        <SubmitButton isModal>Sign up</SubmitButton>
                    </FormRoot>
                </Grid>
                <Divider />
                <ActionContent>
                    <Typography align={'center'} variant={'caption'} marginRight={2}>
                        Already have an account?
                    </Typography>
                    <Button variant={'text'} onClick={handleSignInClick}>
                        Log In
                    </Button>
                </ActionContent>
            </Form>
        </Formik>
    );
}
