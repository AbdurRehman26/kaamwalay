import { DependencyContainer } from './container';

/**
 * Resolve an Injectable
 * @param classDefinition
 */
export function resolve<T>(classDefinition: { new (...args: any): T }): T {
    return DependencyContainer.resolve(classDefinition);
}
