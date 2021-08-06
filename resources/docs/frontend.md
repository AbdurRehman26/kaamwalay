# Frontend

### Dependency injection (Injectable & Inject)

Similarly to Angular framework we support Dependency injection via decorators, and handled by inversify.

```ts
import { Injectable } from '@shared/decorators/Injectable';
import { Inject } from '@shared/decorators/Inject';
import { useInjectable } from '@shared/hooks/useInjectable';

// Define an injectable service
@Injectable()
class Foo {
    sayHi() {
        console.log("Hello world!");
    }
}

// To use the service foo there are multiple ways
// 1. Into another class/service/injectable
@Injectable()
class Bar {
    @Inject() private foo: Foo;

    constructor(
        @Inject() private foobar: Foo // that works too
    ) {
    }

    sayHi() {
        this.foo.sayHi();
        console.log("How are you today?");
    }
}

// 2. Into a component
function Bar() {
    const foo = useInjectable(Foo);
    // ...
    foo.sayHi();
}

// 3. Into plain typescript code
const foo = resolve(Foo);
// ...
foo.sayHi();
```

### Dialogs

#### Confirmation dialog

```js
// Usage inside component
const confirm = useConfirmation();

const result = await confirm('your message');
// returning a boolean depending on pressed button
```

### Data fetching

#### Repositories and Entities

The only solution for data fetching right now it's the repository with entity. The repository it's the class that's
handling the logics for fetching and api requests, while the entity it's the type of the data used to represent the
shape. With all of these things we are able to do:

```ts
// shared/entities/MyEntity.ts
class MyEntity extends Entity {
    public name!: string;
}

// shared/repositories/MyRepository.ts
@Injectable()
export class MyRepository extends Repository<MyEntity> {
    readonly endpointPath: string = 'my/endpoint';
    readonly model = MyEntity;

    // Custom repository method
    public async getCustomData() {
        const data = await this.endpoint.get('/only-names');

        return this.toEntity(data);
    }
}

// later in the code
const repository = resolve(MyRepository); // Visit Dependency Injection docs
const listData: PaginatedData<MyEntity> = await repository.list(); // send `GET /api/my/endpoint`
const listAllData: MyEntity[] = await repository.listAll(); // send `GET /api/my/endpoint?all=true`
const showData: MyEntity = await repository.show(1); // send `GET /api/my/endpoint/1`
const saveData: MyEntity = await repository.save({ name: 'test' }); // send `POST /api/my/endpoint` with body `{"name":"test"}`
const updateData: MyEntity = await repository.update(1, { name: 'test' }); // send `PUT /api/my/endpoint/1` with body `{"name":"test"}`
const destroyData: MyEntity = await repository.destroy(1); // send `DELETE /api/my/endpoint/1`
const customData: MyEntity = await repository.getCustomData(); // send `GET /api/my/endpoint/only-names`
```

### Repositories and data fetching hooks

We find how to define and use repositories in plain code, but still need to see how we can do it in components. For
component data fetching we are using a library called [swr](https://swr.vercel.app) with it's hook `useSWR`.

```ts
// Plain usage for repositories under components.
const repository = useRepository(MyRepository);

const fetchData = useCallback(async () => {
    const data = await repository.list();
    // ...
    console.log(data);
}, []);

// Hook method helper, used to call a defined method
const listData = useRepositoryMethod(CustomerAddressStatesRepository, 'list');

// call a method and pass options to it
const filteredData = useRepositoryMethod(CustomerAddressStatesRepository, 'list', {
    args: [{ params: { user_id: 1 } }],
});

// Args property has type array of your method params
// so let's say for example list method, has definition `list(config?: AxiosRequestConfig)`
// args will have there [config?: AxiosRequestConfig]
// considering that, show method which has `show<I = number>(resourceId: I, config?: AxiosRequestConfig)`
// args will look like `[resourceId: number, config?: AxiosRequestConfig`
// so the hook it's smart enough to get method arguments as a tuple type so we can do
// typecheck for the arguments passed to the method.
```

### Layout

#### Hiding parts of layout

Layout components support hiding parts of layout via LayoutOptions, that can be passed to Layout as property via
`routeOptions` which is a typeof `Record<string, LayoutOptions>`. Map which contain key string that's referring to the
route path, and LayoutOptions which it's a class that has methods for setting and checking options of the layout.

```tsx
// Current usage
const RoutesOptions = {
    '/submissions/new': LayoutOptions.empty(), // Will have no elements, returning children as it is
    '/submissions/:id/confirmation': LayoutOptions.build().withoutSidebar(), // WIll have all elements excluding the sidebar
};

// ...
<Layout routeOptions={RoutesOptions}>...</Layout>;
```
