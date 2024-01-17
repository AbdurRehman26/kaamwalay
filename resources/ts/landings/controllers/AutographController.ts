import { AutographListButtonAtom } from '../atoms/AutographListButtonAtom';
import { CardImageModal } from '../atoms/CardImageModalAtom';
import { CardImageModalMobile } from '../atoms/CardImageModalMobileAtom';
import { CardImageSlider } from '../atoms/CardImageSliderAtom';
import { CardPageShareBoxAtom } from '../atoms/CardPageShareBoxAtom';
import { CardPageShareModal } from '../atoms/CardPageShareModalAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class AutographController extends Controller implements CanSetup<AutographController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public autographView() {
        mountAtom(
            AutographListButtonAtom.clone(),
            CardPageShareBoxAtom,
            CardPageShareModal,
            CardImageModal,
            CardImageSlider,
            CardImageModalMobile,
        );
    }
}

export default AutographController;
