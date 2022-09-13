import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import algoliaSearch from 'algoliasearch';
import React, { useEffect, useMemo } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import Logo from '@shared/assets/logo2.svg';
import { AddedSubmissionCards } from '@shared/components/NewSubmission/AddedSubmissionCards';
import { ApplyPromoCode } from '@shared/components/NewSubmission/ApplyPromoCode';
import { CardsSearchResults } from '@shared/components/NewSubmission/CardsSearchResults';
import { ShippingMethods } from '@shared/components/NewSubmission/ShippingMethods';
import { useConfiguration } from '@shared/hooks/useConfiguration';
// import Alert from '@mui/material/Alert';
import { cx } from '@shared/lib/utils/cx';
import { getServiceLevels } from '@shared/redux/slices/adminCreateOrderSlice';
import { useAppDispatch, useAppSelector } from '@admin/redux/hooks';
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

export function CreateSubmission() {
    const dispatch = useAppDispatch();
    const selectedCards = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.selectedCards);
    const searchValue = useAppSelector((state) => state.adminCreateOrderSlice.step02Data.searchValue);
    const serviceLevels = useAppSelector((state) => state.adminCreateOrderSlice.step01Data.availableServiceLevels);

    useEffect(() => {
        dispatch(getServiceLevels());
    }, [dispatch]);

    const { appEnv, algoliaAppId, algoliaPublicKey, searchCardCategoriesCustomer } = useConfiguration();

    const searchClient = useMemo(
        () => algoliaSearch(algoliaAppId!, algoliaPublicKey!),
        [algoliaAppId, algoliaPublicKey],
    );

    return (
        <>
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
                    <IconButton sx={{ color: '#0000008A' }} size="large">
                        <CloseIcon sx={{ fontSize: '28px' }} />
                    </IconButton>
                </Grid>
            </Grid>

            {/* <CardSubmissionSearchField /> */}
            <Grid flexDirection={'row'} justifyContent={'center'} item container sx={{ background: '#FFFFFF' }}>
                {/* <Divider /> */}
                <Grid md={8}>
                    <Grid item p={2}>
                        <InstantSearch searchClient={searchClient} indexName={`${appEnv}_card_products`}>
                            {/* {isMobile ? <CardsSearchMobileModal /> : null} */}
                            <CardSubmissionSearchField />
                            {searchValue !== '' ? <CardsSearchResults /> : null}
                            {/* {!areSelectedCardsValuesValid() ? (
                        <>
                            <Alert severity="error" >
                                Card's value can't be higher than the protection level.
                            </Alert>
                            <Alert severity={'info'}>
                                You can easily upgrade your service level by&nbsp;
                                <Link href={''} >
                                    clicking here
                                </Link>
                                .
                            </Alert>
                        </>
                    ) : null} */}
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
                    {/* <Divider /> */}
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
                                    <Button variant={'text'} size={'medium'}>
                                        Change Customer
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid display={'flex'} mt={1} alignItems={'center'}>
                                <Grid display={'flex'}>
                                    <Avatar sx={{ height: '56px', width: '56px' }} />
                                </Grid>
                                <Grid ml={1}>
                                    <Typography sx={{ fontSize: '14px' }}>Name</Typography>
                                    <Typography color={'#0000008A'} sx={{ fontSize: '14px' }}>
                                        Customer Id:
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
                                <Grid>
                                    <Select
                                        fullWidth
                                        native
                                        placeholder={'Select Service Level'}
                                        variant={'outlined'}
                                        style={{ height: '43px', marginTop: 6 }}
                                    >
                                        <option value="none">Select service level</option>
                                        {serviceLevels.map((item: any) => (
                                            <option key={item.id} value={item.id}>
                                                {item?.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid m={3} border={'1px solid #E0E0E0'} sx={{ background: '#FFFFFF', borderRadius: '4px' }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 500 }} m={2}>
                            Shipping Details
                        </Typography>
                        <ShippingMethods />
                    </Grid>
                    <Grid m={3} mt={2} border={'1px solid #E0E0E0'} sx={{ background: '#FFFFFF', borderRadius: '4px' }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 500 }} m={2}>
                            Payment Info
                        </Typography>
                        <Divider />
                        <Grid mt={3}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 500 }} m={2}>
                                Pay Now or Later?
                            </Typography>
                            <Grid display={'flex'} wrap={'nowrap'} mb={2}>
                                <Grid m={1} md={6}>
                                    <Root className={cx({})}>
                                        <Radio />
                                        <Typography ml={1} variant={'subtitle1'} fontWeight={500} color={'primary'}>
                                            Pay Now
                                        </Typography>
                                    </Root>
                                </Grid>
                                <Grid m={1} md={6}>
                                    <Root className={cx({})}>
                                        <Radio />
                                        <Typography ml={1} variant={'subtitle1'} fontWeight={500} color={'primary'}>
                                            Pay Later
                                        </Typography>
                                    </Root>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid p={2}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}> Add a Promo Code </Typography>
                                <ApplyPromoCode />
                            </Grid>
                            {/* <div>
                    </div> */}
                            <Divider />
                            <Grid display={'flex'} wrap={'nowrap'} mt={2}>
                                <Grid m={1} md={6} mb={2}>
                                    <Typography mb={2} sx={{ fontSize: '16px', fontWeight: 500 }}>
                                        Payment Method
                                    </Typography>
                                    <Root className={cx({})}>
                                        <Radio />
                                        <Typography ml={1} variant={'subtitle1'} fontWeight={500} color={'primary'}>
                                            Manual Payment
                                        </Typography>
                                    </Root>
                                </Grid>
                            </Grid>
                            <Divider />
                            <Grid m={2}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Manual Payment</Typography>
                                <Typography variant={'body2'}>
                                    Use manual payment for submissions that have been paid in cash or on a separate
                                    platform.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {selectedCards.length > 0 ? (
                    <Grid md={4}>
                        <AddedSubmissionCards />
                    </Grid>
                ) : null}
            </Grid>
        </>
    );
}

export default CreateSubmission;
