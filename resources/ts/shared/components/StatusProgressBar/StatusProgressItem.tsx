import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useMemo } from 'react';
import { formatDate } from '@shared/lib/datetime/formatDate';
import { cx } from '../../lib/utils/cx';
import { StatusProgressStep } from './StatusProgressStep';

export interface StatusProgressItemProps extends StatusProgressStep {
    width?: number;
    index?: number;
    isFirst?: boolean;
    isLast?: boolean;
}

const useStyles = makeStyles<Theme, Pick<StatusProgressItemProps, 'index' | 'width' | 'isCompleted'>>(
    (theme) => ({
        root: ({ width, index, isCompleted }) => ({
            width: `calc(${width}% - 12px)`,
            height: 60,
            margin: theme.spacing(0, 0.75),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '1px solid #e0e0e0',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            zIndex: (index ?? 0) + 1,
            backgroundColor: isCompleted ? '#e0e0e0' : 'transparent',
            '&:after, &:before': {
                content: "''",
                display: 'block',
                position: 'absolute',
                top: 8,
                width: 42,
                height: 42,
                backgroundColor: 'transparent',
                transform: 'rotate(45deg)',
                boxShadow: '1px -1px 0px #e0e0e0',
            },
            '&:after': {
                right: -21,
            },
            '&:before': {
                left: -22,
            },
            '&:first-child, &:last-child': {
                width: `calc(${width}% - 8px)`,
            },
            '&:first-child': {
                marginLeft: 0,
                borderRadius: '30px 0 0 30px',
                borderLeftColor: '#e0e0e0',
            },
            '&:last-child': {
                marginRight: 0,
                borderRadius: '0 30px 30px 0',
                borderRightColor: '#e0e0e0',
            },
            '&:first-child:before': {
                display: 'none',
            },
            '&:last-child:after': {
                display: 'none',
            },
        }),
        completedStep: ({ isCompleted }) => ({
            '&:after': {
                backgroundColor: isCompleted ? '#e0e0e0' : '#f9f9f9',
            },
            '& + .status-progress-item:before': {
                backgroundColor: !isCompleted ? '#e0e0e0' : '#f9f9f9',
            },
        }),
        svgImage: {
            position: 'absolute',
            zIndex: 1,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        svgImagePath: {
            fill: '#f9f9f9',
            stroke: '#e0e0e0',
        },
        inner: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
        },
        label: ({ isCompleted }) => ({
            fontWeight: 500,
            color: !isCompleted ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.87)',
        }),
        caption: {
            color: 'rgba(0, 0, 0, 0.54)',
        },
    }),
    { name: 'StatusProgressItem' },
);

export function StatusProgressItem({ label, isCompleted, completedAt, width, index }: StatusProgressItemProps) {
    const styleProps = useMemo(() => ({ width, isCompleted, index }), [width, isCompleted, index]);
    const classes = useStyles(styleProps);

    return (
        <>
            <div className={cx('status-progress-item', { [classes.completedStep]: isCompleted }, classes.root)}>
                <div className={classes.inner}>
                    <Typography variant={'body2'} className={classes.label}>
                        {label}
                    </Typography>
                    {completedAt && isCompleted ? (
                        <Typography className={classes.caption} variant={'caption'}>
                            {formatDate(completedAt, 'MM/DD/YYYY [at] hh:mm A')}
                        </Typography>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default StatusProgressItem;
