import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

interface BasicInfoRowProps {
    label: string;
    value: string;
    shown: boolean;
    onSave: any;
    onEdit: any;
    onCancel: any;
    children?: any;
}

const useStyle = makeStyles(
    () => {
        return {
            textLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                color: 'rgba(0, 0, 0, 0.54)',
            },
            valueLabel: {
                fontFamily: 'Roboto',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '0.2px',
                color: 'rgba(0, 0, 0, 0.87)',
            },
        };
    },
    { name: 'BasicInfoRow' },
);

export function BasicInfoRow(props: BasicInfoRowProps) {
    const classes = useStyle();
    const { label, value, shown, children, onEdit } = props;

    return (
        <>
            {!shown ? (
                <>
                    <Grid container paddingLeft={'16px'} paddingRight={'16px'}>
                        <Grid container item xs={3} justifyContent={'flex-start'}>
                            <Typography variant={'subtitle1'} className={classes.textLabel}>
                                {label}
                            </Typography>
                        </Grid>
                        <Grid container item xs={5} justifyContent={'flex-start'}>
                            <Typography variant={'subtitle1'} className={classes.valueLabel}>
                                {value}
                            </Typography>
                        </Grid>
                        <Grid container item xs={4} justifyContent={'flex-end'}>
                            {children ? (
                                <Button variant={'text'} size={'medium'} onClick={onEdit}>
                                    Edit
                                </Button>
                            ) : null}
                        </Grid>
                    </Grid>
                </>
            ) : (
                { ...children }
            )}
        </>
    );
}
