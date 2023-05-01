import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CardPageShareBoxAtom = createAtom(
    lazy(() => import('../components/CardPageShareBox/CardPageShareBox')),
    'card-page-share-box',
);
