import { Controller } from '../classes/Controller';
import scanningVideo from '@shared/assets/heroVideos/scanning.mp4';
import poweredByAgs from '@shared/assets/poweredByAGS.svg';
import { CanSetup } from '../interfaces/CanSetup';
import { mountAtom } from '../utils/mountAtom';
import { LayoutAtom } from '../atoms/LayoutAtom';
import { SubmissionButtonAtom } from '../atoms/SubmissionButtonAtom';

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
        );
    }

    public getHome() {
        const videoElement = document.querySelector<HTMLDivElement>('.Home-video--js');

        if (videoElement) {
            const video = document.createElement('video');
            video.autoplay = true;
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
    }
}

export default HomeController;
