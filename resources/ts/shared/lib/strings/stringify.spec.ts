import { stringify } from './stringify';

describe('lib/strings/stringify', function () {
    it('should convert json to the right shape', function () {
        expect(
            JSON.parse(
                stringify({
                    foo: 1,
                    bar: 2,
                    foobar: {
                        value: 3,
                        callback() {
                            return 'hello';
                        },
                    },
                }),
            ),
        ).toMatchObject({
            foo: 1,
            bar: 2,
            foobar: {
                value: 3,
            },
        });
    });
});
