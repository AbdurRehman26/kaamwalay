import { AppService } from '../services/AppService';
import { DependencyContainer } from './dependencyInjection/container';

export function app<T = AppService>(classDefinition?: { new (...args: any): T }): T {
    const appService = DependencyContainer.resolve(AppService);
    if (typeof classDefinition !== 'undefined') {
        return appService.resolve(classDefinition);
    }

    return appService as any;
}
