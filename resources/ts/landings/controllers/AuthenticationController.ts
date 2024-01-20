import { CardImageModal } from '../atoms/CardImageModalAtom';
import { CardImageModalMobile } from '../atoms/CardImageModalMobileAtom';
import { CardImageSlider } from '../atoms/CardImageSliderAtom';
import { CardPageShareBoxAtom } from '../atoms/CardPageShareBoxAtom';
import { CardPageShareModal } from '../atoms/CardPageShareModalAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { TooltipAtom } from '../atoms/TooltipAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class AuthenticationController extends Controller implements CanSetup<AuthenticationController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public authenticationView() {
        mountAtom(
            CardPageShareBoxAtom,
            CardPageShareModal,
            CardImageModal,
            CardImageSlider,
            CardImageModalMobile,
            TooltipAtom,
        );
    }
}

export default AuthenticationController;
