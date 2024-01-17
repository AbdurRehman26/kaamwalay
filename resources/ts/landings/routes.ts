import { route } from './utils/route';

const HomeController = () => import('./controllers/HomeController');
const FeedController = () => import('./controllers/FeedController');
const PopController = () => import('./controllers/PopController');
const ReferralController = () => import('./controllers/ReferralController');
const AutographController = () => import('./controllers/AutographController');

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    route('/', [HomeController, 'getHome']).name('home');

    route('/partners', [ReferralController, 'referralView']).name('view');

    route('/authentication', [AutographController, 'autograph']).name('view');

    route('referral/:code', [ReferralController, 'getReferralHome']).name('referralhome');

    route('/feed')
        .name('feed')
        .group((route) => {
            route('/', [FeedController, 'feedList']).name('list');
            route('/:id/view', [FeedController, 'feedView']).name('view');
        });

    route('/pop')
        .name('pop')
        .group((route) => {
            route('/', [PopController, 'popIndex']).name('report');
            route('/categories/:id/', [PopController, 'categoriesReport']).name('categories');
            route('/categories/:id/series/:id', [PopController, 'seriesReport']).name('series');
            route('/categories/:id/series/:id/sets/:id', [PopController, 'setReport']).name('set');
        });
};
