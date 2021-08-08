import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';

import { useNotifications } from '@shared/hooks/useNotifications';

import { useAppDispatch, useAppSelector } from '@dashboard/redux/hooks';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

let schema = yup.object().shape({
    fName: yup.string().required(),
    lName: yup.string().required(),
    email: yup.string().email().required(),
    username: yup.string().required(),
    phoneNumber: yup.string().optional(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
});

export default function SignUpPage() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const history = useHistory();

    const [fName, setFName] = useState('');
    const [lName, setlName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            notifications.error("Your passwords don't match", 'Error');
        }

        schema
            .validate({
                fName,
                lName,
                email,
                username,
                phoneNumber,
                password,
                confirmPassword,
            })
            .then(async (valid) => {
                const newUserDTO = {
                    first_name: fName,
                    last_name: lName,
                    email: email,
                    username: username,
                    password: password,
                    password_confirmation: confirmPassword,
                    phone: phoneNumber,
                };

                const newUser = await axios.post('http://robograding.test/api/register', {
                    ...newUserDTO,
                });

                const formattedResponse = {
                    id: newUser.data.data.user.id,
                    firstName: newUser.data.data.user.first_name,
                    lastName: newUser.data.data.user.last_name,
                    email: newUser.data.data.user.email,
                    username: newUser.data.data.user.username,
                    phone: newUser.data.data.user.phone,
                    stripeID: newUser.data.data.user.stripe_id,
                    roles: newUser.data.data.user.roles,
                    authToken: newUser.data.data.token,
                };
                localStorage.setItem('userData', JSON.stringify(formattedResponse));
                history.push('/dashboard/submissions');
            })
            .catch((err) => {
                console.log(err);
                err.errors.forEach((item: string) => {
                    notifications.error(item, 'Error');
                });
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <div className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                value={fName}
                                onChange={(e) => setFName(e.target.value)}
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                value={lName}
                                onChange={(e) => setlName(e.target.value)}
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                fullWidth
                                id="phone-number"
                                label="Phone Number"
                                name="phone-number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                fullWidth
                                name="password-confirm"
                                label="Confirm Password"
                                type="password"
                                id="password-confirm"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox value="allowExtraEmails" color="primary" />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
