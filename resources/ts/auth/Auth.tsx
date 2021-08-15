import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import GuestOnlyRoute from '@shared/components/GuestOnlyRoute';
import { AuthBanner } from './components/AuthBanner';
import { Page } from './components/Page';
import { ForgotPassword, ResetPassword, SignIn, SignUp } from './pages/Auth';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: pages
 * @date: 09.08.2021
 * @time: 05:51
 */
export function Auth() {
    return (
        <Page container>
            <Grid container justifyContent={'center'} className={'page-content'} item xs>
                <AuthBanner headline={'Automated Card Grading'}>
                    Get accurate, fast and completely transparent grades for your cards.
                </AuthBanner>
            </Grid>
            <Grid container item xs>
                <Switch>
                    <Redirect exact from={'/'} to={'/sign-in'} />
                    <GuestOnlyRoute exact path={'/sign-in'} component={SignIn} />
                    <GuestOnlyRoute exact path={'/sign-up'} component={SignUp} />
                    <GuestOnlyRoute exact path={'/password/forgot'} component={ForgotPassword} />
                    <GuestOnlyRoute exact path={'/password/reset'} component={ResetPassword} />
                </Switch>
            </Grid>
        </Page>
    );
}

export default Auth;
