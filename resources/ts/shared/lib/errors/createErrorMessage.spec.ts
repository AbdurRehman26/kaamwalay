import { createErrorMessage } from '@shared/lib/errors/createErrorMessage';

describe('lib/errors/createErrorMessage', function () {
    it('should correctly create error', function () {
        expect(createErrorMessage('This is %1 for foo.', 'bar')).toEqual('This is bar for foo.');
        expect(createErrorMessage('This is %1 for foo.', 'bar', 'foobar')).toEqual('This is bar for foo.');
        expect(createErrorMessage('This is %1 and %2 for foo.', 'bar', 'foobar')).toEqual(
            'This is bar and foobar for foo.',
        );
    });
});
