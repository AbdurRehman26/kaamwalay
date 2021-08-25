import { Atom } from '../classes/Atom';

/**
 * Short method used to mount atom
 * @param atoms
 */
export function mountAtom(...atoms: Atom[]) {
    return Promise.all(atoms.map((atom) => atom.mount()));
}
