import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { PropsWithChildren } from 'react';

import { font } from '@shared/styles/utils';

import { useSectionHeaderStyles } from './style';

interface SectionHeaderProps {
    order: number;
    headline: string;
}

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: SectionHeader
 * @date: 07.08.2021
 * @time: 01:06
 */
export function SectionHeader({ order, headline, children }: PropsWithChildren<SectionHeaderProps>) {
    const classes = useSectionHeaderStyles();

    return (
        <Grid container component={'header'} direction={'column'} className={classes.root}>
            <Grid container direction={'row'} alignItems={'center'} className={classes.header}>
                <Avatar className={classes.avatar}>{order}</Avatar>
                <Typography variant={'subtitle1'} className={font.fontWeightMedium}>
                    {headline}
                </Typography>
            </Grid>
            <Typography variant={'body2'}>{children}</Typography>
        </Grid>
    );
}

export default SectionHeader;
