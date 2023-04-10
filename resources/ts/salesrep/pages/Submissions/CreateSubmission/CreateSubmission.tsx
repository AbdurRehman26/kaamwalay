import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { AddedSubmissionCards } from '@salesrep/components/NewSubmission/AddedSubmissionCards';
import { ApplyPromoCode } from '@salesrep/components/NewSubmission/ApplyPromoCode';
import { CardsSearchResults } from '@salesrep/components/NewSubmission/CardsSearchResults';
import { ShippingMethods } from '@salesrep/components/NewSubmission/ShippingMethods';
import { useAppDispatch, useAppSelector } from '@salesrep/redux/hooks';
import algoliaSearch from 'algoliasearch';
import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CleaningFee from '@shared/components/CleaningFee';
import { EventCategories, ServiceLevelEvents } from '@shared/constants/GAEventsTypes';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { useSidebarHidden } from '@shared/hooks/useSidebarHidden';
import { nameInitials } from '@shared/lib/strings/initials';
import {
    clearSubmissionState,
    getCustomer,
    getPaymentMethod,
    getSavedAddresses,
    getServiceLevels,
    setIsCouponApplied,
    setRequiresCleaning,
    setServiceLevel,
} from '@shared/redux/slices/salesRepCreateOrderSlice';
import { SelectAndCreateCustomerDialog } from '../CreateSubmission/SelectAndCreateCustomerDialog';
import { CardSubmissionSearchField } from './CardSubmissionSearchField';

const Root = styled(ButtonBase)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start !important',
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: 2,
    padding: theme.spacing(1),
    '&.selected': {
        '.MuiSvgIcon-root': {
            color: theme.palette.primary.main,
        },
    },
}));

const useStyles = makeStyles(
    (theme) => ({
        borderMargin: {
            marginLeft: '20px',
            marginRight: '20px',
        },
        parent: {
            overflowY: 'scroll',
            height: '100vh',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
    }),
    { name: 'ExistingAddressComponent' },
);

interface LocationState {
    from: string;
}

export function CreateSubmission() {
    const dispatch = useAppDispatch();
    const [createSubmission, setCreateSubmission] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const selectedCards = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.selectedCards);
    const searchValue = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.searchValue);
    const serviceLevels = useAppSelector((state) => state.salesRepCreateOrderSlice.step01Data.availableServiceLevels);
    const requiresCleaning = useAppSelector((state) => state.salesRepCreateOrderSlice.step02Data.requiresCleaning);
    const selectedServiceLevel = useAppSelector(
        (state) => state.salesRepCreateOrderSlice.step01Data.selectedServiceLevel,
    );
    const { customerId } = useParams<'customerId'>();
    const customer = useAppSelector((state) => state.salesRepCreateOrderSlice.user);
    const classes = useStyles({});
    const navigate = useNavigate();
    const { state } = useLocation();
    useSidebarHidden();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await dispatch(getCustomer(Number(customerId)));
            await dispatch(getPaymentMethod());
            await dispatch(getServiceLevels());
            await dispatch(getSavedAddresses(Number(customerId)));
            setIsLoading(false);
        })();
    }, [customerId, dispatch]);

    const handleServiceLevel = (serviceLevelId: number) => {
        const selectedServiceLevel = serviceLevels.filter((item) => item?.id === Number(serviceLevelId));
        const level = {
            id: selectedServiceLevel[0].id,
            price: selectedServiceLevel[0].price,
            turnaround: selectedServiceLevel[0].turnaround,
            type: selectedServiceLevel[0].type,
            maxProtectionAmount: selectedServiceLevel[0].maxProtectionAmount,
            minPrice: selectedServiceLevel[0].minPrice,
            maxPrice: selectedServiceLevel[0].maxPrice,
            priceRanges: selectedServiceLevel[0].priceRanges,
        };

        dispatch(setServiceLevel(level));
        dispatch(setIsCouponApplied(false));

        ReactGA.event({
            category: EventCategories.ServiceLevels,
            action: ServiceLevelEvents.pressed,
            dimension1: 'Level',
            metric1: level.id,
        });
    };

    const handleClose = () => {
        const { from } = state as LocationState;
        dispatch(clearSubmissionState());
        if (from === 'submission') {
            navigate('/submissions/all/list');
        } else {
            navigate(-1);
        }
    };

    function getMaxProtectionAmount(maxProtectionAmount: any) {
        const formattedMaxProtectionAmount =
            maxProtectionAmount >= 1000000
                ? Intl.NumberFormat('en-GB', { notation: 'compact', compactDisplay: 'short' }).format(
                      maxProtectionAmount,
                  )
                : maxProtectionAmount;

        return formattedMaxProtectionAmount;
    }

    const { appEnv, algoliaAppId, algoliaPublicKey, searchCardCategoriesCustomer } = useConfiguration();

    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );

    const dispatchRequiresCleaning = setRequiresCleaning(!requiresCleaning);

    return (
        <>
            {isLoading ? (
                <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <SelectAndCreateCustomerDialog
                        btnText={'Create a new Customer'}
                        changeCustomer={true}
                        onClose={() => setCreateSubmission(false)}
                        open={createSubmission}
                    />
                    <Grid
                        sx={{ borderBottom: '1px solid #E0E0E0' }}
                        container
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        p={1}
                    >
                        <Typography ml={2} fontWeight={500} variant={'h5'}>
                            Create Submission
                        </Typography>
                        <Grid sx={{ marginLeft: 'auto' }}>
                            <IconButton onClick={handleClose} sx={{ color: '#0000008A' }} size="large">
                                <CloseIcon sx={{ fontSize: '32px' }} />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Grid
                        flexDirection={'row'}
                        justifyContent={'center'}
                        item
                        container
                        sx={{ background: '#FFFFFF' }}
                        mb={3}
                    >
                        <Grid md={selectedCards.length > 0 ? 8 : 12}>
                            <div className={classes.parent}>
                                <Grid
                                    item
                                    py={3}
                                    px={selectedCards.length > 0 ? 2 : 0}
                                    m={selectedCards.length > 0 ? 1 : 'auto'}
                                    md={selectedCards.length > 0 ? 12 : 8}
                                >
                                    <InstantSearch searchClient={searchClient} indexName={`${appEnv}_card_products`}>
                                        <CardSubmissionSearchField />
                                        {searchValue !== '' ? <CardsSearchResults /> : null}
                                        {searchCardCategoriesCustomer ? (
                                            <Configure
                                                hitsPerPage={20}
                                                filters={`card_category_name:${searchCardCategoriesCustomer.replace(
                                                    /,/g,
                                                    ' OR card_category_name:',
                                                )}`}
                                            />
                                        ) : (
                                            <Configure hitsPerPage={20} />
                                        )}
                                    </InstantSearch>
                                </Grid>
                                <Divider />
                                <Grid
                                    container
                                    pt={3}
                                    px={selectedCards.length > 0 ? 2 : 0}
                                    md={selectedCards.length > 0 ? 12 : 8}
                                    m={'auto'}
                                    wrap={'nowrap'}
                                >
                                    <Grid
                                        md={6}
                                        mr={1}
                                        ml={selectedCards.length > 0 ? 1 : 0}
                                        my={1}
                                        p={2}
                                        border={'1px solid #E0E0E0'}
                                        sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                    >
                                        <Grid container item justifyContent={'space-between'} alignItems={'center'}>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#000000DE' }}>
                                                Customer
                                            </Typography>
                                            <Grid>
                                                <Button
                                                    onClick={() => setCreateSubmission(true)}
                                                    variant={'text'}
                                                    size={'medium'}
                                                >
                                                    Change Customer
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid display={'flex'} mt={1} alignItems={'center'}>
                                            <Grid display={'flex'}>
                                                <Avatar
                                                    src={customer.profileImage ?? ''}
                                                    sx={{ height: '56px', width: '56px' }}
                                                >
                                                    {nameInitials(
                                                        customer.fullName ??
                                                            `${customer.firstName ?? ''} ${
                                                                customer.lastName ?? ''
                                                            }`.trim(),
                                                    )}
                                                </Avatar>
                                            </Grid>
                                            <Grid ml={1}>
                                                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                                                    {customer.fullName}
                                                </Typography>
                                                <Typography color={'#0000008A'} sx={{ fontSize: '14px' }}>
                                                    Customer ID: {customer.customerNumber}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        md={6}
                                        p={2}
                                        mr={selectedCards.length > 0 ? 1 : 0}
                                        ml={1}
                                        my={1}
                                        border={'1px solid #E0E0E0'}
                                        sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                    >
                                        <Grid container item justifyContent={'space-between'}>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#000000DE' }}>
                                                Service Level
                                            </Typography>
                                        </Grid>
                                        <Grid display={'flex'} mt={1} alignItems={'center'}>
                                            <Grid mt={2} width={'100%'}>
                                                <Select
                                                    fullWidth
                                                    defaultValue={selectedServiceLevel?.id}
                                                    open={openDropDown}
                                                    onOpen={() => setOpenDropDown(true)}
                                                    onClose={() => setOpenDropDown(false)}
                                                    placeholder={'Service Level'}
                                                    key={serviceLevels[0]?.id}
                                                    onChange={(e: any) => handleServiceLevel(e.target.value)}
                                                >
                                                    {serviceLevels.map((item) => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            <div style={{ display: 'flex', fontSize: '14px' }}>
                                                                <span style={{ fontWeight: 500 }}>
                                                                    {' '}
                                                                    {`$${item?.minPrice} - ${item?.maxPrice} / Card`}{' '}
                                                                    &nbsp;
                                                                </span>
                                                                <span style={{ color: '#0000008A' }}>
                                                                    {' '}
                                                                    {`(Up to $${getMaxProtectionAmount(
                                                                        item.maxProtectionAmount,
                                                                    )} | ${item.turnaround}) `}{' '}
                                                                </span>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    md={selectedCards.length > 0 ? 12 : 8}
                                    m={selectedCards.length > 0 ? 3 : 'auto'}
                                    mt={3}
                                    border={'1px solid #E0E0E0'}
                                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                >
                                    <CleaningFee
                                        requiresCleaning={requiresCleaning}
                                        setRequiresCleaning={dispatchRequiresCleaning}
                                    />
                                </Grid>
                                <Grid
                                    md={selectedCards.length > 0 ? 12 : 8}
                                    m={selectedCards.length > 0 ? 3 : 'auto'}
                                    mt={2}
                                    border={'1px solid #E0E0E0'}
                                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                >
                                    <Typography m={2} ml={3} sx={{ fontSize: '20px', fontWeight: 500 }}>
                                        Shipping Details
                                    </Typography>
                                    <Divider />
                                    <ShippingMethods />
                                </Grid>
                                <Grid
                                    md={selectedCards.length > 0 ? 12 : 8}
                                    m={selectedCards.length > 0 ? 3 : 'auto'}
                                    mt={2}
                                    border={'1px solid #E0E0E0'}
                                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                >
                                    <Typography sx={{ fontSize: '20px', fontWeight: 500 }} m={2} ml={3}>
                                        Payment Info
                                    </Typography>
                                    <Divider />
                                    <Grid mt={3.5}>
                                        <Typography ml={2.5} sx={{ fontSize: '16px', fontWeight: 500 }}>
                                            Pay Now or Later?
                                        </Typography>
                                        <Grid display={'flex'} wrap={'nowrap'} mx={1.5} mt={1.5} mb={4}>
                                            <Grid md={6} pl={1.25} pr={1}>
                                                <Root
                                                    style={{
                                                        border: '3px solid #20BFB8',
                                                    }}
                                                >
                                                    <Radio checked={true} />
                                                    <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                                        Pay Later
                                                    </Typography>
                                                </Root>
                                            </Grid>
                                        </Grid>
                                        <Divider className={classes.borderMargin} />

                                        <Grid p={2} pt={3.5} pb={2.75}>
                                            <Typography ml={1} sx={{ fontSize: '16px', fontWeight: 500 }} mb={1.5}>
                                                {' '}
                                                Add a Promo Code{' '}
                                            </Typography>
                                            <ApplyPromoCode />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        {selectedCards.length > 0 ? (
                            <Grid md={4}>
                                <AddedSubmissionCards />
                            </Grid>
                        ) : null}
                    </Grid>
                </>
            )}
        </>
    );
}

export default CreateSubmission;
