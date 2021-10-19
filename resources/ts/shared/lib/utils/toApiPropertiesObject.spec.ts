/* eslint-disable camelcase */
import { toApiPropertiesObject } from './toApiPropertiesObject';

describe('Utilities::toApiPropertiesObject', () => {
    it('should convert object to the right type', () => {
        expect(toApiPropertiesObject({ fooBar: 1, fooBaz: 2 })).toMatchObject({ foo_bar: 1, foo_baz: 2 });
        expect(toApiPropertiesObject({ fooBar: 1, fooBaz: 2, foo: { testProp: 1 } }, { deep: false })).toMatchObject({
            foo_bar: 1,
            foo_baz: 2,
            foo: { testProp: 1 },
        });

        const deepCamelObject: Record<string, any> = { fooBar: 1, fooBaz: 2, foo: { testProp: 1 } };
        const deepSnakeObject: Record<string, any> = {
            foo_bar: 1,
            foo_baz: 2,
            foo: { test_prop: 1 },
        };

        deepSnakeObject.some_items = [{ some_value: { ...deepSnakeObject } }, { some_value: { ...deepSnakeObject } }];
        deepCamelObject.someItems = [{ someValue: { ...deepCamelObject } }, { someValue: { ...deepCamelObject } }];

        expect(toApiPropertiesObject(deepCamelObject)).toMatchObject(deepSnakeObject);
        expect(
            toApiPropertiesObject([deepCamelObject, deepCamelObject, deepCamelObject], { deep: true }),
        ).toMatchObject([deepSnakeObject, deepSnakeObject, deepSnakeObject]);
    });
});
