import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class ReferralHomeController extends Controller implements CanSetup<ReferralHomeController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public getFeferalHome() {}
}

export default ReferralHomeController;
