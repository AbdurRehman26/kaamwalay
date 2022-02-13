import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
                    Get accurate, fast and completely transparent grades for your cards,&nbsp;
                    <Link color={'inherit'} href={'https://agscard.com/robograding'}>
                        Learn More
                    </Link>
                    .
                </AuthBanner>
            </Grid>
            <Grid container item xs>
                <Routes>
                    <Route path={'/'} element={<Navigate to={'/login'} replace />} />
                    <Route path={'/login'} element={GuestOnlyRoute(SignIn)} />
                    <Route path={'/signup'} element={GuestOnlyRoute(SignUp)} />
                    <Route path={'/password/forgot'} element={GuestOnlyRoute(ForgotPassword)} />
                    <Route path={'/password/reset'} element={GuestOnlyRoute(ResetPassword)} />
                </Routes>
            </Grid>
        </Page>
    );
}

export default Auth;
