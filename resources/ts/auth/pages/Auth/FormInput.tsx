import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOffOutlined';
import VisibilityIcon from '@material-ui/icons/VisibilityOutlined';
import { useFormikContext } from 'formik';
import { kebabCase } from 'lodash';
import { transparentize } from 'polished';
import React, { HTMLAttributes, useCallback, useMemo, useState } from 'react';
import { cx } from '@shared/lib/utils/cx';

interface FormInputProps extends HTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    type: string;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            position: 'relative',
            marginBottom: theme.spacing(3),
        },
        input: {
            width: '100%',
            padding: theme.spacing(3.25, 2.5, 1.5),
            height: theme.spacing(7),
            borderRadius: theme.spacing(3.5),
            fontSize: theme.spacing(2),
            border: '1px solid #dadada',
            outline: 'none !important',
            '&:focus': {
                borderColor: theme.palette.primary.main,
                backgroundColor: transparentize(0.95, theme.palette.primary.main),
            },
            '&:focus ~ $label, & ~ $labelFilled': {
                transform: `scale(0.75) translate(0, ${theme.spacing(1.5)}px)`,
                fontWeight: 500,
            },
        },
        labelFilled: {},
        label: {
            lineHeight: `${theme.spacing(2)}px`,
            position: 'absolute',
            top: 0,
            left: theme.spacing(2.5),
            fontWeight: 400,
            pointerEvents: 'none',
            transform: `scale(1) translate(0, ${theme.spacing(2.5)}px)`,
            transformOrigin: 'left top',
            transition: theme.transitions.create(['transform', 'font-weight']),
        },
        sensitiveField: {
            paddingRight: theme.spacing(7),
        },
        errorField: {
            borderColor: theme.palette.error.main,
        },
        errorMessage: {
            marginLeft: theme.spacing(2.5),
            display: 'inline-flex',
        },

        sensitiveToggle: {
            position: 'absolute',
            right: 4,
            top: 4,
        },
    }),
    { name: 'FormInput' },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: FormInput
 * @date: 09.08.2021
 * @time: 20:21
 */
export function FormInput({ label, id, name, type, ...rest }: FormInputProps) {
    const [showSensitive, setShowSensitive] = useState(false);
    const id$ = useMemo(() => id || `${kebabCase(label)}_${new Date().getTime()}`, [id, label]);
    const formik = useFormikContext<Record<string, any>>();
    const classes = useStyles();
    const meta = formik.getFieldMeta(name);

    const handleSensitiveToggle = useCallback(() => setShowSensitive((prev) => !prev), [setShowSensitive]);
    const isSensitiveField = type === 'password';
    const isError = meta.touched && meta.error;

    return (
        <div className={classes.root}>
            <input
                id={id$}
                name={name}
                value={meta.value as any}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cx(classes.input, {
                    [classes.sensitiveField]: isSensitiveField,
                    [classes.errorField]: isError,
                })}
                type={showSensitive ? 'text' : type}
                {...rest}
            />
            <Typography
                variant={'body1'}
                component={'label'}
                htmlFor={id$}
                color={isError ? 'error' : 'textSecondary'}
                className={cx(classes.label, { [classes.labelFilled]: !!meta.value })}
            >
                {label}
            </Typography>
            {isSensitiveField && (
                <IconButton onClick={handleSensitiveToggle} className={classes.sensitiveToggle}>
                    {showSensitive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            )}
            {isError && (
                <Typography variant={'caption'} color={'error'} className={classes.errorMessage}>
                    {meta.error}
                </Typography>
            )}
        </div>
    );
}

export default FormInput;
