import * as yup from 'yup';

export const addressValidationSchema = yup.object().shape({
    fullName: yup.string().required(),
    // lastName: yup.string().required(),
    address: yup.string().required(),
    address2: yup.string().optional(),
    flat: yup.string().optional(),
    city: yup.string().required(),
    stateName: yup.string().optional(),
    state: yup.object().shape({
        name: yup.string().optional(),
        id: yup.number().optional(),
    }),
    zipCode: yup.string().required(),
    phoneNumber: yup.string().required(),
});
