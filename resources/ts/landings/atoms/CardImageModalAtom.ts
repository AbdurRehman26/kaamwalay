import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CardImageModal = createAtom(
    lazy(() => import('../components/CardImageContent/CardImageModal')),
    'card-image-modal',
);
