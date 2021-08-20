import { ElementType } from 'react';
import { Atom } from '../classes/Atom';

export function createAtom(from: ElementType | Atom[], to?: string | HTMLElement) {
    const atom = new Atom().from(from);

    if (to) {
        return atom.to(to);
    }

    return atom;
}
