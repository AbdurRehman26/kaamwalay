import { useDispatch } from 'react-redux';

import { GlobalStoreType } from '@shared/redux/store';

export const useSharedDispatch = () => useDispatch<GlobalStoreType['dispatch']>();
