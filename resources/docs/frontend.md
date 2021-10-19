# Frontend

### Dependency injection (Injectable & Inject)

Similarly to Angular framework we support Dependency injection via decorators, and handled by inversify.

```typescript
import { Injectable } from '@shared/decorators/Injectable';
import { Inject } from '@shared/decorators/Inject';
import { useInjectable } from '@shared/hooks/useInjectable';

// Define an injectable service
@Injectable('Foo')
class Foo {
    sayHi() {
        console.log("Hello world!");
    }
}

// To use the service foo there are multiple ways
// 1. Into another class/service/injectable
@Injectable('Bar')
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
const foo = app(Foo);
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

### Data manipulation & fetching

#### Repositories and Entities

The only solution for data fetching right now it's the repository with entity. The repository it's the class that's
handling the logics for fetching and api requests, while the entity it's the type of the data used to represent the
shape. With all of these things we are able to do:

```typescript
// shared/entities/MyEntity.ts
class MyEntity extends Entity {
    public name!: string;
}

// shared/repositories/MyRepository.ts
@Injectable('MyRepository')
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
const repository = app(MyRepository); // Visit Dependency Injection docs
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

```typescript
// Plain usage for repositories under components.
const repository = useRepository(MyRepository);

const fetchData = useCallback(async () => {
    const data = await repository.list();
    // ...
    console.log(data);
}, []);

// Hook method helper, used to call a defined method
const listData = useRepositoryMethod(AddressStatesRepository, 'list');

// call a method and pass options to it
const filteredData = useRepositoryMethod(AddressStatesRepository, 'list', {
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

### Data transfer object (DTO) & Validation
DTO stands for Data Transfer Object, and represents the shape of our data that's passed from a method to another, while the definition
it's easy and simple the validation could be a nightmare since must probably you don't like to define a validator, schema for each data
and property everytime. So for that we have DTO which can be easily validated with only one decorator.
We are using [class-validator](https://www.npmjs.com/package/class-validator) for validating properties, 
[class-transform](https://www.npmjs.com/package/class-transformer) for converting plain JSON to class definition and 
[reflect-metadata](https://www.npmjs.com/package/reflect-metadata) so types can be discovered automatically.
With all that info, let's get started.

```typescript
// shared/dto/MyRequestDto.ts
import { IsEmail, IsNotEmpty } from "class-validator";
import { ValidateMethodParams, ValidateMethodParamsAsync } from "@shared/decorators/ValidateMethodParams";
import { ValidationException } from "@shared/exceptions/ValidationException";

export class MyRequestDto {
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsNotEmpty()
    public name!: string;
}

// shared/repositories/MyRepository.ts
@Injectable('MyRepository')
export class MyRepository extends Repository<MyEntity> {
    readonly endpointPath: string = 'my/endpoint';
    readonly model = MyEntity;

    @ValidateMethodParams()
    public sendFoo(myRequestDto: MyRequestDto) {
        // ...
    }

    // Used for async rules, can be used only on async methods. 
    // An exception will be throw for non async methods.
    @ValidateMethodParamsAsync() 
    public async sendBar(myRequestDto: MyRequestDto) {
        // ...
    }
}

// Later in the code
const repository = app(MyRepository);
// Will fail and throw `ValidationException`
repository.sendFoo({ email: 'test' }) 

// Treat errors 
try {
    // Will fail and throw `ValidationException`
    repository.sendFoo({ email: 'test' }) 
} catch (e) {
    if (e instanceof ValidationException) {
        // errors it's a type of ValidationError[] from class-validator
        // https://www.npmjs.com/package/class-validator#validation-errors
        console.log(e.errors);
    }
}
```

#### Binding plain object to defined type
Plain JSON (objects) are nice, but class objects are awesome :D, there's a big difference between this two examples.
```typescript
class Foo {
    a: number;
    b: number;

    sum () {
        return this.b + this.a;
    }
}

class MyService {
    doTheJob (foo: Foo) {
        console.log(foo.sum());
    } 
}

const foo$ = new Foo();
foo$.bar = 1;
foo$.foobar = 2;

new MyService().doTheJob({ a: 1, b: 2});
new MyService().doTheJob(foo$);
```
These two are kind of same (if we check the structure) but when we want to use class methods? 
That's the issue we have, we cannot use sum method because it's not there.

So what we can do it's to bind parameter values and use `class-transformer` to serialize the object to the class
behind the scene.

So by adding 1 decorator we will be able to use both of examples above without any issue.

```typescript
import { BindParams } from "@shared/decorators/BindParams";

class MyService {
    @BindParams()
    doTheJob(foo: Foo) {
        console.log(foo.sum());
    }
}
```

That will instruct the method to go through each param and convert it to the defined type.

**NOTE:** This approach works only for objects and for the parameters that has a class as a type, it's not working with interfaces (at least for now).

### Layout

#### Hiding parts of layout

Layout components support hiding parts of layout via LayoutOptions, that can be passed to Layout as property via
`routeOptions` which is a typeof `Record<string, LayoutOptions>`. Map which contain key string that's referring to the
route path, and LayoutOptions which it's a class that has methods for setting and checking options of the layout.

```typescriptx
// Current usage
const RoutesOptions = {
    '/submissions/new': LayoutOptions.empty(), // Will have no elements, returning children as it is
    '/submissions/:id/confirmation': LayoutOptions.build().withoutSidebar(), // WIll have all elements excluding the sidebar
};

// ...
<Layout routeOptions={RoutesOptions}>...</Layout>;
```

#### Protected Routes
A protected route it's used to hide a page for a user that is not logged in. For that we have two components, the main one 
`ProtectedRoute` it's used to allow only logged user to view the request page, and `GuestOnlyRoute` which it's used to show the 
page as it says, to only guest users (sign in page for example, if you are logged in, you don't have to view the page again).

Usage:

```tsx
// Behind the sceene you will have same Route of react-router-dom package, but under the hood,
// the component it's doing all the checks and wait for the auth, deciding what to do when it's completed.
// In case of Loading, the page will show a circular progress
// In case of no auth, the user will be redirected to the default specified route, or in case we want a custom route, 
// we can provide it via prop like `redirectRoute={'/my/new/route'}`
// At the end if there's no check and auth it's there, the route will render the desired component.
<ProtectedRoute exact path={'/my/path'} component={MyCompnent} />

// It's doing same thing as the one above, the only difference being that, in case of auth, the component wil take you
// to the default path or the one provided as prop.
<GuestOnlyRoute exact path={'/my/path'} component={MyCompnent} /> 
```


### UI
#### Notifications
Notifications are handled by MaterialUI for frontend part (Snackbar component) and redux for the backend part,
we store them in a queue, and show one by one until the queue it's empty.

Usage:

```ts
// Via hook inside components
import { useNotifications } from "@shared/hooks/useNotifications";
import { NotificationTypeEnum } from "@shared/constants/NotificationTypeEnum";
import { NotificationsService } from "@shared/services/NotificationsService";
import { app } from "@shared/lib/app";

const notifications = useNotifications();
notifications.notify(NotificationTypeEnum.Success, "This is a notification message", "This is an optional notification title")

// Aliases
notifications.info('This is a info notification.', 'Optional title');
notifications.success('This is a success notification.', 'Optional title');
notifications.warning('This is a warning notification.', 'Optional title');
notifications.error('This is a error notification.', 'Optional title');

// Protected properties & methods for building a notifications container.
notifications.notifications // a `NotificationItem[]` which contain all active notifications.
notifications.close // a method that accept a `NotificationItem | string` as parameter used to close the notification and remove it from queue.

// Outside components
// via static methods
NotificationsService.info('This is a info notification.', 'Optional title');
NotificationsService.success('This is a success notification.', 'Optional title');
NotificationsService.warning('This is a warning notification.', 'Optional title');
NotificationsService.error('This is a error notification.', 'Optional title');

// via injectable
const notificationsService = app(NotificationsService);
notificationsService.info('This is a info notification.', 'Optional title');
// ...

// in injectable classes
@Injectable
class Foo {
    constructor(
        @Inject() private notificationsService: NotificationsService
    ) {
    }
    
    bar () {
        this.notificationsService.info('This is a info notification.', 'Optional title');
    }
}
```

### Authentication
Authentication it's done with redux and the access token it's stored in the storage with the help of [localforage](https://localforage.github.io/localForage/#localforage)
package.

Usage:

```ts
import { useAuth } from "@shared/hooks/useAuth";

// Inside react components
function Foo() {
    const {
        user,           // UserEntity object of logged user
        checkAuth,      // Send the auth check request and see if the user it's still logged in
        login,          // Send the login request and obtain session for the user
        logout,         // revoke current auth session
        accessToken,    // access token used for authorization
        authenticated,  // authentification state value
        checking,       // loading value, if the checking it's true means that the auth wasn't loaded yet.
    } = useAuth();
}

// Inside the plain logics
// TODO: implement
```

## Storage
```ts
// TODO: implement
```
