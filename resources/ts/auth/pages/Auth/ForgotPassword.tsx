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
import { SubmitButton } from './SubmitButton';
import { useStyles } from './style';
import { ForgotPasswordValidationRules } from './validation';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: ForgotPassword
 * @date: 09.08.2021
 * @time: 05:52
 */
export function ForgotPassword() {
    const classes = useStyles();
    const { login } = useAuth();
    const initialState = useMemo(
        () => ({
            email: '',
        }),
        [],
    );

    const handleSubmit = useCallback(async () => {
        // Request
    }, [login]);

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
                            Recover login to your AGS Account and Access Robograding
                        </Typography>
                    </Box>
                    <FormInput type={'text'} label={'Email'} name={'email'} />

                    <SubmitButton>Submit</SubmitButton>

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

export default ForgotPassword;