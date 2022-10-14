import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CardPageShareModal = createAtom(
    lazy(() => import('../components/CardPageShareModal/CardPageShareModal')),
    'card-page-share-modal',
);
