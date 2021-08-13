import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    orderReviewSection: {
        marginTop: '32px',
        padding: '20px 22px 32px 16px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderDetailItemBody: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
    },
    orderDetailItemContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    orderDetailItemTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderDetailItemTitle: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
    },
    darkBodyText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    greyBodyText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    orderDetailEditBtn: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        marginLeft: '12px',
        color: '#20BFB8',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    orderItemsColumn: {
        display: 'flex',
        flexDirection: 'column',
    },
    cardDetailsContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    cardIconContainer: {
        display: 'flex',
        marginRight: '12px',
    },
    cardTextDetails: {
        display: 'flex',
        flexDirection: 'column',
    },
});

export default useStyles;
