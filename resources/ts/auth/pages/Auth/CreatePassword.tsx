import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '@shared/assets/dummyAvatar.svg';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import { SubmitButton } from '@shared/components/AuthDialog/SubmitButton';
import { useStyles } from '@shared/components/AuthDialog/styles';
import { ResetPasswordValidationRules } from '@shared/components/AuthDialog/validation';
import { ResetPasswordRequestDto } from '@shared/dto/ResetPasswordRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { font } from '@shared/styles/utils';
import { LayoutHeader } from '@auth/components/LayoutHeader';

export function CreatePassword() {
    const [{ token, email }] = useLocationQuery<{ token: string; email: string }>();
    const notifications = useNotifications();
    const navigate = useNavigate();
    const classes = useStyles();
    const { resetPassword } = useAuth();
    const initialState = useMemo<ResetPasswordRequestDto>(
        () => ({
            token,
            email,
            password: '',
            passwordConfirmation: '',
        }),
        [email, token],
    );

    const handleSubmit = useCallback(
        async (values: ResetPasswordRequestDto) => {
            const data = await resetPassword(values);
            const { error, payload } = data as any;
            if (error) {
                return;
            }

            if (payload?.message) {
                notifications.success(payload?.message);
            }

            navigate('/sign-in');
        },
        [navigate, notifications, resetPassword],
    );

    return (
        <>
            <LayoutHeader />
            <Formik
                initialValues={initialState}
                onSubmit={handleSubmit}
                validationSchema={ResetPasswordValidationRules}
                enableReinitialize
                validateOnChange
            >
                <Form className={classes.root}>
                    <Grid container direction={'column'} className={classes.content}>
                        <Box
                            marginTop={15}
                            marginBottom={4}
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                        >
                            <Avatar sx={{ marginBottom: 2, width: '64px', height: '64px' }} src={UserAvatar} />
                            <Typography marginBottom={2} fontWeight={300} variant={'h4'} align={'center'}>
                                Welcome, <span className={font.fontWeightBold}>Jim</span>
                            </Typography>
                            <Typography variant={'body1'} align={'center'}>
                                An AGS rep has created your Robograding account.
                            </Typography>
                            <Typography variant={'body1'} align={'center'}>
                                Simply <span className={font.fontWeightBold}>create a password</span> to access it.
                            </Typography>
                        </Box>

                        <FormInput type={'password'} label={'Create Password'} name={'password'} />
                        <FormInput type={'password'} label={'Confirm Password'} name={'passwordConfirmation'} />

                        <SubmitButton>Access Account</SubmitButton>
                    </Grid>
                </Form>
            </Formik>
        </>
    );
}

export default CreatePassword;
