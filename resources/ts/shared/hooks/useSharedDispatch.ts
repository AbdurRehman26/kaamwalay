import { useDispatch } from 'react-redux';
import { GlobalStoreType } from '../redux/store';

export const useSharedDispatch = () => useDispatch<GlobalStoreType['dispatch']>();
