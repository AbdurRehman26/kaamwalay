import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@shared/hooks/useAuth';
import { font } from '@shared/styles/utils';

import { FormInput } from './FormInput';
import SubmitButton from './SubmitButton';
import { useStyles } from './style';
import { SignInValidationRules } from './validation';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: SignIn
 * @date: 09.08.2021
 * @time: 05:52
 */
export function SignIn() {
    const classes = useStyles();
    const { login } = useAuth();
    const initialState = useMemo(
        () => ({
            email: '',
            password: '',
        }),
        [],
    );

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            await login(email, password);
        },
        [login],
    );

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={SignInValidationRules}
            validateOnChange
        >
            <Form className={classes.root}>
                <Grid container direction={'column'} className={classes.content}>
                    <Box marginBottom={4}>
                        <Typography variant={'h6'} align={'center'}>
                            Log In to Your AGS Account to Access Robograding
                        </Typography>
                    </Box>
                    <FormInput type={'email'} label={'Email'} name={'email'} />
                    <FormInput type={'password'} label={'Password'} name={'password'} />

                    <SubmitButton>Log in</SubmitButton>

                    <MuiLink
                        component={Link}
                        to={'/forgot-password'}
                        variant={'subtitle1'}
                        color={'textPrimary'}
                        align={'center'}
                        className={classes.forgotLink}
                    >
                        Forgot Password?
                    </MuiLink>

                    <Divider />

                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={3}>
                        <Typography align={'center'}>New to AGS?</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={2}>
                        <MuiLink
                            component={Link}
                            to={'/sign-up'}
                            align={'center'}
                            color={'primary'}
                            className={font.fontWeightMedium}
                        >
                            Sign Up
                        </MuiLink>
                    </Box>
                </Grid>
            </Form>
        </Formik>
    );
}

export default SignIn;
