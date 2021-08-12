import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(
    (theme) => ({
        root: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: theme.spacing(1, 1.5),
            borderRadius: 4,
        },
        label: {
            textTransform: 'uppercase',
            lineHeight: '12px',
        },
        value: {
            fontWeight: 500,
            lineHeight: '24px',
        },
    }),
    { name: 'StyledRoot' },
);

interface GradeStatusProps {
    value: number | string;
    label: string;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: GradeStatus
 * @date: 10.08.2021
 * @time: 17:22
 */
export function GradeStatus({ label, value }: GradeStatusProps) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Typography variant={'caption'} align={'center'} color={'inherit'} className={classes.label}>
                {label}
            </Typography>
            <Typography variant={'h5'} align={'center'} color={'inherit'} className={classes.value}>
                {value}
            </Typography>
        </div>
    );
}

export default GradeStatus;
