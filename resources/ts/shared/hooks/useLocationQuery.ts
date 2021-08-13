import * as queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useLocationQuery<T = Record<string, string>>(): T {
    const location = useLocation();
    return useMemo<T>(() => queryString.parse(location.search.slice(1)) as any, [location.search]);
}
