import { app } from '../lib/app';
import { EventService } from './EventService';

describe('Services EventService', function () {
    it('should be defined', function () {
        const a = app(EventService);
        const b = app(EventService);

        expect(EventService).toBeDefined();
        expect(a === b).toBeDefined();
    });

    it('should correctly create a subscribe', function () {
        const service = app(EventService);
        const handler = jest.fn();
        service.disableLogging();

        service.subscribe('test', handler);

        service.emit('test');
        expect(handler).toHaveBeenNthCalledWith(1);

        expect(service.count('test')).toBe(1);

        service.emit('test');
        expect(handler).toHaveBeenNthCalledWith(2);
    });
});
