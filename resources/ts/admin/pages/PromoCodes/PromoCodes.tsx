import { Redirect, Route, Switch } from 'react-router-dom';
import { PromoCodesList } from '@admin/pages/PromoCodes/PromoCodesList';

export function PromoCodes() {
    return (
        <Switch>
            <Redirect exact from={'/promo-codes'} to={'/promo-codes/all/list'} />
            <Route exact path={'/promo-codes/:tab/list'} component={PromoCodesList} />
        </Switch>
    );
}
