import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';
import { MouseEvent, useCallback } from 'react';

export function FormikButton({ type = 'submit', disabled, onClick, ...rest }: LoadingButtonProps) {
    const formik = useFormikContext();

    const handleClick = useCallback(
        async (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) {
                onClick(event);
            }
            if (type !== 'submit') {
                await formik.submitForm();
            }
        },
        [formik, onClick, type],
    );

    return (
        <LoadingButton
            type={type}
            onClick={handleClick}
            loading={formik.isSubmitting}
            disabled={disabled || formik.isSubmitting || !formik.isValid}
            {...rest}
        />
    );
}
