import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const DrawerNavigationAtom = createAtom(
    lazy(() => import('../components/DrawerNavigation')),
    'drawer-navigation',
);
