import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const CopyToClipBoardMobileAtom = createAtom(
    lazy(() => import('../components/CopyToClipBoard/CopyToClipBoardMobile')),
    'copy-to-clip-board-mobile',
);
