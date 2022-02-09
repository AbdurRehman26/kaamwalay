import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';

interface Props {
    mainLabel: string;
    cardStatus: string;
    currentViewMode: string;
    value: string | number;
    disabled?: boolean;
    onBlur: any;
    onChange: any;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(3),
        },
        disabled: {
            opacity: 0.2,
        },
        alert: {
            marginBottom: theme.spacing(2),
        },
        divider: {
            margin: theme.spacing(3, 0),
        },
        headingHolder: {
            marginBottom: theme.spacing(2),
        },
        heading: {
            marginLeft: theme.spacing(1),
            fontWeight: 500,
        },
        gradeReadContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        gradeReadLabel: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
        },
        gradeReadValue: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.2px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginTop: '12px',
        },
    }),
    { name: 'GradeInput' },
);

export function GradeInput({ mainLabel, disabled, value, currentViewMode, onBlur, cardStatus, onChange }: Props) {
    const classes = useStyles();
    return (
        <>
            {cardStatus === 'Confirmed' || currentViewMode === 'graded_revise_mode' ? (
                <TextField
                    size={'medium'}
                    variant={'outlined'}
                    value={value}
                    disabled={disabled}
                    onBlur={onBlur}
                    onChange={onChange}
                    label={mainLabel}
                />
            ) : (
                <div className={classes.gradeReadContainer}>
                    <div className={classes.gradeReadLabel}>{mainLabel}</div>
                    <div className={classes.gradeReadValue}>{value}</div>
                </div>
            )}
        </>
    );
}
