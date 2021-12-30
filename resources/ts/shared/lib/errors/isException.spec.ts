import { plainToInstance } from 'class-transformer';
import { Exception } from '@shared/exceptions/Exception';
import { isException } from '@shared/lib/errors/isException';

describe('lib/errors/isException', function () {
    it('should correctly check if is exception', function () {
        expect(isException(new Error('test'))).toBeFalsy();
        expect(isException(new Exception('test'))).toBeTruthy();
        expect(isException({ isException: true })).toBeFalsy();
        expect(isException({ isException: true, message: 'test' })).toBeTruthy();
        expect(isException(plainToInstance(Exception, { message: 'test' }))).toBeTruthy();
    });
});
