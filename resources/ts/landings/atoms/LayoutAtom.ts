import { createAtom } from '../utils/createAtom';
import { AuthControlsAtom } from './AuthControlsAtom';
import { DrawerNavigationAtom } from './DrawerNavigationAtom';

export const LayoutAtom = createAtom([AuthControlsAtom, DrawerNavigationAtom]);
