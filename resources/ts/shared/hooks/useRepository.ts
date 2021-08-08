import { useInjectable } from './useInjectable';

export function useRepository<T>(classDefinition: { new (...args: any): T }): T {
    return useInjectable(classDefinition);
}
