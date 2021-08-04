import { useMemo } from 'react';

import { resolve } from '@shared/lib/dependencyInjection/resolve';

export function useInjectable<T>(classDefinition: { new (...args: any): T }): T {
    return useMemo(() => resolve<T>(classDefinition), [classDefinition]);
}
