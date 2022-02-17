import { lazy } from 'react';
import { createAtom } from '../utils/createAtom';

export const SubmissionButtonAtom = createAtom(
    lazy(() => import('../components/SubmissionButton')),
    'submit-button',
);
