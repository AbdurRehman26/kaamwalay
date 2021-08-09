import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { font } from '@shared/styles/utils';

import { FormInput } from './FormInput';
import SubmitButton from './SubmitButton';
import { useStyles } from './style';
import { SignUpValidationRules } from './validation';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: SignUp
 * @date: 09.08.2021
 * @time: 05:52
 */
export function SignUp() {
    const classes = useStyles();
    const { register } = useAuth();
    const initialState = useMemo<SignUpRequestDto>(
        () => ({
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmationPassword: '',
        }),
        [],
    );

    const handleSubmit = useCallback(
        async (values) => {
            await register(values);
        },
        [register],
    );

    return (
        <Formik
            initialValues={initialState}
            onSubmit={handleSubmit}
            validationSchema={SignUpValidationRules}
            validateOnChange
        >
            <Form className={classes.root}>
                <Grid container direction={'column'} className={classes.content}>
                    <Box marginBottom={4}>
                        <Typography variant={'h6'} align={'center'}>
                            Sign Up to AGS to Access Robograding
                        </Typography>
                    </Box>
                    <FormInput type={'text'} label={'Full name'} name={'fullName'} />
                    <FormInput type={'text'} label={'Create Username'} name={'username'} />
                    <FormInput type={'text'} label={'Email'} name={'email'} />
                    <FormInput type={'password'} label={'Create Password'} name={'password'} />
                    <FormInput type={'password'} label={'Confirm Password'} name={'confirmationPassword'} />

                    <SubmitButton>Sign up</SubmitButton>

                    <Divider />

                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={3}>
                        <Typography align={'center'}>Have an account?</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} marginTop={2}>
                        <MuiLink
                            component={Link}
                            to={'/sign-in'}
                            align={'center'}
                            color={'primary'}
                            className={font.fontWeightMedium}
                        >
                            Sign in
                        </MuiLink>
                    </Box>
                </Grid>
            </Form>
        </Formik>
    );
}

export default SignUp;
