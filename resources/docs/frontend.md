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
    sayHi () {
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

    sayHi () {
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
