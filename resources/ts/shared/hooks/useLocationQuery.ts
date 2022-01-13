import * as queryString from 'qs';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SetQueryFn = (query: Record<string, string | string[]>) => void;
type AddQueryFn = (query: Record<string, string | string[]>) => void;
type DelQueryFn = (...keys: (string | string[])[]) => void;

const stringify = (query: Record<string, any>) => {
    const params = Object.fromEntries(Object.entries({ ...query }).filter(([, value]) => !!value));

    if (Object.keys(params).length === 0) {
        return '';
    }

    return `?${queryString.stringify(params, { skipNulls: true })}`;
};

export function useLocationQuery<T = Record<string, string>>(): [
    query: T,
    methods: {
        setQuery: SetQueryFn;
        addQuery: AddQueryFn;
        delQuery: DelQueryFn;
    },
] {
    const location = useLocation();
    const routerNavigate = useNavigate();
    const query = useMemo<T>(() => queryString.parse(location.search.slice(1)) as any, [location.search]);

    const navigate = useCallback(
        (params: Record<string, any>) => {
            const search = stringify(params);
            routerNavigate(
                {
                    search,
                    hash: location.hash,
                    pathname: location.pathname,
                },
                {
                    replace: true,
                },
            );
        },
        [location.hash, location.pathname, routerNavigate],
    );

    const setQuery = useCallback((search: Record<string, any>) => navigate(search), [navigate]);
    const addQuery = useCallback((search: Record<string, any>) => navigate({ ...search, ...query }), [navigate, query]);
    const delQuery = useCallback(
        (...keys: (string | string[])[]) => {
            const search: Record<string, any> = { ...query };

            keys.flat().forEach((key) => {
                delete search[key];
            });

            navigate(search);
        },
        [navigate, query],
    );

    return [query, { setQuery, addQuery, delQuery }];
}
