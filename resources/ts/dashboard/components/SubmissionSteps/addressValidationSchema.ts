import * as yup from 'yup';

export const addressValidationSchema = yup.object().shape(
    {
        fullName: yup
            .string()
            .required()
            .matches(/(\w+\s+[^-])+\S[^-]+/),
        address: yup.string().required(),
        address2: yup.string().optional(),
        flat: yup.string().optional(),
        city: yup.string().required(),

        state: yup
            .object()
            .shape({
                name: yup.string(),
                id: yup.number(),
            })
            .when('stateName', {
                is: (stateName: string) => stateName === '',
                then: yup.object().shape({
                    name: yup.string().required(),
                    id: yup.number().required(),
                }),
                otherwise: yup.object().shape({
                    name: yup.string(),
                    id: yup.number(),
                }),
            }),
        stateName: yup.string().when('state', {
            is: (state: { name: string; code: string; id: number }) => state.code === '',
            then: yup.string().required(),
            otherwise: yup.string(),
        }),
        zipCode: yup.string().required(),
        phoneNumber: yup.string().required(),
    },
    [['state', 'stateName']],
);
