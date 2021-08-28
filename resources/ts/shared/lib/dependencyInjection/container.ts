import { Container } from 'inversify';

export const DependencyContainer = new Container({
    defaultScope: 'Singleton',
    autoBindInjectable: true,
});
