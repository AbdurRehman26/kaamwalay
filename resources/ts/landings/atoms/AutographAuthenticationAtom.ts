import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AutographAuthenticationAtom = createAtom(
    lazy(() => import('../components/AutographAuthentication/AutographAuthentication')),
    'autograph-authentication',
);
