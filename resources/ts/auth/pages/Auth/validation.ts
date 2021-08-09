import * as yup from 'yup';

const RequiredMessage = 'Required field!';

export const SignInValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    password: yup.string().trim().required(RequiredMessage),
});

export const SignUpValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    password: yup.string().trim().required(RequiredMessage),
    fullName: yup.string().trim().required(RequiredMessage),
    username: yup.string().trim().required(RequiredMessage),
    confirmationPassword: yup
        .string()
        .trim()
        .required(RequiredMessage)
        .oneOf([yup.ref('password'), null], "Passwords doesn't match!"),
});

export const ForgotPasswordValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
});
