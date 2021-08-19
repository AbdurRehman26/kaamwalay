import { route } from './utils/route';

const FeedController = () => import('./controllers/FeedController');

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    route('/feed')
        .name('feed')
        .group((route) => {
            route('/', [FeedController, 'feedList']).name('list');
            route('/:id/view', [FeedController, 'feedView']).name('view');
        });
};
