import { Controller } from '../classes/Controller';

export class FeedController extends Controller {
    public feedList() {
        console.log('feed list page');
    }

    public feedView() {
        console.log('feed view page');
    }
}

export default FeedController;
