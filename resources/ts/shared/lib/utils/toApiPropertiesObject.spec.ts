/* eslint-disable camelcase */
import { toApiPropertiesObject } from './toApiPropertiesObject';

describe('Utilities::toApiPropertiesObject', () => {
    it('should convert object to the right type', () => {
        expect(toApiPropertiesObject({ fooBar: 1, fooBaz: 2 })).toMatchObject({ foo_bar: 1, foo_baz: 2 });
        expect(toApiPropertiesObject({ fooBar: 1, fooBaz: 2, foo: { testProp: 1 } })).toMatchObject({
            foo_bar: 1,
            foo_baz: 2,
            foo: { testProp: 1 },
        });

        expect(toApiPropertiesObject({ fooBar: 1, fooBaz: 2, foo: { testProp: 1 } }, { deep: true })).toMatchObject({
            foo_bar: 1,
            foo_baz: 2,
            foo: { test_prop: 1 },
        });
    });
});
