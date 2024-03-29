import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { debounce } from 'lodash';
import React, { ChangeEvent, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react';
import { useAuth } from '@shared/hooks/useAuth';
import { font } from '@shared/styles/utils';
import ReferralBanner from '@dashboard/pages/Referral/ReferralBanner';

interface ListHeaderProps {
    headline: string;
    noSearch?: boolean;
    noMargin?: boolean;
    onSearch?: (value: string) => void;
    actions?: ReactNode;
    isReferral?: boolean;
}

const useStyles = makeStyles(
    (theme) => ({
        root: {},
        searchBarHolder: {
            padding: '0 20px',
            [theme.breakpoints.down(1016)]: {
                paddingRight: 0,
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                padding: '14px 0 0 0',
            },
        },
        searchBar: {
            width: '100%',
            height: 48,
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            borderRadius: 24,
            maxWidth: 400,
            [theme.breakpoints.down(1016)]: {
                maxWidth: '100%',
            },
        },
        searchBarIcon: {
            margin: '0 14px',
        },
        divider: ({ noMargin }: Record<string, any>) => ({
            width: '100%',
            margin: theme.spacing(2.5, 0, noMargin ? 0 : 2.5),
        }),
        rightContentHolder: {
            [theme.breakpoints.down(1016)]: {
                paddingTop: 14,
                width: '100%',
            },
        },
    }),
    {
        name: 'ListHeader',
    },
);

const debouncedFunc = debounce((func: () => void) => func(), 300);

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: ListHeader
 * @date: 10.08.2021
 * @time: 01:43
 */
export function ListHeader({
    children,
    headline,
    noSearch,
    noMargin,
    isReferral,
    onSearch,
    actions,
}: PropsWithChildren<ListHeaderProps>) {
    const styleProps = useMemo(() => ({ noMargin }), [noMargin]);
    const classes = useStyles(styleProps);
    const user$ = useAuth().user;

    const handleSearch = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            debouncedFunc(() => {
                if (onSearch) {
                    onSearch(event.target.value);
                }
            });
        },
        [onSearch],
    );

    return (
        <>
            {!isReferral && user$?.showReferralPromotionalPopup ? <ReferralBanner /> : null}
            <Grid component={'header'} container direction={'row'} alignItems={'center'} className={classes.root}>
                <Typography component={'h2'} variant={'h5'} className={font.fontWeightMedium}>
                    {headline}
                </Typography>
                {actions}
                <Box flexGrow={1} className={classes.searchBarHolder}>
                    {!noSearch && (
                        <InputBase
                            placeholder="Search…"
                            className={classes.searchBar}
                            startAdornment={<SearchIcon className={classes.searchBarIcon} />}
                            onChange={handleSearch}
                        />
                    )}
                </Box>

                <Box
                    display={'flex'}
                    flex={'1 1 auto'}
                    justifyContent={'flex-end'}
                    className={classes.rightContentHolder}
                >
                    {children}
                </Box>
            </Grid>
            {!isReferral ? <Divider className={classes.divider} /> : null}
        </>
    );
}
