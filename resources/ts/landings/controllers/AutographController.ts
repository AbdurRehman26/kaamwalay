import { AutographAtom } from '../atoms/AutographAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class AutographController extends Controller implements CanSetup<AutographController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public async autograph() {
        mountAtom(AutographAtom);
    }
}

export default AutographController;
