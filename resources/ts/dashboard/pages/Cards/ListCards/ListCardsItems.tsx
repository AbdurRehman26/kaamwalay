import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import StyleTwoToneIcon from '@mui/icons-material/StyleTwoTone';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
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
import React, { useCallback, useState } from 'react';
import ReactGA from 'react-ga4';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TablePagination } from '@shared/components/TablePagination';
import { EventCategories, SubmissionEvents } from '@shared/constants/GAEventsTypes';
import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { UserEntity } from '@shared/entities/UserEntity';
import { useConfirmation } from '@shared/hooks/useConfirmation';
import { googleTagManager } from '@shared/lib/utils/googleTagManager';
import { changeUserCardOwnerShip } from '@shared/redux/slices/userCardsSlice';
import { CardPreview } from '../../../components/CardPreview/CardPreview';
import { TransferCardsDialog } from '../ListCards/TransferCards';

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
        checkBoxIcon: {
            color: 'rgba(0, 0, 0, 0.54)',
            top: 8,
            left: 8,
            padding: '0px',
            position: 'absolute',
        },
        checkBox: {
            borderRadius: 4,
            background: 'white !important',
            padding: 5,
            boxShadow: theme.shadows[3],
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
    const [displaySelectButtons, setDisplaySelectButtons] = useState(false);
    const [showTransferDialog, setShowTransferDialog] = useState(false);
    const [userCardIds, setUserCardIds] = useState<[number?]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [, updateState] = React.useState();
    // @ts-ignore
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const confirm = useConfirmation();
    const dispatch = useDispatch();

    const handleSelectClick = async (id: number) => {
        const selectedIndex = userCardIds.indexOf(id);
        if (selectedIndex === -1) {
            setDisplaySelectButtons(true);
            userCardIds.push(id);
        } else {
            userCardIds.splice(selectedIndex, 1);
        }
        forceUpdate();
    };

    const isSelected = (selectedRowId: number) => {
        return userCardIds.indexOf(selectedRowId) !== -1;
    };

    const handleSelectAll = () => {
        if (!allSelected && !userCardIds.length) {
            setUserCardIds(userCards$.data.map((userCard: UserCardEntity) => userCard.id));
            setAllSelected(true);
            return;
        }
        setUserCardIds([]);
        setAllSelected(false);
    };

    const handleAllAndCancel = () => {
        if (userCardIds.length) {
            setUserCardIds([]);
            setAllSelected(false);
        }
        setDisplaySelectButtons(!displaySelectButtons);
    };

    function handleOnClick() {
        ReactGA.event({
            category: EventCategories.Submissions,
            action: SubmissionEvents.initiated,
        });
        googleTagManager({ event: 'google-ads-started-submission-process' });
        navigate('/submissions/new');
    }

    const handleClose = useCallback(() => {
        setUserCardIds([]);
        setAllSelected(false);
        setShowTransferDialog(false);
        setDisplaySelectButtons(false);
    }, []);

    const handleTransferOneOwnerShip = useCallback((id) => {
        setUserCardIds([id]);
        setShowTransferDialog(true);
    }, []);

    const handleSubmit = useCallback(
        async (user: UserEntity) => {
            setShowTransferDialog(false);
            let confirmation = false;
            confirmation = await confirm({
                title: 'Are you sure you want to transfer ownership?',
                message:
                    'Once you transfer ownership of these cards, they will instantly be transferred to the user you selected. They will no longer be visible on your account. The only way for them to be restored to your account is for the recipient to transfer ownership back to you.',
                confirmText: 'CONFIRM TRANSFER',
                confirmButtonProps: {
                    variant: 'contained',
                    sx: {
                        margin: '20px',
                        padding: '10px',
                    },
                },
                cancelButtonProps: {
                    sx: {
                        color: 'black',
                    },
                },
                dialogProps: {
                    maxWidth: 'sm',
                },
            });
            if (confirmation) {
                dispatch(
                    changeUserCardOwnerShip({
                        userCardIds: userCardIds,
                        userId: user.id,
                    }),
                );
                console.log('confirm');
                return;
            }
            console.log('cancel');
            setAllSelected(false);
            setUserCardIds([]);
        },
        [confirm, dispatch, userCardIds],
    );

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
                selectedIds={userCardIds}
                handleTransferOwnerShip={handleTransferOneOwnerShip}
                CheckBox={
                    <IconButton className={classes.checkBoxIcon} size="large">
                        <Checkbox
                            className={classes.checkBox}
                            onClick={() => handleSelectClick(userCard.id)}
                            checked={isSelected(userCard.id)}
                        />
                    </IconButton>
                }
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
            <TransferCardsDialog
                handleSubmit={handleSubmit}
                selectedUserCardIds={userCardIds}
                userCards={userCards$.data}
                open={showTransferDialog}
                onClose={handleClose}
            />

            <Box display={'flex'} alignItems={'center'} width={'100%'} paddingBottom={4}>
                {!displaySelectButtons ? (
                    !isSm ? (
                        <Typography variant={'subtitle2'}>{items$.length} Graded Cards</Typography>
                    ) : null
                ) : (
                    <>
                        <IconButton size="large">
                            <Checkbox
                                sx={{ margin: 0, padding: 0 }}
                                onClick={handleSelectAll}
                                checked={allSelected}
                                indeterminate={userCardIds.length > 0}
                            />
                        </IconButton>
                        <Typography variant={'subtitle2'}>
                            {!userCardIds.length
                                ? 'Select all cards on this page - '
                                : `${userCardIds.length} Cards Selected - `}
                        </Typography>
                        <TextLink
                            sx={{ color: 'black', marginLeft: 1 }}
                            component={'button'}
                            variant="body2"
                            onClick={handleSelectAll}
                        >
                            {userCardIds.length ? ' Unselect All' : ' Select All'}
                        </TextLink>
                    </>
                )}
                <Grid container item xs alignItems={'center'} justifyContent={isSm ? 'flex-start' : 'flex-end'}>
                    {items$.length && (
                        <Button
                            onClick={handleAllAndCancel}
                            sx={{ borderRadius: 24, padding: '10px 15px 10px 15px' }}
                            color={'primary'}
                            variant={'outlined'}
                            startIcon={!displaySelectButtons ? <LibraryAddCheckOutlinedIcon /> : null}
                        >
                            {!displaySelectButtons ? 'Select Cards' : 'Cancel'}
                        </Button>
                    )}
                    {userCardIds.length ? (
                        <Button
                            onClick={() => setShowTransferDialog(true)}
                            sx={{ marginLeft: '10px', borderRadius: 24, padding: '10px 15px 10px 15px' }}
                            color={'primary'}
                            variant={'contained'}
                        >
                            TRANSFER OWNERSHIP
                        </Button>
                    ) : null}
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
