import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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
import algoliaSearch from 'algoliasearch';
import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '@shared/assets/logo2.svg';
import { AddedSubmissionCards } from '@shared/components/NewSubmission/AddedSubmissionCards';
import { ApplyPromoCode } from '@shared/components/NewSubmission/ApplyPromoCode';
import { CardsSearchResults } from '@shared/components/NewSubmission/CardsSearchResults';
import { ShippingMethods } from '@shared/components/NewSubmission/ShippingMethods';
import { EventCategories, ServiceLevelEvents } from '@shared/constants/GAEventsTypes';
import { useConfiguration } from '@shared/hooks/useConfiguration';
import { cx } from '@shared/lib/utils/cx';
import {
    getCustomer,
    getPaymentMethod,
    getSavedAddresses,
    getServiceLevels,
    setPayNow,
    setServiceLevel,
    updatePaymentMethod,
    updatePaymentMethodId,
} from '@shared/redux/slices/adminCreateOrderSlice';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
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
    '.MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
    },
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
    }),
    { name: 'ExistingAddressComponent' },
);

export function CreateSubmission() {
    const dispatch = useAppDispatch();
    const [createSubmission, setCreateSubmission] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const selectedCards = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.selectedCards);
    const searchValue = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.searchValue);
    const serviceLevels = useAppSelector((state) => state.adminCreateOrderSlice.step01Data.availableServiceLevels);
    const payNow = useAppSelector((state) => state.adminCreateOrderSlice.payNow);
    const { customerId } = useParams<'customerId'>();
    const customer = useAppSelector((state) => state.adminCreateOrderSlice.user);
    const classes = useStyles({});
    const paymentMethod = useAppSelector((state) => state.adminCreateOrderSlice.step04Data.paymentMethod);
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await dispatch(getCustomer(Number(customerId)));
            await dispatch(getPaymentMethod());
            await dispatch(getServiceLevels());
            await dispatch(getSavedAddresses(Number(customerId)));
            setIsLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleServiceLevel = (serviceLevelId: number) => {
        const selectedServiceLevel = serviceLevels.filter((item) => item?.id === Number(serviceLevelId));
        const level = {
            id: selectedServiceLevel[0].id,
            price: selectedServiceLevel[0].price,
            turnaround: selectedServiceLevel[0].turnaround,
            type: selectedServiceLevel[0].type,
            maxProtectionAmount: selectedServiceLevel[0].maxProtectionAmount,
        };

        dispatch(setServiceLevel(level));

        ReactGA.event({
            category: EventCategories.ServiceLevels,
            action: ServiceLevelEvents.pressed,
            dimension1: 'Level',
            metric1: level.id,
        });
    };

    const handleClose = () => {
        const { from } = state;
        if (from === 'submission') {
            navigate('/submissions/all/list');
        } else {
            navigate(-1);
        }
    };

    const handlePayNow = (payNow: boolean) => {
        dispatch(updatePaymentMethodId(paymentMethod.id));
        dispatch(updatePaymentMethod(paymentMethod));
        dispatch(setPayNow(payNow));
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

    return (
        <>
            {isLoading ? (
                <Box p={4} display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <SelectAndCreateCustomerDialog
                        sx={{ backgroundColor: '#949494' }}
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
                        p={2}
                    >
                        {' '}
                        <img src={Logo} alt={'Robograding'} />{' '}
                        <Typography ml={2} fontWeight={500} variant={'h5'}>
                            Create Submission
                        </Typography>
                        <Grid sx={{ marginLeft: 'auto' }}>
                            <IconButton onClick={handleClose} sx={{ color: '#0000008A' }} size="large">
                                <CloseIcon sx={{ fontSize: '32px' }} />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Grid flexDirection={'row'} justifyContent={'center'} item container sx={{ background: '#FFFFFF' }}>
                        <Grid md={8}>
                            <div>
                                <Grid item p={2} m={1}>
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
                                <Grid container p={2} wrap={'nowrap'}>
                                    <Grid
                                        md={6}
                                        m={1}
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
                                                    {customer.getInitials?.()}
                                                </Avatar>
                                            </Grid>
                                            <Grid ml={1}>
                                                <Typography sx={{ fontSize: '14px' }}>{customer.fullName}</Typography>
                                                <Typography color={'#0000008A'} sx={{ fontSize: '14px' }}>
                                                    {customer.customerNumber}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        md={6}
                                        p={2}
                                        m={1}
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
                                                    defaultValue={serviceLevels[0]?.id}
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
                                                                <span> {`$${item?.price} / Card`} &nbsp;</span>
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
                                    m={3}
                                    border={'1px solid #E0E0E0'}
                                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                >
                                    <Typography ml={2.5} sx={{ fontSize: '20px', fontWeight: 500 }} m={2.5}>
                                        Shipping Details
                                    </Typography>
                                    <Divider />
                                    <ShippingMethods />
                                </Grid>
                                <Grid
                                    m={3}
                                    mt={2}
                                    border={'1px solid #E0E0E0'}
                                    sx={{ background: '#FFFFFF', borderRadius: '4px' }}
                                >
                                    <Typography sx={{ fontSize: '20px', fontWeight: 500 }} m={2.5}>
                                        Payment Info
                                    </Typography>
                                    <Divider />
                                    <Grid mt={3}>
                                        <Typography ml={2.5} sx={{ fontSize: '16px', fontWeight: 500 }}>
                                            Pay Now or Later?
                                        </Typography>
                                        <Grid display={'flex'} wrap={'nowrap'} m={2.5}>
                                            <Grid md={6} px={1}>
                                                <Root
                                                    className={cx({ payNow })}
                                                    onClick={() => handlePayNow(true)}
                                                    style={{
                                                        border: payNow ? '3px solid #20BFB8' : '1px solid #DDDDDD',
                                                    }}
                                                >
                                                    <Radio onClick={() => handlePayNow(true)} checked={payNow} />
                                                    <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                                        Pay Now
                                                    </Typography>
                                                </Root>
                                            </Grid>
                                            <Grid md={6} px={1}>
                                                <Root
                                                    className={cx({ payNow })}
                                                    onClick={() => handlePayNow(false)}
                                                    style={{
                                                        border: !payNow ? '3px solid #20BFB8' : '1px solid #DDDDDD',
                                                    }}
                                                >
                                                    <Radio onClick={() => handlePayNow(false)} checked={!payNow} />
                                                    <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                                        Pay Later
                                                    </Typography>
                                                </Root>
                                            </Grid>
                                        </Grid>
                                        <Divider className={classes.borderMargin} />

                                        <Grid p={2}>
                                            <Typography ml={1} sx={{ fontSize: '16px', fontWeight: 500 }}>
                                                {' '}
                                                Add a Promo Code{' '}
                                            </Typography>
                                            <ApplyPromoCode />
                                        </Grid>

                                        <Divider className={classes.borderMargin} />
                                        <Grid display={'flex'} wrap={'nowrap'} m={2.5}>
                                            <Grid md={6} mb={2}>
                                                <Typography mb={2} sx={{ fontSize: '16px', fontWeight: 500 }}>
                                                    Payment Method
                                                </Typography>
                                                <Root className={cx({})}>
                                                    <Radio color="primary" checked={payNow} />
                                                    <AttachMoneyIcon sx={{ color: '#0000008A' }} />
                                                    <Typography ml={1} variant={'subtitle1'} fontWeight={500}>
                                                        Manual Payment
                                                    </Typography>
                                                </Root>
                                            </Grid>
                                        </Grid>
                                        <Divider className={classes.borderMargin} />
                                        <Grid m={2.5}>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                                                Manual Payment
                                            </Typography>
                                            <Typography mt={1.5} variant={'body2'}>
                                                Use manual payment for submissions that have been paid in cash or on a
                                                separate platform.
                                            </Typography>
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
