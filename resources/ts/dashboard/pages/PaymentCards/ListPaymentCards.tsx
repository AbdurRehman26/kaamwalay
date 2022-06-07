import AddCardOutlined from '@mui/icons-material/AddCardOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { useInjectable } from '@shared/hooks/useInjectable';
import { useNotifications } from '@shared/hooks/useNotifications';
import { APIService } from '@shared/services/APIService';
import { ListHeader } from '@dashboard/components/ListHeader/ListHeader';
import AddPaymentCardDialog from '@dashboard/components/PaymentCard/AddPaymentCardDialog';
import PaymentCardItem from '@dashboard/components/PaymentCard/PaymentCardItem';
import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';
import { saveStripeCustomerCards } from '@dashboard/redux/slices/newSubmissionSlice';

const useStyles = makeStyles(
    (theme) => ({
        newAddBtn: {
            borderRadius: 24,
            padding: '12px 24px',
            [theme.breakpoints.down('sm')]: {
                marginLeft: 'auto',
                padding: '9px 16px',
            },
        },
        paymentCards: {
            marginTop: '5%',
            width: '100%',
        },
    }),
    {
        name: 'ListPaymentCards',
    },
);

export function ListPaymentCards() {
    const classes = useStyles();
    const apiService = useInjectable(APIService);
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const [isCardsListLoading, setIsCardsListLoading] = useState(false);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const dispatch = useAppDispatch();
    const existingCustomerStripeCards = useAppSelector((state) => state.newSubmission.step04Data.existingCreditCards);
    let cardsListElement;

    const notifications = useNotifications();

    const loadExistingStripeCards = async () => {
        const endpoint = apiService.createEndpoint('customer/payment-cards');
        try {
            setIsCardsListLoading(true);
            const existingStripeCardsForCustomer = await endpoint.get('');

            const formattedStripeCards = existingStripeCardsForCustomer.data?.map((item: any) => {
                return {
                    expMonth: item.card.expMonth,
                    expYear: item.card.expYear,
                    last4: item.card.last4,
                    brand: item.card.brand,
                    id: item.id,
                };
            });

            if (existingStripeCardsForCustomer?.data?.length === 0) {
                dispatch(saveStripeCustomerCards([]));
            } else {
                dispatch(saveStripeCustomerCards(formattedStripeCards));
            }
            setIsCardsListLoading(false);
            setShowAddCardModal(false);
        } catch (error: any) {
            setIsCardsListLoading(false);
            if (error.response?.status !== 401) {
                notifications.error("We weren't able to get your existing cards", 'Error');
            }
        }
    };

    useEffect(
        () => {
            // noinspection JSIgnoredPromiseFromCall
            loadExistingStripeCards();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleCardDeleteSubmit = async (id: string) => {
        const endpoint = apiService.createEndpoint(`customer/payment-cards/${id}`);
        try {
            await endpoint.delete('');
            await loadExistingStripeCards();
        } catch (error: any) {
            setIsCardsListLoading(false);
            if (error.response?.status !== 401) {
                notifications.error("We weren't able to delete your card. Please try again later.", 'Error');
            }
        }
    };

    const $newCard = (
        <Button
            onClick={() => setShowAddCardModal(true)}
            variant={'contained'}
            color={'primary'}
            className={classes.newAddBtn}
        >
            Add a Card
        </Button>
    );

    if (isCardsListLoading) {
        return (
            <Box padding={4} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isCardsListLoading && !existingCustomerStripeCards?.length) {
        cardsListElement = (
            <Grid item xs={12} sm={12} order={{ xs: 2, sm: 1 }}>
                <Paper variant={'outlined'} sx={{ width: '100%', backgroundColor: '#F9F9F9', borderRadius: '10px' }}>
                    <Stack p={3} alignItems={'center'} justifyContent={'center'}>
                        <AddCardOutlined />
                        <Typography mt={1} variant={'subtitle1'} fontWeight={700}>
                            No Saved Cards
                        </Typography>
                        <Typography variant={'caption'} color={'textSecondary'} align={'center'}>
                            You have no saved cards.
                        </Typography>
                        <Typography variant={'caption'} color={'textSecondary'} align={'center'}>
                            Click 'Add A Card' to add one.
                        </Typography>
                    </Stack>
                </Paper>
            </Grid>
        );
    }

    if (existingCustomerStripeCards?.length) {
        cardsListElement = existingCustomerStripeCards?.map((item: any) => (
            <PaymentCardItem key={item.id} {...item} handleCardDeleteSubmit={handleCardDeleteSubmit} />
        ));
    }

    return (
        <>
            <ListHeader headline={'Save Credit Cards'} noMargin noSearch actions={isMobile ? $newCard : null}>
                {!isMobile ? $newCard : null}
            </ListHeader>

            <div className={classes.paymentCards}>{cardsListElement}</div>

            <AddPaymentCardDialog
                open={showAddCardModal}
                onClose={() => setShowAddCardModal(false)}
                onSubmit={() => loadExistingStripeCards()}
            />
        </>
    );
}
