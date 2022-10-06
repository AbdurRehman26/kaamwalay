import { CardImageModal } from '../atoms/CardImageModalAtom';
import { CardImageSlider } from '../atoms/CardImageSliderAtom';
import { CardPageShareModal } from '../atoms/CardPageShareModalAtom';
import { CopyToClipBoardAtom } from '../atoms/CopyToClipBoardAtom';
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
        mountAtom(
            SubmissionButtonAtom.clone({
                props: {
                    className: 'SubmissionButton',
                },
                options: {
                    replaceParent: true,
                },
            }),
            CopyToClipBoardAtom,
            CardPageShareModal,
            CardImageModal,
            CardImageSlider,
        );
    }
}

export default FeedController;
