import { ElementType } from 'react';
import { Atom } from '../classes/Atom';

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
 */
export function createAtom(from: ElementType | Atom[], to?: string | HTMLElement) {
    const atom = new Atom().from(from);

    if (to) {
        return atom.to(to);
    }

    return atom;
}
