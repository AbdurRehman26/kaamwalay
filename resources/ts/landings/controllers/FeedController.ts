import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class FeedController extends Controller implements CanSetup<FeedController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public feedList() {
        console.log('feed list page');
    }

    public feedView() {
        console.log('feed view page');
    }
}

export default FeedController;
