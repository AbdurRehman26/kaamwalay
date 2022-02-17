import { createAtom } from '../utils/createAtom';
import { AuthControlsAtom } from './AuthControlsAtom';
import { DrawerNavigationAtom } from './DrawerNavigationAtom';
import { SubmissionButtonAtom } from './SubmissionButtonAtom';

export const LayoutAtom = createAtom([AuthControlsAtom, DrawerNavigationAtom, SubmissionButtonAtom]);
