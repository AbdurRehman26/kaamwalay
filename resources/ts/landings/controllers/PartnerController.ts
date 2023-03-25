import { AuthButtonAtom } from '../atoms/AuthButtonAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class PartnerController extends Controller implements CanSetup<PartnerController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public getPartner() {
        mountAtom(AuthButtonAtom);
    }
}

export default PartnerController;
