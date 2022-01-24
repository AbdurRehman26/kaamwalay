import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { debounce } from 'lodash';
import React, { ChangeEvent, PropsWithChildren, useCallback, useMemo } from 'react';
import { font } from '@shared/styles/utils';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import ReactGA from 'react-ga';
interface ListHeaderProps {
    headline: string;
    noSearch?: boolean;
    noMargin?: boolean;
    isSubmission?: boolean;
    onSearch?: (value: string) => void;
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
        newSubmissionBtn: {
            borderRadius: 24,
            padding: '8px 14px',
            marginLeft: 'auto',
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
    isSubmission,
    onSearch,
}: PropsWithChildren<ListHeaderProps>) {
    const styleProps = useMemo(() => ({ noMargin }), [noMargin]);
    const classes = useStyles(styleProps);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const navigate = useNavigate();

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

    // function handleOnClick() {}
    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        pushToDataLayer({ event: 'google-ads-started-submission-process' });
        navigate('/submissions/new');
    }

    return (
        <>
            <Grid component={'header'} container direction={'row'} alignItems={'center'} className={classes.root}>
                <Typography component={'h2'} variant={'h5'} className={font.fontWeightMedium}>
                    {headline}
                </Typography>
                {isMobile && isSubmission ? (
                    <Button
                        onClick={handleOnClick}
                        variant={'contained'}
                        color={'primary'}
                        className={classes.newSubmissionBtn}
                    >
                        New Submission
                    </Button>
                ) : null}

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
            <Divider className={classes.divider} />
        </>
    );
}
