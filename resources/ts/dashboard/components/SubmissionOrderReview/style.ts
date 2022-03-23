import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    orderReviewSection: {
        marginTop: '32px',
        padding: '20px 22px 0px 16px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
    },
    orderDetailItemBody: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
        overflowWrap: 'break-word',
    },
    orderDetailItemContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginBottom: '24px',
    },
    orderDetailItemTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
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
        maxWidth: '180px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%',
        },
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
}));

export default useStyles;
