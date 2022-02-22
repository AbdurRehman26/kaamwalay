import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { useAuth } from '@shared/hooks/useAuth';
import { useCallback, useMemo } from 'react';
import { FormInput } from '@shared/components/Auth/FormInput';
import { SubmitButton } from '@shared/components/Auth/SubmitButton';
import { PopupSignUpValidationRules } from '@shared/components/Auth/validation';
import { ActionContent, FormRoot } from '@shared/components/Auth/styles';
import { useSharedDispatch } from '@shared/hooks/useSharedDispatch';
import { headerDialogVisibility } from '@shared/redux/slices/authenticationSlice';

interface Props {
    onContentChange: (isLogin: boolean) => void;
}

export function SignUpContentHeader(props: Props) {
    const { onContentChange } = props;
    const { register } = useAuth();
    const dispatch = useSharedDispatch();
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
            dispatch(headerDialogVisibility(false));
        },
        [register, dispatch],
    );

    const handleChange = () => {
        onContentChange(true);
    };

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
                        <SubmitButton isModal>Sign up</SubmitButton>
                    </FormRoot>
                </Grid>
                <Divider />
                <ActionContent>
                    <Typography align={'center'} variant={'caption'} marginRight={2}>
                        Already have an account?
                    </Typography>
                    <MuiLink
                        onClick={handleChange}
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
