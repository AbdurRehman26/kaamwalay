import { AuthButtonAtom } from '../atoms/AuthButtonAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class ReferralController extends Controller implements CanSetup<ReferralController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public getReferralHome() {}

    public referralView() {
        mountAtom(AuthButtonAtom);
    }
}

export default ReferralController;
