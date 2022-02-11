import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { useCallback, useMemo } from 'react';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { PopupSignUpValidationRules } from './validation';
import { ActionContent, FormRoot } from './style';

interface Props {
    handleChange: (abc: boolean) => void;
    handleClose: (abc: boolean) => void;
}

export function SignUpContent(props: Props) {
    const { handleChange, handleClose } = props;
    const { register } = useAuth();
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

    const handleSubmit = useCallback(
        async (values) => {
            values = { ...values, passwordConfirmation: values.password };
            await register(values);
        },
        [register],
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
                        <SubmitButton handleClose={handleClose} isModal>
                            Sign up
                        </SubmitButton>
                    </FormRoot>
                </Grid>
                <Divider />
                <ActionContent>
                    <Typography align={'center'} variant={'caption'} marginRight={2}>
                        Already have an account?
                    </Typography>
                    <MuiLink
                        onClick={() => handleChange(true)}
                        fontWeight={500}
                        align={'center'}
                        color={'primary'}
                        underline={'hover'}
                    >
                        LOG IN
                    </MuiLink>
                </ActionContent>
            </Form>
        </Formik>
    );
}
