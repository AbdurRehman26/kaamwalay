import { useDispatch } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`, this way things will be a lot easier
// with typescript
export const useAppDispatch = () => useDispatch<any>();
