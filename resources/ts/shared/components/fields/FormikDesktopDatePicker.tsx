import DesktopDatePicker, { DesktopDatePickerProps } from '@mui/lab/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

export interface FormikDesktopDatePickerProps
    extends Omit<
        DesktopDatePickerProps,
        'name' | 'value' | 'date' | 'onChange' | 'openPicker' | 'rawValue' | 'renderInput'
    > {
    name: string;
    fullWidth?: boolean;
    onChange?: DesktopDatePickerProps['onChange'];
    renderInput?: DesktopDatePickerProps['renderInput'];
}

export function FormikDesktopDatePicker(props: FormikDesktopDatePickerProps) {
    const { name, fullWidth, renderInput, onChange, inputFormat = 'MM/DD/yyyy', ...rest } = props;

    const formik = useFormikContext();
    const meta = formik.getFieldMeta(name);

    const handleChange = useCallback(
        (value) => {
            formik.handleChange({
                target: {
                    value,
                    name,
                },
            });

            if (onChange) {
                onChange(value);
            }
        },
        [formik, name, onChange],
    );

    return (
        <DesktopDatePicker
            value={meta.value}
            onChange={handleChange}
            inputFormat={inputFormat}
            renderInput={renderInput ?? ((params) => <TextField name={'name'} {...params} />)}
            {...rest}
        />
    );
}
