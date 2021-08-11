import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ListCards } from './ListCards';
import { ViewCard } from './ViewCard';

/**
 *
 * @author: Dumitrana Alinus <alinus@wooter.co>
 * @component: Cards
 * @date: 10.08.2021
 * @time: 01:24
 */
export function Cards() {
    return (
        <Switch>
            <Route exact path={'/cards'} component={ListCards} />
            <Route exact path={'/cards/:id/view'} component={ViewCard} />
        </Switch>
    );
}

export default Cards;
