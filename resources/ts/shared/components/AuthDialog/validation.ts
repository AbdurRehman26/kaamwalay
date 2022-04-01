import * as yup from 'yup';

const RequiredMessage = 'Required field!';

const password = yup
    .string()
    .trim()
    .required(RequiredMessage)
    .min(8, 'Password need to have at least 8 characters!')
    .matches(
        /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number',
    );

export const SignInValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    password: yup.string().trim().required(RequiredMessage),
});

export const SignUpValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    fullName: yup.string().trim().required(RequiredMessage),
    password,
});

export const PopupSignUpValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
    fullName: yup.string().trim().required(RequiredMessage),
    password,
});

export const ForgotPasswordValidationRules = yup.object().shape({
    email: yup.string().trim().required(RequiredMessage).email('Invalid email!'),
});

export const ResetPasswordValidationRules = yup.object().shape({
    passwordConfirmation: password.oneOf([yup.ref('password'), null], "Passwords doesn't match!"),
    password,
});
