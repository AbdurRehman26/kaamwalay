import { CopyToClipBoardAtom } from '../atoms/CopyToClipBoardAtom';
import { CopyToClipBoardMobileAtom } from '../atoms/CopyToClipBoardMobileAtom';
import { FeedSearchAtom } from '../atoms/FeedSearchAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { SubmissionButtonAtom } from '../atoms/SubmissionButtonAtom';
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
        mountAtom(SubmissionButtonAtom, CopyToClipBoardAtom, CopyToClipBoardMobileAtom);
    }
}

export default FeedController;
