import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
    {
        cardsListContainer: {
            padding: '12px',
            maxHeight: '250px',
            overflow: 'scroll',
        },
        cardForm: {
            iconStyle: 'solid',
            style: {
                base: {
                    iconColor: '#c4f0ff',
                    color: '#fff',
                    fontWeight: 500,
                    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                    fontSize: '16px',
                    fontSmoothing: 'antialiased',

                    ':-webkit-autofill': {
                        color: '#fce883',
                    },
                    '::placeholder': {
                        color: '#87BBFD',
                    },
                },
                invalid: {
                    iconColor: '#FFC7EE',
                    color: '#FFC7EE',
                },
            },
        },
        missingStripeCardsContainer: {
            width: '100%',
            height: '220px',
            display: 'flex',
            flexDirection: 'column',
        },
        newCardFormContainer: {
            width: '550px',
        },
        cardsListTitle: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '24px',
            letterSpacing: '0.1px',
            color: 'rgba(0, 0, 0, 0.87)',
            marginBottom: '24px',
        },
        addNewCardItemContainer: {
            width: '100%',
            height: '40px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        loadingContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        firstTimeCardContainer: {
            width: '100%',
            backgroundColor: '#f9f9f9',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            borderRadius: '12px',
        },
        addCardBtn: {
            marginTop: '12px',
        },
    },
    { name: 'PaymentFormStyles' },
);

export default useStyles;
