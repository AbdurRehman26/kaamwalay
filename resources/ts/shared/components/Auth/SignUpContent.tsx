import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import ReactGA from 'react-ga';
import { FormInput } from '@shared/components/Auth/FormInput';
import { SubmitButton } from '@shared/components/Auth/SubmitButton';
import { ActionContent, FormRoot } from '@shared/components/Auth/styles';
import { PopupSignUpValidationRules } from '@shared/components/Auth/validation';
import { FacebookPixelEvents } from '@shared/constants/FacebookPixelEvents';
import { AuthenticationEvents, EventCategories } from '@shared/constants/GAEventsTypes';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { app } from '@shared/lib/app';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import { trackFacebookPixelEvent } from '@shared/lib/utils/trackFacebookPixelEvent';
import {
    authenticateCheckAction,
    dialogVisibility,
    headerDialogVisibility,
} from '@shared/redux/slices/authenticationSlice';
import { AuthenticationRepository } from '@shared/repositories/AuthenticationRepository';
import { AuthenticationService } from '@shared/services/AuthenticationService';
import { NotificationsService } from '@shared/services/NotificationsService';

interface Props {
    onContentChange: (isLogin: boolean) => void;
    subTitle: string;
}

export function SignUpContent(props: Props) {
    const { onContentChange, subTitle } = props;
    const authenticationService = app(AuthenticationService);
    const authenticationRepository = app(AuthenticationRepository);
    const dispatch = useSharedDispatch();
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

    const handleChange = useCallback(() => {
        onContentChange(true);
    }, [onContentChange]);

    const handleSubmit = useCallback(
        async (values: SignUpRequestDto) => {
            values = { ...values, passwordConfirmation: values.password };
            try {
                const authenticatedUser = await authenticationRepository.postRegister(values);
                NotificationsService.success('Register successfully!');
                ReactGA.event({ category: EventCategories.Auth, action: AuthenticationEvents.registerSuccess });
                pushToDataLayer({ event: 'google-ads-authenticated' });
                await authenticationService.setAccessToken(authenticatedUser.accessToken);
                trackFacebookPixelEvent(FacebookPixelEvents.CompleteRegistration);
                dispatch(authenticateCheckAction());
                if (subTitle === 'to start a Robograding submission') {
                    window.location.href = '/dashboard/submissions/new';
                }
                dispatch(headerDialogVisibility(false));
            } catch (e: any) {
                NotificationsService.exception(e);
                dispatch(dialogVisibility(false));
                dispatch(headerDialogVisibility(false));
            }
        },
        [authenticationService, authenticationRepository, dispatch, subTitle],
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
                    <MuiLink
                        onClick={handleChange}
                        fontWeight={500}
                        align={'center'}
                        color={'primary'}
                        underline={'none'}
                        sx={{ cursor: 'pointer' }}
                    >
                        LOG IN
                    </MuiLink>
                </ActionContent>
            </Form>
        </Formik>
    );
}
