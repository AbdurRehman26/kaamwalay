import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CardImageSlider = createAtom(
    lazy(() => import('../components/CardImageContent/CardImageSlider')),
    'card-image-slider',
);
