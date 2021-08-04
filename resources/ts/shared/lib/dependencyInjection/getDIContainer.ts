import { DependencyContainer } from '@shared/lib/dependencyInjection/container';

/**
 * Get the inversify container
 */
export function getDIContainer() {
    return DependencyContainer;
}
