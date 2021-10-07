import { LayoutAtom } from '../atoms/LayoutAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

class FeedController extends Controller implements CanSetup<FeedController> {
    public async setup() {
        await mountAtom(LayoutAtom);
    }

    public feedList() {
        console.log('feed list page');

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

    public feedView() {
        console.log('feed view page');
    }
}

export default FeedController;
