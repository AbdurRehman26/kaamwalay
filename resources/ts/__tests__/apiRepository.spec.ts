import 'reflect-metadata';

import { PaginatedData } from '@shared/classes/PaginatedData';
import { Injectable } from '@shared/decorators/Injectable';
import { Entity } from '@shared/entities/Entity';
import { resolveInjectable } from '@shared/lib/dependencyInjection/resolveInjectable';
import { Repository } from '@shared/repositories/Repository';

class Bar extends Entity {}

@Injectable('Foo')
class Foo extends Repository<Bar> {
    protected endpointPath: string = 'customer/addresses/states';
    protected model = Bar;
}

describe('API Repositories', () => {
    it('should correctly send list request', async () => {
        const foo = resolveInjectable(Foo);

        const data = await foo.list();
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(PaginatedData);
        expect(data.data[0]).toBeInstanceOf(Bar);
    });
});
