import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import React, { PropsWithChildren, useMemo } from 'react';

import { font } from '@shared/styles/utils';

interface ListHeaderProps {
    headline: string;
    noSearch?: boolean;
    noMargin?: boolean;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        searchBarHolder: {
            padding: '0 20px',
        },
        searchBar: {
            width: '100%',
            height: 48,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            borderRadius: 24,
            maxWidth: 400,
        },
        searchBarIcon: {
            margin: '0 14px',
        },
        divider: ({ noMargin }: Record<string, any>) => ({
            width: '100%',
            margin: theme.spacing(2.5, 0, noMargin ? 0 : 2.5),
        }),
    }),
    {
        name: 'ListHeader',
    },
);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ListHeader
 * @date: 10.08.2021
 * @time: 01:43
 */
export function ListHeader({ children, headline, noSearch, noMargin }: PropsWithChildren<ListHeaderProps>) {
    const styleProps = useMemo(
        () => ({
            noMargin,
        }),
        [noMargin],
    );

    const classes = useStyles(styleProps);

    return (
        <>
            <Grid component={'header'} container direction={'row'} alignItems={'center'} className={classes.root}>
                <Typography component={'h2'} variant={'h5'} className={font.fontWeightMedium}>
                    {headline}
                </Typography>
                <Box flexGrow={1} className={classes.searchBarHolder}>
                    {!noSearch && (
                        <InputBase
                            placeholder="Search…"
                            className={classes.searchBar}
                            startAdornment={<SearchIcon className={classes.searchBarIcon} />}
                        />
                    )}
                </Box>
                {children}
            </Grid>
            <Divider className={classes.divider} />
        </>
    );
}

export default ListHeader;
