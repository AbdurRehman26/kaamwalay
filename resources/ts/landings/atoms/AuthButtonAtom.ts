import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AuthButtonAtom = createAtom(
    lazy(() => import('../components/AuthButton/AuthButton')),
    'auth-button',
);
