import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class PopController extends Controller implements CanSetup<PopController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public popReport() {
        this.scrollToTotal();
    }

    public seriesReport() {
        this.scrollToTotal();
    }

    public setReport() {
        this.scrollToTotal();
    }

    private scrollToTotal() {
        document
            .querySelector('.pop-list__table .pop-list__table-cell.pop-list__table-cell--total')
            ?.scrollIntoView(false);
    }
}

export default PopController;
