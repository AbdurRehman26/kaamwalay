import { camelCase } from 'lodash';
import { ElementType, Fragment, ReactElement, Suspense } from 'react';
import { isValidElementType } from 'react-is';
import ApplicationProvider from '@shared/components/ApplicationProvider';
import { renderElementType } from '@shared/lib/react/renderElementType';
import { store } from '../redux/store';
import { mountAtom } from '../utils/mountAtom';

type ToType = string | HTMLElement[] | null;
type LoaderType = ElementType | ReactElement | null;
type PropsType = Record<string, any>;

interface AtomOptions {}

interface CloneOptions {
    to?: ToType;
    loader?: LoaderType;
    props?: PropsType;
    options?: AtomOptions;
}

/**
 * Atom is a react component wrapper used to as a light bridge between
 * vanilla js and react.
 *
 * An atom will be rendered in the page with the ApplicationProvider, which
 * will add all the react app features to the component, such as:
 * - ThemeProvider: Material UI Theme provider.
 * - ReduxStoreProvider: Redux store provider
 * - CssBaseline: The Material UI css reset (Only 1 time)
 * - ConfigurationLoad: used to load Configuration (Only 1 time)
 * - AuthenticationCheck: used to request auth check (Only 1 time)
 * - NotificationContainer: used to display notifications (Only 1 time)
 */
export class Atom {
    private _from!: ElementType | Atom[];
    private _to!: ToType;
    private _loader: LoaderType = null;
    private _props: PropsType = {};
    private _options: AtomOptions = {};

    private static noConfigurationLoad = false;
    private static noAuthenticationCheck = false;
    private static noNotificationsContainer = false;
    private static noCssBaseline = false;
    private static noReactQueryDevTools = false;

    /**
     * Define the component or another list of Atoms, you want to render.
     * @param from
     */
    public from(from: ElementType | Atom[]): this {
        this._from = from;
        return this;
    }

    /**
     * Define the place to where you want the atom to be rendered.
     * NOTE: If the string is not a selector a prefix will be added to
     * the string.
     * @example
     * ```
     * atom.to('my-element');   // Will be rendered to '.atoms--my-element'
     * atom.to('.my-element');  // Will be rendered to '.my-element'
     * atom.to('#my-element');  // Will be rendered to '#my-element'
     * atom.to('#my-element', { prop:'value' });  // Will be rendered to '#my-element' and pass `prop` prop to the component
     * ```
     * @param to
     */
    public to(to: string | HTMLElement | HTMLElement[]): this {
        this._to = typeof to === 'string' || Array.isArray(to) ? to : [to];
        return this;
    }

    /**
     * Define the default props to use when the atom is mounted.
     * @param props
     */
    public props(props: PropsType): this {
        this._props = {
            ...this._props,
            ...props,
        };

        return this;
    }

    /**
     * Define the options of the atom.
     * @param options
     */
    public options(options: AtomOptions): this {
        this._options = {
            ...this._options,
            ...options,
        };

        return this;
    }

    /**
     * Define loader you want to show while the atom it's loading.
     * @param loader
     */
    public loader(loader: LoaderType): this {
        this._loader = loader;
        return this;
    }

    /**
     * Mount method, will render atom or the atoms to the right place.
     */
    public async mount() {
        const from = this._from;
        if (Array.isArray(from)) {
            await mountAtom(...from);
            return;
        }

        return this.mountComponent(from);
    }

    /**
     * Mount the component to the element.
     * @param from
     * @private
     */
    private async mountComponent(from: ElementType) {
        const { render } = await import('react-dom');
        const mountPoints = this.getMountPoints();

        if (!isValidElementType(from)) {
            return;
        }

        mountPoints?.forEach((mountPoint) => {
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
                    noReactQueryDevTools={Atom.noReactQueryDevTools}
                >
                    <Suspense fallback={<Fragment />}>{renderElementType(from, this.getPropsOf(mountPoint))}</Suspense>
                </ApplicationProvider>,
                mountPoint,
                () => {
                    mountPoint.removeAttribute('data-atom');
                },
            );

            Atom.noConfigurationLoad = true;
            Atom.noAuthenticationCheck = true;
            Atom.noNotificationsContainer = true;
            Atom.noCssBaseline = true;
            Atom.noReactQueryDevTools = true;
        });
    }

    /**
     * Getting the mount point to where the atom will be rendered.
     * @private
     */
    private getMountPoints() {
        if (typeof this._to === 'string') {
            let to = this._to;
            if (!/^[.#]/.test(to)) {
                to = `.atoms--${to},[data-atom="${to}"]`;
            }

            this._to = Array.from(document.querySelectorAll<HTMLElement>(to));
        }

        return this._to;
    }

    private getPropsOf(mountPoint: HTMLElement): PropsType {
        const dataset = this.getDatasetOf(mountPoint);
        return { ...(this._props || {}), ...(dataset ?? {}) };
    }

    private getDatasetOf(mountPoint: HTMLElement) {
        if (mountPoint.dataset) {
            return mountPoint.dataset;
        }

        return mountPoint
            .getAttributeNames()
            .filter((name) => name.startsWith('data-') || name === 'data-atom')
            .reduce(
                (acc, name) => ({
                    ...acc,
                    [camelCase(name.replace(/^data-/g, ''))]: mountPoint.getAttribute(name),
                }),
                {} as PropsType,
            );
    }

    clone(param?: CloneOptions) {
        return new Atom()
            .from(this._from)
            .to(param?.to || this._to!)
            .props(param?.props || this._props)
            .options(param?.options || this._options)
            .loader(param?.loader || this._loader);
    }
}
