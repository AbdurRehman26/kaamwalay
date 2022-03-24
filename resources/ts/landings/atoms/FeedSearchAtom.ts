import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const FeedSearchAtom = createAtom(
    lazy(() => import('../components/FeedContentView/Feed')),
    'feed',
);
