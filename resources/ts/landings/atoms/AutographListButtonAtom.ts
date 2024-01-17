import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AutographListButtonAtom = createAtom(
    lazy(() => import('../components/AutographListButton/AutographListButton')),
    'autograph-list-button',
);
