import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class PopController extends Controller implements CanSetup<PopController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public popIndex() {}

    public categoriesReport() {
        this.scrollToTotal();
        this.enablePaginationLimit();
    }

    public seriesReport() {
        this.scrollToTotal();
        this.enablePaginationLimit();
    }

    public setReport() {
        this.scrollToTotal();
        this.enablePaginationLimit();
    }

    private scrollToTotal() {
        document
            .querySelector('.pop-list__table .pop-list__table-cell.pop-list__table-cell--total')
            ?.scrollIntoView(false);
    }

    private enablePaginationLimit() {
        const paginationSelect = document.querySelector('.pagination__limit__select');

        paginationSelect?.addEventListener('change', (e) => {
            const select = e.target as HTMLSelectElement;
            const selectedOption = select.options[select.selectedIndex];

            const href = new URL(window.location.href);
            href.searchParams.set('per_page', selectedOption.value);
            href.searchParams.set('page', '1');
            window.location.replace(href.toString());
        });
    }
}

export default PopController;
