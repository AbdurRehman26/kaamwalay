import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import { SubmitButton } from '@shared/components/AuthDialog/SubmitButton';
import { useStyles } from '@shared/components/AuthDialog/styles';
import { ForgotPasswordValidationRules } from '@shared/components/AuthDialog/validation';
import { useAuth } from '@shared/hooks/useAuth';
import { useNotifications } from '@shared/hooks/useNotifications';
import { font } from '@shared/styles/utils';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: ForgotPassword
 * @date: 09.08.2021
 * @time: 05:52
 */
export function ForgotPassword() {
    const [confirmationEmail, setConfirmationEmail] = useState('');

    const classes = useStyles();
    const notifications = useNotifications();
    const { forgotPassword } = useAuth();
    const initialState = useMemo(
        () => ({
            email: '',
        }),
        [],
    );

    const handleSubmit = useCallback(
        async ({ email }) => {
            const data = await forgotPassword(email);
            const { error, payload } = data as any;

            if (error) {
                return;
            }

            if (payload?.message) {
                notifications.success(payload?.message);
            }

            setConfirmationEmail(email);
        },
        [forgotPassword, notifications],
    );

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={ForgotPasswordValidationRules}
            validateOnChange
        >
            <Form className={classes.root}>
                <Grid container direction={'column'} className={classes.content}>
                    <Box marginBottom={4}>
                        <Typography variant={'h6'} align={'center'}>
                            Reset Password
                        </Typography>
                        {!confirmationEmail ? (
                            <Typography variant={'body1'} align={'center'}>
                                Enter the email associated with your account in order to reset your password.
                            </Typography>
                        ) : null}
                    </Box>
                    {confirmationEmail ? (
                        <>
                            <Typography variant={'body1'} align={'center'}>
                                Email sent to: {confirmationEmail}
                            </Typography>
                            <Box my={3}>
                                <Typography variant={'body1'} align={'center'}>
                                    Check your email and follow the link to reset your password.
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <FormInput type={'text'} label={'Email'} name={'email'} />
                    )}

                    <SubmitButton>Send Link</SubmitButton>

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

export default ForgotPassword;
