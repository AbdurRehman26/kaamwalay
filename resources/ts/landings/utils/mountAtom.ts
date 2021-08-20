import { Atom } from '../classes/Atom';

export function mountAtom(...atoms: Atom[]) {
    return Promise.all(atoms.map((atom) => atom.mount()));
}
