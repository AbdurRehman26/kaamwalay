import { app } from '@shared/lib/app';
import { Controller } from '../classes/Controller';
import { Route, RouteAction } from '../classes/Route';
import { RouterService } from '../services/RouterService';

/**
 * Route short handler.
 * @example
 * ```
 * const FeedController = () => import('./controllers/FeedController');
 *
 * route('/feed')
 *      .name('feed')
 *      .group((route) => {
 *          route('/', [FeedController, 'feedList']).name('list');
 *          route('/:id/view', [FeedController, 'feedView']).name('view');
 *      });
 * ```
 * @param url
 * @param action
 */
export function route<C extends Controller>(url: string, action?: RouteAction<C>) {
    const router = app(RouterService);
    const routeDefinition = new Route(url, action);

    if (!action) {
        return routeDefinition;
    }

    return router.addRoute(routeDefinition);
}

export type RouteFunc = typeof route;
