import { isPlain } from '@reduxjs/toolkit';
import { Exception } from '@shared/exceptions/Exception';
import { isAxiosError } from '@shared/lib/api/isAxiosError';
import { normalizeError } from '@shared/lib/errors/normalizeError';

describe('lib/errors/normalizeError', function () {
    it('should normalize axios error correctly', async function () {
        const error: any = {
            isAxiosError: true,
            message: 'Request failed with status code 404',
            response: {
                data: {
                    message: '',
                    exception: 'Symfony\\Component\\HttpKernel\\Exception\\NotFoundHttpException',
                    file: '/home/code/src/vendor/laravel/framework/src/Illuminate/Routing/AbstractRouteCollection.php',
                    line: 43,
                    trace: [],
                },
            },
        };

        expect(error).not.toBeNull();
        expect(error).not.toBeUndefined();
        expect(isAxiosError(error)).toBeTruthy();
        const normalizedError = normalizeError(error);
        expect(normalizedError).toMatchObject({ message: 'Request failed with status code 404' });
        expect(isPlain(normalizedError)).toBeTruthy();
    });

    it('should normalize exceptions correctly', function () {
        expect(normalizeError(new Exception('message', 'detail'))).toMatchObject({
            message: 'message',
            detail: 'detail',
            isException: true,
        });

        class FooException extends Exception {
            // noinspection JSMismatchedCollectionQueryUpdate
            public peoples: string[] = [];

            constructor(peoples: string[]) {
                super(`Foo said hi to ${peoples.length} peoples`, 'Greeting error');
                this.peoples = peoples;
            }
        }

        expect(normalizeError(new FooException(['bar', 'baz']))).toMatchObject({
            message: 'Foo said hi to 2 peoples',
            detail: 'Greeting error',
            isException: true,
            peoples: ['bar', 'baz'],
        });
    });
});
