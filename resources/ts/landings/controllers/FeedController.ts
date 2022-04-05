import { FeedSearchAtom } from '../atoms/FeedSearchAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class FeedController extends Controller implements CanSetup<FeedController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public async feedList() {
        mountAtom(FeedSearchAtom);
    }

    public feedView() {
        console.log('feed view page');
    }
}

export default FeedController;
