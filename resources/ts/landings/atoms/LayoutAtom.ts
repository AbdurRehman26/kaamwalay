import { createAtom } from '../utils/createAtom';
import { AuthControlsAtom } from './AuthControlsAtom';
import { AuthViewAtom } from './AuthViewAtom';
import { DrawerNavigationAtom } from './DrawerNavigationAtom';

export const LayoutAtom = createAtom([AuthControlsAtom, DrawerNavigationAtom, AuthViewAtom]);
