import { useMemo } from 'react';

import { resolveInjectable } from '@shared/lib/dependencyInjection/resolveInjectable';

export function useInjectable<T>(classDefinition: { new (...args: any): T }): T {
    return useMemo(() => resolveInjectable<T>(classDefinition), [classDefinition]);
}
