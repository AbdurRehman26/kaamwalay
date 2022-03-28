import { useDispatch } from 'react-redux';
import { GlobalStoreType } from '../redux/store';

type Dispatch = GlobalStoreType['dispatch'];
export const useSharedDispatch = () => useDispatch<Dispatch>();
