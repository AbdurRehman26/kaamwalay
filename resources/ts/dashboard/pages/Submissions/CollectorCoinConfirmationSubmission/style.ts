import makeStyles from '@mui/styles/makeStyles';

export const useConfirmationSubmissionStyles = makeStyles(
    (theme) => ({
        sidebar: {
            width: '100%',
            maxWidth: 360,
        },
        content: {
            flex: '1 1 auto',
            maxWidth: 640,
            padding: theme.spacing(0, 3),
        },
        detailsButton: {
            borderRadius: 3,
            padding: theme.spacing(1.5, 5),
        },
    }),
    {
        name: 'ConfirmationSubmission',
    },
);

export const useConfirmationSubmissionSidebarStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(0, 2.5),
            backgroundColor: '#f9f9f9',
            '& td': {
                padding: theme.spacing(0.5, 0),
                border: 'none',
            },
        },
        tooltipIcon: {
            marginLeft: theme.spacing(0.5),
        },
        successIcon: {
            fontSize: theme.spacing(5),
            color: theme.palette.primary.contrastText,
        },
        successIconHolder: {
            width: 72,
            height: 72,
            backgroundColor: theme.palette.primary.main,
            marginBottom: theme.spacing(1),
        },
    }),
    {
        name: 'ConfirmationSubmissionSidebar',
    },
);

export const useSectionHeaderStyles = makeStyles(
    (theme) => ({
        root: {
            marginBottom: theme.spacing(3),
        },
        header: {
            marginBottom: theme.spacing(1.75),
        },
        avatar: {
            width: 40,
            height: 40,
            backgroundColor: '#fff',
            color: theme.palette.primary.main,
            fontWeight: 500,
            fontSize: theme.spacing(2.5),
            marginRight: theme.spacing(1),
            border: `2px solid ${theme.palette.primary.main}`,
        },
    }),
    {
        name: 'SectionHeader',
    },
);
export const usePrintPackingSlipStyles = makeStyles(
    (theme) => ({
        root: {
            display: 'inline-flex',
            position: 'relative',
        },
        image: {
            width: 164,
            height: 212,
        },
        divider: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            height: 40,
        },
        footer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            left: 0,
            bottom: 0,
            backgroundColor: 'rgba(66, 66, 66, 0.75)',
            color: '#fff',
        },
        button: {
            flex: '1 1 auto',
        },
        buttonLabel: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: theme.spacing(1.5),
        },
    }),
    {
        name: 'PrintPackingSlip',
    },
);
