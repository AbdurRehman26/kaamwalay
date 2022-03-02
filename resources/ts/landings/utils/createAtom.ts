import { ElementType } from 'react';
import { Atom } from '../classes/Atom';

interface AtomOptions {
    props?: Record<string, any>;
}

/**
 * Short handler for creating atoms quick and easy
 * @example
 * ```
 * // Creating an atom from component.
 * const DrawerNavigationAtom = createAtom(
 *     lazy(() => import('../components/DrawerNavigation')),
 *     'drawer-navigation',
 * );
 *
 * // Creating an atom from atoms
 * const LayoutAtom = createAtom([AuthControlsAtom, DrawerNavigationAtom]);
 * ```
 * @param from
 * @param to
 * @param options
 */
export function createAtom(from: ElementType | Atom[], to?: string | HTMLElement, options?: AtomOptions) {
    const atom = new Atom().from(from).props(options?.props || {});

    if (to) {
        return atom.to(to);
    }

    return atom;
}
