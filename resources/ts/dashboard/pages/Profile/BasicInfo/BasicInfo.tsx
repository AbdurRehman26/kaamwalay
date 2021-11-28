import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import { CameraAlt } from '@mui/icons-material';
import Radio, { RadioProps } from '@mui/material/Radio';
import withStyles from '@mui/styles/withStyles';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        width: '100%',
        padding: '16px',
        marginTop: '25px',
    },
    headingLabel: {
        fontFamily: 'DDT',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '32px',
        lineHeight: '44px',
        letterSpacing: '0.1px',
        color: 'rgba(0, 0, 0, 0.87)',
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
    textLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: '0.4px',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    valueLabel: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
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
    table: {
        minWidth: '100%',
        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
            borderBottom: 'none',
        },
    },
    editBtn: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '20px',
        color: '#20BFB8',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
}));

const GreenRadio = withStyles({
    root: {
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

/**
 *
 * @author: Kazmi <abdur.rehman@wooter.co>
 * @component: BasicInfo
 * @date: 25.11.2022
 * @time: 01:39
 */
export function BasicInfo() {
    const classes = useStyles();

    const user$ = useSharedSelector((state) => state.authentication.user);

    const onChangeFile = ({ target }: any) => {
        console.log();
        const formData = new FormData();
        formData.append('file', target.files[0]);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };
        fetch('http://localhost/api/upload-file', requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data.id));

        // `current` points to the mounted file input element
    };
    const avatarIcon = (
        <IconButton aria-label="delete" size="small">
            <CameraAlt fontSize="medium" />
        </IconButton>
    );

    return (
        <>
            <Typography variant={'h1'} className={classes.headingLabel}>
                Profile
            </Typography>

            <Paper className={classes.mainContainer} variant={'outlined'}>
                <Typography variant={'h1'} className={classes.subHeadingLabel}>
                    Basic Info
                </Typography>
                <div className={classes.emptyStateContainer}>
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        PHOTO
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">Personalize your account with a photo</TableCell>
                                <TableCell align="right">
                                    {avatarIcon}
                                    <input
                                        onChange={onChangeFile}
                                        accept="image/*"
                                        id="outlined-button-file"
                                        multiple
                                        type="file"
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        NAME
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">{user$?.firstName + ' ' + user$?.lastName}</TableCell>
                                <TableCell align="right" className={classes.editBtn}>
                                    EDIT
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        USERNAME
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" className={classes.valueLabel}>
                                    {user$?.username}
                                </TableCell>
                                <TableCell align="right" className={classes.editBtn}>
                                    EDIT
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        PASSWORD
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" className={classes.valueLabel}>
                                    ********
                                </TableCell>
                                <TableCell align="right" className={classes.editBtn}>
                                    EDIT
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        CUSTOMER ID
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" className={classes.valueLabel}>
                                    {user$?.customerNumber}
                                </TableCell>
                                <TableCell align="right" className={classes.editBtn}>
                                    EDIT
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Paper>
            <Paper className={classes.mainContainer} variant={'outlined'}>
                <Typography variant={'h1'} className={classes.subHeadingLabel}>
                    Contact Info
                </Typography>
                <div className={classes.emptyStateContainer}>
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        EMAIL
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" className={classes.valueLabel}>
                                    Personalize your account with a photo
                                </TableCell>
                                <TableCell align="right" className={classes.editBtn}>
                                    EDIT
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        PHONE
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" className={classes.valueLabel}>
                                    {user$?.customerNumber}
                                </TableCell>
                                <TableCell align="right" className={classes.editBtn}>
                                    EDIT
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Paper>

            <Paper className={classes.mainContainer} variant={'outlined'}>
                <Typography variant={'h1'} className={classes.subHeadingLabel}>
                    Email Subscription
                </Typography>
                <div className={classes.emptyStateContainer}>
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <Typography variant={'subtitle1'} className={classes.valueLabel}>
                                    Would you like to receive promotional emails from Robograding and AGS?
                                </Typography>
                            </TableRow>
                            <TableRow>
                                <GreenRadio checked={true} /> Yes
                                <GreenRadio checked={false} /> No
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </>
    );
}

export default BasicInfo;
