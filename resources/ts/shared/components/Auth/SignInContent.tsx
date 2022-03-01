import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { useCallback, useMemo } from 'react';
import { SignInValidationRules } from '@shared/components/Auth/validation';
import { FormInput } from '@shared/components/Auth/FormInput';
import { SubmitButton } from '@shared/components/Auth/SubmitButton';
import { ActionContent, FormRoot } from '@shared/components/Auth/styles';
import { NotificationsService } from '@shared/services/NotificationsService';
import { AuthenticationEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { app } from '@shared/lib/app';
import ReactGA from 'react-ga';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { isException } from '@shared/lib/errors/isException';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import {
    dialogVisibility,
    headerDialogVisibility,
    authenticateCheckAction,
} from '@shared/redux/slices/authenticationSlice';

interface Props {
    onContentChange: (isLogin: boolean) => void;
    subTitle: string;
}

export function SignInContent(props: Props) {
    const { onContentChange, subTitle } = props;
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);
    const dispatch = useSharedDispatch();
    const initialState = useMemo<LoginRequestDto>(
        () => ({
            email: '',
            password: '',
        }),
        [],
    );

    const handleChange = useCallback(() => {
        onContentChange(false);
    }, [onContentChange]);

    const handleSubmit = useCallback(
        async (values: LoginRequestDto) => {
            try {
                const authenticatedUser = await authenticationRepository.postLogin({
                    email: values.email,
                    password: values.password,
                });
                NotificationsService.success('Login successfully!');
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.loggedIn });
                pushToDataLayer({ event: 'google-ads-authenticated' });
                await authenticationService.setAccessToken(authenticatedUser.accessToken);
                dispatch(authenticateCheckAction());
                if (subTitle === 'to start a Robograding submission') {
                    window.location.href = '/dashboard/submissions/new';
                }
                dispatch(headerDialogVisibility(false));
            } catch (e: any) {
                if (isAxiosError(e) || isException(e)) {
                    ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });
                    NotificationsService.exception(e);
                    dispatch(dialogVisibility(false));
                    dispatch(headerDialogVisibility(false));
                } else {
                    ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.failedLogIn });
                    NotificationsService.error('Unable to login.');
                    dispatch(dialogVisibility(false));
                    dispatch(headerDialogVisibility(false));
                }
            }
        },
        [authenticationService, authenticationRepository, subTitle, dispatch],
    );

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
                    <MuiLink
                        onClick={handleChange}
                        fontWeight={500}
                        align={'center'}
                        color={'primary'}
                        underline={'none'}
                        sx={{ cursor: 'pointer' }}
                    >
                        SIGN UP
                    </MuiLink>
                </ActionContent>
            </Form>
        </Formik>
    );
}
