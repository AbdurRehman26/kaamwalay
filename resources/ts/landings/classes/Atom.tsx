import { ElementType, Fragment, ReactElement, Suspense } from 'react';
import { isValidElementType } from 'react-is';
import ApplicationProvider from '@shared/components/ApplicationProvider';
import { renderElementType } from '@shared/lib/react/renderElementType';
import { store } from '../redux/store';
import { mountAtom } from '../utils/mountAtom';

export class Atom {
    private _from!: ElementType | Atom[];
    private _to!: string | HTMLElement | null;
    private _loader: ElementType | ReactElement | null = null;

    private static noConfigurationLoad = false;
    private static noAuthenticationCheck = false;
    private static noNotificationsContainer = false;
    private static noCssBaseline = false;

    public from(from: ElementType | Atom[]): this {
        this._from = from;
        return this;
    }

    public to(to: string | HTMLElement): this {
        this._to = to;
        return this;
    }

    public loader(loader: ElementType | ReactElement | null): this {
        this._loader = loader;
        return this;
    }

    public async mount() {
        const from = this._from;
        if (Array.isArray(from)) {
            await mountAtom(...from);
            return;
        }

        return this.mountComponent(from);
    }

    async mountComponent(from: ElementType) {
        const { render } = await import('react-dom');
        const to = this.getMountPoint();

        if (!isValidElementType(from)) {
            return;
        }

        const children = renderElementType(from);

        render(
            <ApplicationProvider
                store={store}
                splashScreenProps={{
                    minHeight: '0',
                    width: 'auto',
                    customLoader: this._loader,
                    circularProgressProps: {
                        size: 24,
                    },
                }}
                noConfigurationLoad={Atom.noConfigurationLoad}
                noAuthenticationCheck={Atom.noAuthenticationCheck}
                noNotificationsContainer={Atom.noNotificationsContainer}
                noCssBaseline={Atom.noCssBaseline}
            >
                <Suspense fallback={<Fragment />}>{children}</Suspense>
            </ApplicationProvider>,
            to,
        );

        Atom.noConfigurationLoad = true;
        Atom.noAuthenticationCheck = true;
        Atom.noNotificationsContainer = true;
        Atom.noCssBaseline = true;
    }

    private getMountPoint() {
        if (typeof this._to === 'string') {
            let to = this._to;
            if (!/^[.#]/.test(to)) {
                to = '.atoms--' + to;
            }

            this._to = document.querySelector<HTMLElement>(to);
        }

        return this._to as HTMLElement;
    }
}
