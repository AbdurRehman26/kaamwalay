import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useReducer } from 'react';
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
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        width: '100%',
        padding: '16px',
        marginTop: '0px',
    },
    editContainer: {
        padding: 20,
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
}));

const GreenRadio = withStyles({
    root: {
        '&$checked': {
            color: '#20BFB8',
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

function reducer(state: any, action: { type: string }) {
    switch (action.type) {
        case 'EDIT_NAME':
            return { ...state, editName: !state.editName };
        case 'EDIT_USERNAME':
            return { ...state, editUserName: !state.editUserName };
        default:
            return { ...state };
    }
}

/**
 *
 * @author: Kazmi <abdur.rehman@wooter.co>
 * @component: BasicInfo
 * @date: 25.11.2022
 * @time: 01:39
 */
export function BasicInfo() {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, {
        type: '',
        editName: false,
        editUserName: false,
    });

    const user$ = useSharedSelector((state) => state.authentication.user);

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

            <Divider className={classes.divider} />

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
                                    <input accept="image/*" id="outlined-button-file" multiple type="file" />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {!state.editName && (
                                    <>
                                        <TableCell component="th" scope="row" align={'left'}>
                                            <Typography variant={'subtitle1'} className={classes.textLabel}>
                                                NAME
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left">{user$?.firstName + ' ' + user$?.lastName}</TableCell>

                                        <TableCell align="right">
                                            <Button
                                                variant={'text'}
                                                size={'medium'}
                                                onClick={() => dispatch({ type: 'EDIT_NAME' })}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </>
                                )}

                                {state.editName && (
                                    <div className={classes.editContainer}>
                                        <Typography variant={'h1'} className={classes.subHeadingLabel}>
                                            Name
                                        </Typography>

                                        <TextField label="Enter Notes" rows={1} sx={{ marginTop: '16px' }} fullWidth />
                                        <TextField label="Enter Notes" rows={1} sx={{ marginTop: '16px' }} fullWidth />

                                        <div className={classes.buttonsContainer}>
                                            <Button
                                                variant={'text'}
                                                color={'secondary'}
                                                className={classes.backBtn}
                                                onClick={() => {
                                                    dispatch({ type: 'EDIT_NAME' });
                                                }}
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

                            <TableRow>
                                {!state.editUserName && (
                                    <>
                                        <TableCell component="th" scope="row" align={'left'}>
                                            <Typography variant={'subtitle1'} className={classes.textLabel}>
                                                USERNAME
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="left" className={classes.valueLabel}>
                                            {user$?.username}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant={'text'}
                                                size={'medium'}
                                                onClick={() => dispatch({ type: 'EDIT_USERNAME' })}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </>
                                )}

                                {state.editUserName && (
                                    <div className={classes.editContainer}>
                                        <Typography variant={'h1'} className={classes.subHeadingLabel}>
                                            Username
                                        </Typography>

                                        <TextField label="Enter Notes" rows={1} sx={{ marginTop: '16px' }} fullWidth />

                                        <div className={classes.buttonsContainer}>
                                            <Button
                                                variant={'text'}
                                                color={'secondary'}
                                                className={classes.backBtn}
                                                onClick={() => {
                                                    dispatch({ type: 'EDIT_USERNAME' });
                                                }}
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
                            <TableRow>
                                <TableCell component="th" scope="row" align={'left'}>
                                    <Typography variant={'subtitle1'} className={classes.textLabel}>
                                        PASSWORD
                                    </Typography>
                                </TableCell>
                                <TableCell align="left" className={classes.valueLabel}>
                                    ********
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant={'text'}
                                        size={'medium'}
                                        onClick={() => dispatch({ type: 'EDIT_NAME' })}
                                    >
                                        Edit
                                    </Button>
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
                                <TableCell align="right">
                                    <Button
                                        variant={'text'}
                                        size={'medium'}
                                        onClick={() => dispatch({ type: 'EDIT_NAME' })}
                                    >
                                        Edit
                                    </Button>
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
                                <TableCell align="right">
                                    <Button
                                        variant={'text'}
                                        size={'medium'}
                                        onClick={() => dispatch({ type: 'EDIT_NAME' })}
                                    >
                                        Edit
                                    </Button>
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
