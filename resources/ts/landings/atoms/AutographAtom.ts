import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AutographAtom = createAtom(
    lazy(() => import('../components/AutographAuthentication/AutographAuthentication')),
    'autograph-atom',
);
