import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const TooltipAtom = createAtom(
    lazy(() => import('../components/Tooltip/Tooltip')),
    'tooltip',
);
