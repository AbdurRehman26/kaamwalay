import { useMemo } from 'react';

import { app } from '../lib/app';

export function useInjectable<T>(classDefinition: { new (...args: any): T }): T {
    return useMemo(() => app<T>(classDefinition), [classDefinition]);
}
