import { Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import CustomersListPage from './CustomersListPage';

/**
 * @author: Dumitrana Alinus <alinus@wooter.com>
 * @component: Customers
 * @date: 23.12.2021
 * @time: 21:40
 */
export function Customers() {
    return (
        <Switch>
            <Redirect exact from={'/customers'} to={'/customers/list'} />
            <Route exact path={'/customers/list'} component={CustomersListPage} />
        </Switch>
    );
}

export default Customers;
