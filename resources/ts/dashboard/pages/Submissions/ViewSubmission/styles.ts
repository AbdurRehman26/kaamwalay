import { makeStyles } from '@material-ui/core/styles';

export const useViewSubmissionHeaderStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(2.5, 0),
        },
        button: {
            marginLeft: 8,
        },
    }),
    {
        name: 'ViewSubmissionHeader',
    },
);

export const useViewSubmissionStatusStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(2.5),
        },
        fontMedium: {
            fontWeight: 500,
        },
        textGutter: {
            marginBottom: 2,
        },
    }),
    {
        name: 'ViewSubmissionStatus',
    },
);

export const useViewSubmissionStatusBarStyles = makeStyles(
    (theme) => ({
        root: {
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 24,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            margin: theme.spacing(2.5, 0),
            '& $itemHolder': {
                '&:last-child > $item:after': {
                    borderColor: '#e0e0e0',
                },
                '&:last-child > $itemActive:after': {
                    borderColor: `${theme.palette.primary.main} !important`,
                },
                '&:first-child > $item:before': {
                    borderLeftColor: '#e0e0e0',
                },
                '&:first-child > $itemActive:before': {
                    borderLeftColor: `${theme.palette.primary.main} !important`,
                },
            },
        },
        item: {
            width: '100%',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            backgroundColor: '#e0e0e0',

            '&:after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                border: '24px solid transparent',
                borderLeftColor: '#e0e0e0',
                right: -48,
            },
            '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                border: '24px solid #e0e0e0',
                borderLeftColor: 'transparent',
                left: -24,
            },
        },
        label: {
            fontWeight: 500,
        },
        itemActive: {
            backgroundColor: theme.palette.primary.main,
            '&:after, &:before': {
                borderLeftColor: theme.palette.primary.main,
            },
            '&:before': {
                borderColor: theme.palette.primary.main,
                borderLeftColor: 'transparent',
            },
            '& $label': {
                color: theme.palette.primary.contrastText,
            },
        },

        itemHolder: ({ itemWidth }: { itemWidth: number }) => ({
            width: `${itemWidth}%`,
            padding: theme.spacing(0, 2),
        }),
    }),
    {
        name: 'ViewSubmissionStatusBar',
    },
);

export const useViewSubmissionInformationStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(2, 0),
            '& .table-info td, & .table-info th': {
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 0,
                border: 'none',
            },
        },
    }),
    {
        name: 'ViewSubmissionInformation',
    },
);

export const useViewSubmissionBillingStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(2, 0),
        },
        paymentAvatar: {
            width: 52,
            height: 52,
        },
    }),
    {
        name: 'ViewSubmissionBilling',
    },
);

export const useViewSubmissionDetailsStyles = makeStyles(
    (theme) => ({
        root: {
            marginTop: theme.spacing(4),
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            '& $header, & $footer': {
                backgroundColor: '#f9f9f9',
            },
        },
        header: {},
        footer: {},
        gutterRight: {
            marginRight: theme.spacing(1),
        },
        cardImage: {
            width: 40,
            height: 56,
            objectFit: 'contain',
            objectPosition: 'center center',
        },
    }),
    {
        name: 'ViewSubmissionDetails',
    },
);
