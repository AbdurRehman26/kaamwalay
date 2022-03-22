import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import ReactGA from 'react-ga';
import { AuthenticationEvents, EventCategories } from '../../constants/GAEventsTypes';
import { LoginRequestDto } from '../../dto/LoginRequestDto';
import { useInjectable } from '../../hooks/useInjectable';
import { isAxiosError } from '../../lib/api/isAxiosError';
import { isException } from '../../lib/errors/isException';
import { AuthenticationRepository } from '../../repositories/AuthenticationRepository';
import { NotificationsService } from '../../services/NotificationsService';
import { AuthDialogContentProps } from './AuthDialogContentProps';
import { AuthDialogView } from './AuthDialogView';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { ActionContent, FormRoot } from './styles';
import { SignInValidationRules } from './validation';

export function SignInContent({ onViewChange, onAuthSuccess }: AuthDialogContentProps) {
    const authenticationRepository = useInjectable(AuthenticationRepository);
    const initialState = useMemo<LoginRequestDto>(
        () => ({
            email: '',
            password: '',
        }),
        [],
    );

    const handleSubmit = useCallback(
        async (values: LoginRequestDto) => {
            try {
                const authenticatedUser = await authenticationRepository.postLogin({
                    email: values.email,
                    password: values.password,
                });
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.loggedIn });
                onAuthSuccess(authenticatedUser);
            } catch (e: any) {
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });

                if (isAxiosError(e) || isException(e)) {
                    NotificationsService.exception(e);
                } else {
                    NotificationsService.error('Unable to login.');
                }
            }
        },
        [authenticationRepository, onAuthSuccess],
    );

    const handleSignUpClick = useCallback(() => onViewChange(AuthDialogView.SignUp), [onViewChange]);

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={SignInValidationRules}
            validateOnChange
        >
            <Form>
                <Grid container marginTop={4} padding={'24px'}>
                    <FormRoot>
                        <FormInput type={'email'} label={'Email'} name={'email'} />
                    </FormRoot>

                    <FormRoot>
                        <FormInput type={'password'} label={'Password'} name={'password'} />
                    </FormRoot>

                    <FormRoot>
                        <SubmitButton isModal>Log in</SubmitButton>
                    </FormRoot>

                    <Box display={'flex'} width={'100%'} justifyContent={'center'}>
                        <MuiLink
                            href={'/auth/password/forgot'}
                            variant={'caption'}
                            color={'textPrimary'}
                            align={'center'}
                            fontWeight={500}
                            underline={'hover'}
                        >
                            Forgot Password?
                        </MuiLink>
                    </Box>
                </Grid>
                <Divider />
                <ActionContent>
                    <Typography variant={'caption'} marginRight={2}>
                        New to AGS?
                    </Typography>
                    <Button variant={'text'} onClick={handleSignUpClick}>
                        Sign Up
                    </Button>
                </ActionContent>
            </Form>
        </Formik>
    );
}
