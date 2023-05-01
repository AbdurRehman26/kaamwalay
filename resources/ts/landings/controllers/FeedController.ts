import { CardImageModal } from '../atoms/CardImageModalAtom';
import { CardImageModalMobile } from '../atoms/CardImageModalMobileAtom';
import { CardImageSlider } from '../atoms/CardImageSliderAtom';
import { CardPageShareBoxAtom } from '../atoms/CardPageShareBoxAtom';
import { CardPageShareModal } from '../atoms/CardPageShareModalAtom';
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
            CardPageShareBoxAtom,
            CardPageShareModal,
            CardImageModal,
            CardImageSlider,
            CardImageModalMobile,
        );
    }
}

export default FeedController;
