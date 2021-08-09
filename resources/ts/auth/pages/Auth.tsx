import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import GuestOnlyRoute from '@shared/components/GuestOnlyRoute';

import { SignIn } from './SignIn';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.comm>
 * @component: pages
 * @date: 09.08.2021
 * @time: 05:51
 */
export function Auth() {
    return (
        <Switch>
            <Redirect exact from={'/'} to={'/sign-in'} />
            <GuestOnlyRoute exact path={'/sign-in'} component={SignIn} />
        </Switch>
    );
}

export default Auth;
