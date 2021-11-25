import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const useStyles = makeStyles((theme) => ({
    addedCardsContainer: {
        width: '100%',
        padding: '16px',
    },
    subHeadingLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '20px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    emptyStateContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    emptyStateText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    qtyField: {
        width: '80px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    valueField: {
        width: '150px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    table: {
        minWidth: '100%',
    },
    editBtn: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.35px',
        marginLeft: '12px',
        '&:hover': {
            cursor: 'pointer',
        },
        color: '#20BFB8',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    tableRowText: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
    mobileViewContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '12px',
    },
    mobileViewCardActionContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '45%',
    },
    mobileViewCardActions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '24px',
        marginBottom: '12px',
    },
    actionLabel: {
        fontWeight: 'bold',
        marginBottom: '6px',
    },
}));

/**
 *
 * @author: Kazmi <abdur.rehman@wooter.co>
 * @component: BasicInfo
 * @date: 25.11.2022
 * @time: 01:39
 */
export function BasicInfo() {
    const classes = useStyles();

    const avatarIcon = (
        <IconButton aria-label="delete" size="small">
            <DeleteIcon fontSize="medium" />
        </IconButton>
    );

    const basicInfoRows = [
        {
            label: 'Photo',
            value: 'Personalize your account with a photo',
            iconText: '',
            icon: avatarIcon,
        },
        {
            label: 'Name',
            value: 'Personalize your account with a photo',
            iconText: 'EDIT',
        },
        {
            label: 'Username',
            value: 'Personalize your account with a photo',
            iconText: 'EDIT',
        },
        {
            label: 'Password',
            value: 'Personalize your account with a photo',
            iconText: 'EDIT',
        },
        {
            label: 'Customer ID',
            value: 'Personalize your account with a photo',
            iconText: 'EDIT',
        },
    ];

    return (
        <Paper className={classes.addedCardsContainer} variant={'outlined'}>
            <Typography variant={'h1'} className={classes.subHeadingLabel}>
                Basic Info
            </Typography>
            <div className={classes.emptyStateContainer}>
                <Table className={classes.table}>
                    <TableBody>
                        {basicInfoRows.map((row) => (
                            <>
                                <TableRow>
                                    <TableCell component="th" scope="row" align={'left'}>
                                        {
                                            <Typography variant={'subtitle1'} className={classes.tableRowText}>
                                                {row.label}
                                            </Typography>
                                        }
                                    </TableCell>
                                    <TableCell align="left">{row.value}</TableCell>
                                    <TableCell align="right">{row.iconText ?? row.icon}</TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
}

export default BasicInfo;
