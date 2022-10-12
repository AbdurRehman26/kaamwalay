import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CardImageModalMobile = createAtom(
    lazy(() => import('../components/CardImageContent/CardImageModalMobile')),
    'card-image-modal-mobile',
);
