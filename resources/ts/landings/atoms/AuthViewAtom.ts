import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AuthViewAtom = createAtom(
    lazy(() => import('../components/AuthView')),
    'auth-views',
);
