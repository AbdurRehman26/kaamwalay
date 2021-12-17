import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BasicInfo } from './BasicInfo';
/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: Cards
 * @date: 10.08.2021
 * @time: 01:24
 */
export function Profile() {
    return (
        <Switch>
            <Route exact path={'/profile'} component={BasicInfo} />
        </Switch>
    );
}

export default Profile;
