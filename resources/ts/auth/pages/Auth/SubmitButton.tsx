import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { useFormikContext } from 'formik';
import React, { PropsWithChildren } from 'react';

const useStyles = makeStyles(
    {
        root: {
            height: 56,
            borderRadius: 28,
            marginBottom: 28,
        },
    },
    { name: 'SubmitButton' },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: SubmitButton
 * @date: 09.08.2021
 * @time: 22:39
 */
export function SubmitButton({ children }: PropsWithChildren<any>) {
    const classes = useStyles();
    const formik = useFormikContext();

    return (
        <Button
            variant={'contained'}
            size={'large'}
            type={'submit'}
            color={'primary'}
            className={classes.root}
            disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
        >
            {children}
        </Button>
    );
}

export default SubmitButton;
