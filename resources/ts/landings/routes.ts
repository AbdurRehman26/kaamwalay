import FeedController from './controllers/FeedController';
import { route } from './utils/route';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    route('/feed')
        .name('feed')
        .group((route) => {
            route('/', [FeedController, 'feedList']).name('list');
            route('/:id/view', [FeedController, 'feedView']).name('view');
        });
};
