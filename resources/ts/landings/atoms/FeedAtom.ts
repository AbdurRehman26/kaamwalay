import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const FeedAtom = createAtom(
    lazy(() => import('../components/FeedContentView/Feed')),
    'feed',
);
