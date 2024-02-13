import scanningVideo from '@shared/assets/heroVideos/scanning.mp4';
import poweredByAgs from '@shared/assets/poweredByAGS.svg';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { ServicesMultiSelectAtom } from '../atoms/ServicesMultiSelect';
import { SubmissionButtonAtom } from '../atoms/SubmissionButtonAtom';
import { Controller } from '../classes/Controller';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';

export class HomeController extends Controller implements CanSetup<HomeController> {
    public async setup() {
        await mountAtom(LayoutAtom);
        await mountAtom(
            SubmissionButtonAtom.clone({
                props: {
                    className: 'Home-buttonCta',
                },
                options: {
                    replaceParent: true,
                },
            }),
            ServicesMultiSelectAtom,
        );
    }

    public getHome() {
        const videoElement = document.querySelector<HTMLDivElement>('.Home-video--js');

        if (videoElement) {
            const video = document.createElement('video');
            video.autoplay = true;
            video.playsInline = true;
            video.loop = true;
            video.muted = true;
            video.classList.add('Home-video');
            videoElement.appendChild(video);

            const source = document.createElement('source');
            source.type = 'video/mp4';
            source.src = scanningVideo;
            video.appendChild(source);
            video.play();

            const poweredBy = document.createElement('img');
            poweredBy.src = poweredByAgs;
            poweredBy.classList.add('Home-poweredBy');
            videoElement.appendChild(poweredBy);
        }

        this.setupHeader();
    }

    private setupHeader() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector<HTMLDivElement>('.page__header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('page__header--scrolled');
                } else {
                    header.classList.remove('page__header--scrolled');
                }
            }
        });

        window.dispatchEvent(new Event('scroll'));
    }
}

export default HomeController;
