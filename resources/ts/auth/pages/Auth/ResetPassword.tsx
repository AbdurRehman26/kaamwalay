import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import { SubmitButton } from '@shared/components/AuthDialog/SubmitButton';
import { useStyles } from '@shared/components/AuthDialog/styles';
import { ResetPasswordValidationRules } from '@shared/components/AuthDialog/validation';
import { ResetPasswordRequestDto } from '@shared/dto/ResetPasswordRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { font } from '@shared/styles/utils';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ResetPassword
 * @date: 09.08.2021
 * @time: 05:52
 */
export function ResetPassword() {
    const [{ token, email }] = useLocationQuery<{ token: string; email: string }>();
    const notifications = useNotifications();
    const navigate = useNavigate();
    const classes = useStyles();
    const { resetPassword } = useAuth();
    const { login } = useAuth();
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

            await login(values.email, values.password);

            navigate('/dashboard');
        },
        [login, navigate, notifications, resetPassword],
    );

    if (!email || !token) {
        return <Navigate to={'/password/forgot'} replace />;
    }

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={ResetPasswordValidationRules}
            enableReinitialize
            validateOnChange
        >
            <Form className={classes.root}>
                <Grid container direction={'column'} className={classes.content}>
                    <Box marginBottom={4}>
                        <Typography variant={'h6'} align={'center'}>
                            Reset Password
                        </Typography>
                        <Typography variant={'body1'} align={'center'}>
                            Enter a new password and confirm to reset your password for&nbsp;{email}.
                        </Typography>
                    </Box>

                    <FormInput type={'password'} label={'Create Password'} name={'password'} />
                    <FormInput type={'password'} label={'Confirm Password'} name={'passwordConfirmation'} />

                    <SubmitButton>Reset Password</SubmitButton>

                    <Divider />

                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={2}>
                        <MuiLink
                            component={Link}
                            to={'/sign-in'}
                            align={'center'}
                            color={'primary'}
                            underline={'hover'}
                            className={font.fontWeightMedium}
                            paragraph
                        >
                            Log in
                        </MuiLink>
                        <MuiLink
                            component={Link}
                            to={'/sign-up'}
                            align={'center'}
                            color={'textSecondary'}
                            underline={'hover'}
                            className={font.fontWeightMedium}
                        >
                            Sign up
                        </MuiLink>
                    </Box>
                </Grid>
            </Form>
        </Formik>
    );
}

export default ResetPassword;
