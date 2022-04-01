import * as yup from 'yup';

export const addressValidationSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    address: yup.string().required(),
    flat: yup.string().optional(),
    city: yup.string().required(),
    state: yup.object().shape({
        name: yup.string().required(),
        id: yup.number().required(),
    }),
    zipCode: yup.string().required(),
    phoneNumber: yup.string().required(),
});
