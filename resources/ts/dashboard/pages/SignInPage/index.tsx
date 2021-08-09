import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
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
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export default function SignInPage() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const notifications = useNotifications();
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        schema
            .validate({
                email,
                password,
            })
            .then(async (valid) => {
                try {
                    const loggedUserAuthDetails = await axios.post('http://robograding.test/api/auth/login', {
                        email,
                        password,
                    });
                    const formattedUserAuthDetails = {
                        token: loggedUserAuthDetails.data.access_token,
                        type: loggedUserAuthDetails.data.type,
                        expiry: loggedUserAuthDetails.data.expiry,
                    };
                    localStorage.setItem('userAuthData', JSON.stringify(formattedUserAuthDetails));
                    const loggedUserPersonalDetails = await axios.get('http://robograding.test/api/auth/me');
                    const formattedUserPersonalDetails = {
                        id: loggedUserPersonalDetails.data.data.user.id,
                        firstName: loggedUserPersonalDetails.data.data.user.first_name,
                        lastName: loggedUserPersonalDetails.data.data.user.last_name,
                        email: loggedUserPersonalDetails.data.data.user.email,
                        username: loggedUserPersonalDetails.data.data.user.username,
                        phone: loggedUserPersonalDetails.data.data.user.phone,
                        stripeID: loggedUserPersonalDetails.data.data.user.stripe_id,
                        roles: loggedUserPersonalDetails.data.data.user.roles,
                    };
                    localStorage.setItem('userPersonalDetails', JSON.stringify(formattedUserPersonalDetails));
                    history.push('/submissions');
                } catch (error) {
                    notifications.error('Invalid data', 'Error');
                }
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
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </div>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
