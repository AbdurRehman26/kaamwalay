import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CopyToClipBoardAtom = createAtom(
    lazy(() => import('../components/CopyToClipBoard/CopyToClipBoard')),
    'copy-to-clip-board',
);
