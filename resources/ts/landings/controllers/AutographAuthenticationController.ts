import { AutographAuthenticationAtom } from '../atoms/AutographAuthenticationAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class AutographAuthenticationController extends Controller implements CanSetup<AutographAuthenticationController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public async autographAuthentication() {
        mountAtom(AutographAuthenticationAtom);
    }
}

export default AutographAuthenticationController;
