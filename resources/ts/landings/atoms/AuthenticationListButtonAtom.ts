import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const AuthenticationListButtonAtom = createAtom(
    lazy(() => import('../components/AuthenticationListButton/AuthenticationListButton')),
    'authentication-list-button',
);
