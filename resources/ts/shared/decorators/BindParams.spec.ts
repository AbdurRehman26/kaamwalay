import 'reflect-metadata';
import { BindParams } from './BindParams';

describe('decorators', () => {
    it('should bind params correctly', () => {
        class MyClass {
            a!: number;
            b!: number;

            sum() {
                return this.a + this.b;
            }
        }

        class MyService {
            @BindParams()
            sum(c: MyClass, add: number) {
                return c.sum() + add;
            }

            @BindParams()
            sums(a: MyClass, b: any) {
                return a.sum() + b.sum();
            }
        }

        const service = new MyService();
        const c = new MyClass();
        c.a = 2;
        c.b = 3;

        expect(service).toBeDefined();
        expect(service.sum({ a: 2, b: 3 } as any, 5)).toEqual(10);
        expect(service.sum(c, 5)).toEqual(10);

        expect(() => service.sums(c, { a: 2, b: 3 })).toThrow();
    });
});
