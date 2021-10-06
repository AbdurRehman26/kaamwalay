import Grid, { GridProps } from '@material-ui/core/Grid';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { font } from '@shared/styles/utils';

interface GradeScoreProps extends GridProps {
    label: string;
    value: number;
    maxWidth?: number | string;
    padding?: number | string;
    align?: TypographyProps['align'];
    labelVariant?: TypographyProps['variant'];
}

const useStyles = makeStyles<Theme, Pick<GradeScoreProps, 'maxWidth' | 'padding'>>(
    () => ({
        root: ({ padding }) => ({
            width: '100%',
            padding,
        }),

        label: ({ maxWidth }) => ({
            maxWidth,
            marginBottom: 6,
        }),
    }),
    {
        name: 'GradeScore',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: GradeScore
 * @date: 11.08.2021
 * @time: 19:16
 */
export function GradeScore({
    label,
    value,
    padding,
    maxWidth,

    align = 'center',
    labelVariant = 'body2',
    ...rest
}: GradeScoreProps) {
    const styleProps = useMemo(() => ({ maxWidth, padding }), [maxWidth, padding]);
    const classes = useStyles(styleProps);
    return (
        <Grid container item direction={'column'} className={classes.root} {...rest}>
            <Typography variant={labelVariant} align={align} className={classes.label}>
                {label}
            </Typography>
            <Typography variant={'h6'} align={align} className={font.fontWeightBold}>
                {value}
            </Typography>
        </Grid>
    );
}

export default GradeScore;
