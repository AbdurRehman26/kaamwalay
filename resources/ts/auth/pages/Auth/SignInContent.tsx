import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import { LoginRequestDto } from '@shared/dto/LoginRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { useCallback, useMemo } from 'react';
import { SignInValidationRules } from './validation';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { ActionContent, FormRoot } from './style';

interface Props {
    handleChange: (abc: boolean) => void;
    handleClose: (abc: boolean) => void;
}

export function SignInContent(props: Props) {
    const { handleChange, handleClose } = props;
    const { login } = useAuth();
    const initialState = useMemo<LoginRequestDto>(
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
            <Form>
                <Grid container marginTop={4} padding={'24px'}>
                    <FormRoot>
                        <FormInput type={'email'} label={'Email'} name={'email'} />
                    </FormRoot>

                    <FormRoot>
                        <FormInput type={'password'} label={'Password'} name={'password'} />
                    </FormRoot>

                    <FormRoot>
                        <SubmitButton handleClose={handleClose} isModal>
                            Log in
                        </SubmitButton>
                    </FormRoot>

                    <Box display={'flex'} width={'100%'} justifyContent={'center'}>
                        <MuiLink
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
                <Divider variant={'fullWidth'} />
                <ActionContent>
                    <Typography variant={'caption'} marginRight={2}>
                        New to AGS?
                    </Typography>
                    <MuiLink
                        onClick={() => handleChange(false)}
                        fontWeight={500}
                        align={'center'}
                        color={'primary'}
                        underline={'hover'}
                    >
                        SIGN UP
                    </MuiLink>
                </ActionContent>
            </Form>
        </Formik>
    );
}
