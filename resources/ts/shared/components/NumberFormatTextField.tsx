import TextField, { TextFieldProps } from '@mui/material/TextField';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

export function NumberFormatTextField(props: NumberFormatProps<TextFieldProps>) {
    const { ...rest } = props;

    return <NumberFormat customInput={TextField} thousandSeparator isNumericString {...rest} />;
}
