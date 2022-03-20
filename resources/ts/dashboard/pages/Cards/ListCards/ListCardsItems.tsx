import SortIcon from '@mui/icons-material/Sort';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import { pushToDataLayer } from '@shared/lib/utils/pushToDataLayer';
import { TablePagination } from '@shared/components/TablePagination';
import { bracketParams } from '@shared/lib/api/bracketParams';
import { useListUserCardsQuery } from '@shared/redux/hooks/useUserCardsQuery';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { useNavigate } from 'react-router-dom';
import { font } from '@shared/styles/utils';
import { CardPreview } from '../../../components/CardPreview/CardPreview';
import Button from '@mui/material/Button';
import StyleTwoToneIcon from '@mui/icons-material/StyleTwoTone';

const StyledSelect = styled(Select)(
    {
        marginLeft: 8,
        fontWeight: 500,
        fontSize: '14px',
        '&:before': {
            display: 'none',
        },
    },
    { name: 'StyledSelect' },
);

const StyledBox = styled(Box)(
    {
        width: '100%',
        backgroundColor: '#F9F9F9',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '40px 20px',
    },
    { name: 'StyledBox' },
);

const useStyles = makeStyles(
    (theme) => ({
        paginationFooter: {
            background: 'white',
            position: 'sticky',
            width: '50%',
            left: '32%',
            bottom: '0',
            [theme.breakpoints.down('sm')]: {
                left: '50%',
                width: '50%',
            },
        },
        tableMargin: {
            marginBottom: theme.spacing(7),
        },
        divider: {
            marginTop: '16px',
            width: '100%',
        },
        newSubmissionBtn: {
            borderRadius: 24,
            padding: '12px 24px',
        },
    }),
    {
        name: 'ListCardsItemsStyles',
    },
);
interface ListCardsItemsProps {
    search?: string;
}

export function ListCardItems({ search }: ListCardsItemsProps) {
    const [sortFilter, setSortFilter] = useState('date');
    const classes = useStyles();
    const navigate = useNavigate();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const userCards$ = useListUserCardsQuery({
        params: {
            sort: sortFilter,
            filter: {
                search,
            },
            perPage: 48,
        },
        ...bracketParams(),
    });
    const handleSortChange = useCallback((event) => setSortFilter(event.target.value), [setSortFilter]);

    // Fetch sorted cards based on the selected sort option
    useEffect(
        () => {
            if (!userCards$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                userCards$.sort({ sort: sortFilter });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [sortFilter],
    );

    // Search cards based on the user input & return them sorted based on the selected sort option
    useEffect(
        () => {
            if (!userCards$.isLoading) {
                // noinspection JSIgnoredPromiseFromCall
                userCards$.searchSorted({ sort: sortFilter }, { search });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    );

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        pushToDataLayer({ event: 'google-ads-started-submission-process' });
        navigate('/submissions/new');
    }

    if (userCards$.isLoading || userCards$.isError) {
        return (
            <Box padding={5} alignItems={'center'} justifyContent={'center'} display={'block'}>
                {userCards$.isLoading ? (
                    <CircularProgress />
                ) : (
                    <Typography color={'error'}>Error loading your cards</Typography>
                )}
            </Box>
        );
    }

    const items$ = userCards$?.data?.map((userCard: any, index) => (
        <Grid item xs={6} sm={3} key={index}>
            <CardPreview
                id={userCard?.id}
                image={userCard?.cardProduct?.imagePath}
                name={userCard?.cardProduct?.name}
                shortName={userCard?.cardProduct?.shortName}
                description={userCard?.cardProduct?.longName ?? '-'}
                certification={userCard?.certificateNumber ?? '-'}
                grade={userCard?.overallGrade ?? '-'}
            />
        </Grid>
    ));

    // If we have no cards and the search is empty it means the user doesn't have any graded cards
    if (items$.length === 0 && search === '') {
        return (
            <StyledBox>
                <Grid container alignItems={'center'} justifyContent={'center'} rowSpacing={1}>
                    <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                        <StyleTwoToneIcon />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'subtitle1'} fontWeight={500} textAlign={'center'} fontSize={16}>
                            No Cards
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={'body1'} textAlign={'center'} fontSize={12}>
                            You haven't submitted any cards for grading yet.
                            <br />
                            Click the button below to get started.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container justifyContent={'center'} alignContent={'center'}>
                        <Button
                            onClick={handleOnClick}
                            variant={'contained'}
                            color={'primary'}
                            className={classes.newSubmissionBtn}
                        >
                            New Submission
                        </Button>
                    </Grid>
                </Grid>
            </StyledBox>
        );
    }

    // If we have no cards but the search is not empty it means the user tried to search for something that didn't return anything
    if (items$.length === 0 && search !== '') {
        return (
            <Typography variant={'subtitle2'}>
                We didn't find anything for "{search}". Try searching for something else
            </Typography>
        );
    }

    return (
        <>
            <Box display={'flex'} alignItems={'center'} width={'100%'} paddingBottom={4}>
                {!isSm ? <Typography variant={'subtitle2'}>Graded Cards</Typography> : null}
                <Grid container item xs alignItems={'center'} justifyContent={isSm ? 'flex-start' : 'flex-end'}>
                    <SortIcon color={'disabled'} />
                    <Typography variant={'body2'} color={'textSecondary'} className={font.fontWeightMedium}>
                        Sort By:
                    </Typography>
                    <StyledSelect value={sortFilter} variant="standard" onChange={handleSortChange}>
                        <MenuItem value={'date'}>Date (Newest)</MenuItem>
                        <MenuItem value={'-date'}>Date (Oldest)</MenuItem>
                    </StyledSelect>
                </Grid>
            </Box>
            <Grid container spacing={1} className={classes.tableMargin}>
                {items$}
                <Divider className={classes.divider} />
                <TablePagination
                    className={classes.paginationFooter}
                    {...{
                        ...userCards$.paginationProps,
                        rowsPerPageOptions: [48],
                    }}
                />
            </Grid>
        </>
    );
}
