import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { useMemo } from 'react';
import { SignInValidationRules } from './validation';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { ActionContent, FormRoot } from './styles';
import { NotificationsService } from '@shared/services/NotificationsService';
import { AuthenticationEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { app } from '@shared/lib/app';
import ReactGA from 'react-ga';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { isException } from '@shared/lib/errors/isException';

interface Props {
    handleContentChange: (isLogin: boolean) => void;
}

export function SignInContent(props: Props) {
    const { handleContentChange } = props;
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);
    const initialState = useMemo<LoginRequestDto>(
        () => ({
            email: '',
            password: '',
        }),
        [],
    );

    const handleSubmit = async (values: LoginRequestDto) => {
        try {
            const authenticatedUser = await authenticationRepository.postLogin({
                email: values.email,
                password: values.password,
            });
            NotificationsService.success('Login successfully!');
            ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.loggedIn });
            pushToDataLayer({ event: 'google-ads-authenticated' });
            await authenticationService.setAccessToken(authenticatedUser.accessToken);
            window.location.href = '/dashboard/submissions/new';
        } catch (e: any) {
            if (isAxiosError(e) || isException(e)) {
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });
                NotificationsService.exception(e);
            } else {
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });
                NotificationsService.error('Unable to login.');
            }
        }
    };

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
                            onClick={() => {
                                window.location.href = '/password/forgot';
                            }}
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
                    <MuiLink
                        onClick={() => handleContentChange(false)}
                        fontWeight={500}
                        align={'center'}
                        color={'primary'}
                        underline={'hover'}
                    >
                        SIGN UP
                    </MuiLink>
                </ActionContent>
            </Form>
        </Formik>
    );
}
