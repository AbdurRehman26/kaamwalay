import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import { useFormikContext } from 'formik';
import React, { PropsWithChildren } from 'react';

interface Props {
    isModal?: boolean;
    handleClose?: (close: boolean) => void;
}

const useStyles = makeStyles(
    {
        root: {
            height: 56,
            borderRadius: 28,
            marginBottom: 28,
            background: '#20BFB8',
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
export function SubmitButton({ isModal, children }: PropsWithChildren<Props>) {
    const classes = useStyles();
    const formik = useFormikContext();

    return (
        <Button
            fullWidth={isModal}
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
