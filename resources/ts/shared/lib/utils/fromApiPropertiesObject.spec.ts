/* eslint-disable camelcase */
import { fromApiPropertiesObject } from './fromApiPropertiesObject';

describe('Utilities::fromApiPropertiesObject', () => {
    it('should convert object to the right type', () => {
        expect(fromApiPropertiesObject({ foo_bar: 1, foo_baz: 2 })).toMatchObject({ fooBar: 1, fooBaz: 2 });
        expect(
            fromApiPropertiesObject({
                foo_bar: 1,
                foo_baz: 2,
                foo: { testProp: 1 },
            }),
        ).toMatchObject({ fooBar: 1, fooBaz: 2, foo: { testProp: 1 } });

        expect(
            fromApiPropertiesObject(
                {
                    foo_bar: 1,
                    foo_baz: 2,
                    foo: { test_prop: 1 },
                },
                { deep: true },
            ),
        ).toMatchObject({ fooBar: 1, fooBaz: 2, foo: { testProp: 1 } });
    });
});
