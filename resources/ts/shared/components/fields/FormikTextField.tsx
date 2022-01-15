import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

export interface FormikTextFieldProps extends Omit<TextFieldProps, 'name' | 'value'> {
    name: string;
}

export function FormikTextField({ onChange, onBlur, ...rest }: FormikTextFieldProps) {
    const formik = useFormikContext();
    const meta = formik.getFieldMeta(rest.name);

    const handleChange = useCallback(
        (event) => {
            formik.handleChange(event);
            if (onChange) {
                onChange(event);
            }
        },
        [formik, onChange],
    );

    const handleBlur = useCallback(
        (event) => {
            formik.handleBlur(event);
            if (onBlur) {
                onBlur(event);
            }
        },
        [formik, onBlur],
    );

    if (meta.touched && meta.error) {
        rest.helperText = meta.error;
    }

    return (
        <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            value={meta.value}
            error={meta.touched && !!meta.error}
            {...rest}
        />
    );
}
