import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '@shared/components/AuthDialog/FormInput';
import SubmitButton from '@shared/components/AuthDialog/SubmitButton';
import { useStyles } from '@shared/components/AuthDialog/styles';
import { SignUpValidationRules } from '@shared/components/AuthDialog/validation';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { font } from '@shared/styles/utils';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
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
            email: '',
            phone: '',
            password: '',
            passwordConfirmation: '',
            isMarketingNotificationsEnabled: true,
        }),
        [],
    );

    const handleSubmit = useCallback(
        async (values: SignUpRequestDto) => {
            values = { ...values, passwordConfirmation: values.password };
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
                    <FormInput type={'text'} label={'Email'} name={'email'} />
                    <FormInput type={'phone'} label={'Phone Number'} name={'phone'} />
                    <FormInput type={'password'} label={'Create Password'} name={'password'} />

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
                            underline={'hover'}
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
