import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useSharedSelector } from '@shared/hooks/useSharedSelector';
import Radio, { RadioProps } from '@mui/material/Radio';
import withStyles from '@mui/styles/withStyles';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { BasicInfoRow } from '@dashboard/pages/Profile/BasicInfo/BasicInfoRow';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        width: '100%',
        padding: '16px',
        marginTop: '0px',
        marginBottom: 25,
    },
    editContainer: {
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    headingLabel: {
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
        marginBottom: 20,
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
    textField: {
        marginTop: '16px',
        width: '300px',
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
    divider: {
        width: '100%',
        margin: theme.spacing(2.5, 0, 2.5),
    },
    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'right',
        marginTop: '40px',
        marginBottom: '64px',
    },
    nextBtn: {
        color: '#fff',
        width: '140px',
        height: '48px',
    },
    backBtn: {
        marginRight: '12px',
        color: '#20BFB8',
    },
    subscriptionCheckBtn: {
        marginTop: 5,
        paddingLeft: 0,
        paddingTop: 10,
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

    const [showName, setShowName] = useState<boolean>(false);
    const [showUserName, setShowUserName] = useState<boolean>(false);
    const [showPhone, setShowPhone] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleOnNameEdit = useCallback(() => {
        toggleExceptFor('name');
    }, [showName]);

    const handleOnUserNameEdit = useCallback(() => {
        toggleExceptFor('userName');
    }, [showUserName]);

    const handleOnPhoneEdit = useCallback(() => {
        toggleExceptFor('phone');
    }, [showPhone]);

    const handleOnPasswordEdit = useCallback(() => {
        toggleExceptFor('password');
    }, [showPassword]);

    const user$ = useSharedSelector((state) => state.authentication.user);

    function toggleExceptFor(field: string) {
        switch (field) {
            case 'name':
                setShowName((prev) => !prev);
                setShowUserName(false);
                setShowPhone(false);
                setShowPassword(false);
                break;
            case 'userName':
                setShowName(false);
                setShowUserName((prev) => !prev);
                setShowPhone(false);
                setShowPassword(false);
                break;
            case 'phone':
                setShowName(false);
                setShowUserName(false);
                setShowPhone((prev) => !prev);
                setShowPassword(false);
                break;
            case 'password':
                setShowName(false);
                setShowUserName(false);
                setShowPhone(false);
                setShowPassword((prev) => !prev);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Typography variant={'h1'} className={classes.headingLabel}>
                Profile
            </Typography>

            <Divider className={classes.divider} />

            <Paper className={classes.mainContainer} variant={'outlined'}>
                <Typography variant={'h1'} className={classes.subHeadingLabel}>
                    Basic Info
                </Typography>
                <BasicInfoRow
                    label={'Name'}
                    value={user$?.firstName + ' ' + user$?.lastName}
                    shown={showName}
                    onSave={() => ''}
                    onEdit={handleOnNameEdit}
                    onCancel={handleOnNameEdit}
                >
                    <div className={classes.editContainer}>
                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                            Name
                        </Typography>

                        <TextField label="Enter first name" rows={1} className={classes.textField} fullWidth />
                        <TextField label="Enter last name" rows={1} className={classes.textField} fullWidth />

                        <div className={classes.buttonsContainer}>
                            <Button
                                variant={'text'}
                                color={'secondary'}
                                className={classes.backBtn}
                                onClick={handleOnNameEdit}
                            >
                                Cancel
                            </Button>
                            <Button variant={'contained'} color={'primary'} className={classes.nextBtn}>
                                Save
                            </Button>
                        </div>
                    </div>
                </BasicInfoRow>
                <BasicInfoRow
                    label={'username'}
                    value={user$?.username || '-'}
                    shown={showUserName}
                    onSave={() => ''}
                    onEdit={handleOnUserNameEdit}
                    onCancel={handleOnUserNameEdit}
                >
                    <div className={classes.editContainer}>
                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                            Username
                        </Typography>

                        <TextField label="Enter Username" rows={1} className={classes.textField} fullWidth />

                        <div className={classes.buttonsContainer}>
                            <Button
                                variant={'text'}
                                color={'secondary'}
                                className={classes.backBtn}
                                onClick={handleOnUserNameEdit}
                            >
                                Cancel
                            </Button>
                            <Button variant={'contained'} color={'primary'} className={classes.nextBtn}>
                                Save
                            </Button>
                        </div>
                    </div>
                </BasicInfoRow>
                <BasicInfoRow
                    label={'password'}
                    value={'********'}
                    shown={showPassword}
                    onSave={() => ''}
                    onEdit={handleOnPasswordEdit}
                    onCancel={handleOnPasswordEdit}
                >
                    <div className={classes.editContainer}>
                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                            Change Password
                        </Typography>

                        <TextField label="Enter Current Password" rows={1} className={classes.textField} fullWidth />
                        <TextField label="Enter New Password" rows={1} className={classes.textField} fullWidth />
                        <TextField label="Confirm New Password" rows={1} className={classes.textField} fullWidth />

                        <div className={classes.buttonsContainer}>
                            <Button
                                variant={'text'}
                                color={'secondary'}
                                className={classes.backBtn}
                                onClick={handleOnPasswordEdit}
                            >
                                Cancel
                            </Button>
                            <Button variant={'contained'} color={'primary'} className={classes.nextBtn}>
                                Save
                            </Button>
                        </div>
                    </div>
                </BasicInfoRow>
                <BasicInfoRow
                    label={'customer id'}
                    value={user$?.customerNumber || '-'}
                    shown={false}
                    onSave={() => ''}
                    onEdit={() => ''}
                    onCancel={() => ''}
                />
                <BasicInfoRow
                    label={'photo'}
                    value={'Personalize your account with a photo'}
                    shown={false}
                    onSave={() => ''}
                    onEdit={() => ''}
                    onCancel={() => ''}
                />
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
                                    {user$?.email}
                                </TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                            <TableRow>
                                {!showPhone && (
                                    <>
                                        <TableCell component="th" scope="row" align={'left'}>
                                            <Typography variant={'subtitle1'} className={classes.textLabel}>
                                                PHONE
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" className={classes.valueLabel}>
                                            {user$?.phone ?? 'N/A'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant={'text'} size={'medium'} onClick={handleOnPhoneEdit}>
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </>
                                )}

                                {showPhone && (
                                    <div className={classes.editContainer}>
                                        <Typography variant={'subtitle1'} className={classes.valueLabel}>
                                            Change Phone Number
                                        </Typography>

                                        <TextField
                                            label="Confirm New Phone Number"
                                            rows={1}
                                            className={classes.textField}
                                            fullWidth
                                        />

                                        <div className={classes.buttonsContainer}>
                                            <Button
                                                variant={'text'}
                                                color={'secondary'}
                                                className={classes.backBtn}
                                                onClick={handleOnPhoneEdit}
                                            >
                                                Cancel
                                            </Button>
                                            <Button variant={'contained'} color={'primary'} className={classes.nextBtn}>
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                                <TableCell align={'left'} className={classes.subscriptionCheckBtn}>
                                    <GreenRadio checked={true} /> Yes
                                    <GreenRadio checked={false} /> No
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        </>
    );
}

export default BasicInfo;
