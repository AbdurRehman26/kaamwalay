import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { ResetPasswordRequestDto } from '@shared/dto/ResetPasswordRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { useLocationQuery } from '@shared/hooks/useLocationQuery';
import { useNotifications } from '@shared/hooks/useNotifications';
import { font } from '@shared/styles/utils';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { useStyles } from './style';
import { ResetPasswordValidationRules } from './validation';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ResetPassword
 * @date: 09.08.2021
 * @time: 05:52
 */
export function ResetPassword() {
    const { token, email } = useLocationQuery<{ token: string; email: string }>();
    const notifications = useNotifications();
    const history = useHistory();
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

            history.push('/sign-in');
        },
        [history, notifications, resetPassword],
    );

    if (!email || !token) {
        return <Redirect to={'/password/forgot'} />;
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
