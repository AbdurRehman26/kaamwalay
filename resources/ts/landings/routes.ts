import { route } from './utils/route';

const HomeController = () => import('./controllers/HomeController');

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    route('/', [HomeController, 'getHome']).name('home');
};
