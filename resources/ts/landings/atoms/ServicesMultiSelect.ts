import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const ServicesMultiSelectAtom = createAtom(
    lazy(() => import('../components/ServicesMultiSelect')),
    'services-multi-select',
);
