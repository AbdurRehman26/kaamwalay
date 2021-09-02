import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AuthControlsAtom = createAtom(
    lazy(() => import('../components/AuthControls')),
    'auth-controls',
);
