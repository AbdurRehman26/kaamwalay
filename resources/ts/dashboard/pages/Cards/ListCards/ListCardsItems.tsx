import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import StyleTwoToneIcon from '@mui/icons-material/StyleTwoTone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import { default as TextLink } from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TablePagination } from '@shared/components/TablePagination';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { CardPreview } from '../../../components/CardPreview/CardPreview';

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
    userCards$: any;
}

export function ListCardItems({ search, userCards$ }: ListCardsItemsProps) {
    const classes = useStyles();
    const navigate = useNavigate();
    const isSm = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const [displaySelectButtons, setDisplaySelectButtons] = useState(true);

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        googleTagManager({ event: 'google-ads-started-submission-process' });
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

    const items$ = userCards$?.data?.map((userCard: any, index: any) => (
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
                        <Typography variant={'body1'} textAlign={'center'} fontSize={12} margin={'0 35px'}>
                            Your cards will only show here once we grade and ship them back to you. Either you haven't
                            created a submission, or we haven't shipped any cards back to you, yet. Go to the{' '}
                            <MuiLink
                                component={Link}
                                to={'/submissions'}
                                align={'center'}
                                color={'primary'}
                                underline={'always'}
                            >
                                Submissions
                            </MuiLink>{' '}
                            page to see status of submissions or create a new one.
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
                {displaySelectButtons ? (
                    !isSm ? (
                        <Typography variant={'subtitle2'}>{items$.length} Graded Cards</Typography>
                    ) : null
                ) : (
                    <>
                        <IconButton size="large">
                            <CheckBoxOutlineBlankSharpIcon />
                        </IconButton>
                        <Typography variant={'subtitle2'}>Select all cards on this page - </Typography>
                        <TextLink
                            sx={{ marginLeft: 1, color: 'black' }}
                            component={'button'}
                            variant="body2"
                            onClick={() => {
                                console.info("I'm a button.");
                            }}
                        >
                            Select All
                        </TextLink>
                    </>
                )}
                <Grid container item xs alignItems={'center'} justifyContent={isSm ? 'flex-start' : 'flex-end'}>
                    {items$.length && (
                        <Button
                            onClick={() => setDisplaySelectButtons(!displaySelectButtons)}
                            sx={{ borderRadius: 24, padding: '10px 15px 10px 15px' }}
                            color={'primary'}
                            variant={'outlined'}
                            startIcon={displaySelectButtons ? <LibraryAddCheckOutlinedIcon /> : null}
                        >
                            {displaySelectButtons ? 'Select Cards' : 'Cancel'}
                        </Button>
                    )}
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
