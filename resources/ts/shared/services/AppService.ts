import { Injectable } from '../decorators/Injectable';
import { DependencyContainer } from '../lib/dependencyInjection/container';

@Injectable('AppService')
export class AppService {
    public resolve<T>(classDefinition: { new (...args: any): T }): T {
        return DependencyContainer.get(classDefinition);
    }
}
