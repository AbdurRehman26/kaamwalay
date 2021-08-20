import { useEffect, useMemo, useRef } from 'react';

const includes: Record<string, any> = {};

export function useIncludeOnce<T>(key: string, factory: () => T): T | null {
    const factoryRef = useRef<() => T>(factory);

    useEffect(() => {
        factoryRef.current = factory;
    }, [factory]);

    const children = useMemo(() => {
        if (!includes[key]) {
            includes[key] = true;
            return factoryRef.current();
        }

        return null;
    }, [key]);

    const childrenRef = useRef(children);
    return childrenRef.current;
}
