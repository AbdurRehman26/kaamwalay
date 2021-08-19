import 'reflect-metadata';
import { app } from '@shared/lib/app';
import { RouterService } from './services/RouterService';

app(RouterService).exec(() => {
    require('./routes').default();
});
