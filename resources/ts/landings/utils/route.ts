import { app } from '@shared/lib/app';
import { Route, RouteAction } from '../classes/Route';
import { RouterService } from '../services/RouterService';

export type RouteFunc = <C>(url: string, action: RouteAction<C>) => Route<C>;

export function route<C>(url: string, action?: RouteAction<C>) {
    const router = app(RouterService);
    const routeDefinition = new Route(url, action);

    if (!action) {
        return routeDefinition;
    }

    return router.addRoute(routeDefinition);
}
