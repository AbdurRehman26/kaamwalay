import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';

class PopController extends Controller implements CanSetup<PopController> {
    public async setup() {}

    public popReport() {
        this.scrollToTotal();
    }

    public seriesReport() {
        this.scrollToTotal();
    }

    private scrollToTotal() {
        document
            .querySelector('.pop-list__table .pop-list__table-cell.pop-list__table-cell--total')
            ?.scrollIntoView(false);
    }
}

export default PopController;
