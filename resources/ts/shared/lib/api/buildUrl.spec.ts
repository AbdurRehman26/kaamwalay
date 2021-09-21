import { buildUrl } from './buildUrl';

describe('lib/api/buildUrl', function () {
    it('should build url correctly with no params', function () {
        expect(buildUrl('/orders/:orderId/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{orderId}}/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{ orderId }}/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{ orderId}}/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{orderId }}/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{  orderId  }}/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{  orderId}}/items')).toBe('/orders/items');
        expect(buildUrl('/orders/{{orderId  }}/items')).toBe('/orders/items');
    });
    it('should build url correctly with data', function () {
        expect(buildUrl('/orders/:orderId/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{orderId}}/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{ orderId }}/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{ orderId}}/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{orderId }}/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{  orderId  }}/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{  orderId}}/items', { orderId: 1 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{orderId  }}/items', { orderId: 1 })).toBe('/orders/1/items');
    });

    it('should build url correctly with data extra', function () {
        expect(buildUrl('/orders/:orderId/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{orderId}}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{ orderId }}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{ orderId}}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{orderId }}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{  orderId  }}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{  orderId}}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
        expect(buildUrl('/orders/{{orderId  }}/items', { orderId: 1, foo: 2 })).toBe('/orders/1/items');
    });
});
