# Robgrading

The project is based on

-   PHP 8
-   Laravel 8
-   MySQL 8
-   React
-   Material UI

### Requirements

-   Docker
-   Docker Compose
-   Composer
-   PHP >= 7.4 (only CLI)
-   NPM
-   Yarn

### Setup

```bash
$ git clone
$ composer install
$ yarn install

# Add host entry to be able to access the app via robograding.test domain
127.0.0.1 robograding.test

# Since we use Laravel Sail for local development environment, it is recommended to add this to your bash aliases
alias sail='[ -f sail ] && bash sail || bash vendor/bin/sail'
```

### Getting things started

```bash
# Create .env
$ cp .env.example .env

# Change values for these variables
APP_NAME=Robograding
APP_URL=http://robograding.test
DB_HOST=mysql
DB_DATABASE=robograding

# Starting the backend
$ ./vendor/bin/sail up    # or docker-compose up

# Migrations and Seeders
$ ./vendor/bin/sail artisan migrate --seed

# Starting the frontend
# 1. Dashboard application
$ yarn start

# 2. Admin application
$ yarn admin:start        # or BUILD_PRESET=admin yarn start
```

### Backend

#### Architecture

[Presentation](https://docs.google.com/presentation/d/1OCxnv5yxMzO24-4yooT55rqQbnNgyyDy6rvpyQiYozE/edit?usp=sharing)

##### ERD

[Diagram](https://drawsql.app/none-404/diagrams/xyz)

#### Development Flow

-   Git branch flow for branches (Wooter standard flow)
-   Follow REST principles for API development
-   Create tests, and run them before submitting PR
-   Write documentation for API
-   For code styling, we use PHP CS Fixer. It is already installed with composer. So you can integrate in your IDE for
    local inspection and automatic fixes.
-   When PR is created, our GitHub Action also runs to fix code styling automatically.
-   Once tests are passing and code styling is fixed, then you can request review on your PR.

#### API Documentation

For API documentation, we are using apiDocjs. Once you have written the documentation source files, you can use this
command to regenerate it:

```bash
# Change project's absolute path accordingly
$ yarn apidoc:start # Build and start the server
```

### Frontend

#### File Structure:

Backend structure and all the other things related to it are on their documentation, for the frontend, everything it's
organized into apps, currently:

-   `resources/ts/dashboard` responsible with all logics related to the dashboard pages (`/dashboard*`)
-   `resources/ts/admin` responsible with all logics related to the admin pages (`/admin*`)
-   `resources/ts/landings` will be created in future to handle static pages.

In addition to these apps we have a shared directory (`resources/ts/shared`) which will contain all logics that will be
shared across applications. To satisfy these apps we have alias for them

-   `@shared`
-   `@dashboard`
-   `@admin`
-   `@landings`

#### Rules:

1. Each file name will be respecting a naming convention based on:
    - The file it's a component, `camelCase.tsx`
    - The file it's a class, `PascalCase.ts`
    - The file it's a function, collection of functions or util, `camelCase.ts`
    - The file it's an interface, `PascalCase.ts`
    - The file it's an enum, `PascalCase.ts`
    - The file it's an entity/model, `PascalCase.ts`
    - The file it's a page, `PascalCase.ts`
    - The file it's a repository, `PascalCase.ts`
    - The file it's a service, `PascalCase.ts`
    - The file it's a hook, `useCamelCase.ts`
    - The file it's a style:
        - Normal scss style, `camelCase.scss`
        - Module scss style, `camelCase.module.scss`
        - Component css-in-js style, `style.ts` or `camelCaseStyle.ts` (preferable first one)
    - The file it's a redux slice. `camelCaseSlice.ts`
    - The file it's an asset, `camelCase.[extension]`
    - The file it's a blade file, `dash-case.blade.php`
2. Each application will follow the group by file type pattern, so if your file it's a page should be placed to the
   pages, if it's a component to components and so on.
3. Each component should have all files to the right path, example:

    - If our component it's a simple component, the suggested structure:

    ```
     [app]
     ├── ...
     └── components
         ├── ...
         └── Foo.tsx
    ```

    - If our component it's an advanced component, meaning, that we will have nested components, styles and so on.
      Considering that we are building a `List` component, that has a nested component `ListItem`, the suggested
      structure:

    ```
     [app]
     ├── ...
     └── components
         ├── ...
         ├── List
         │   ├── index.ts # export { List } from './List';
         │   ├── styles.ts
         │   └── List.tsx
         └── ListItem
             ├── index.ts # export { ListItem } from './ListItem';
             ├── styles.ts
             ├── ListItem.tsx
             └── ListItemText.tsx # Note that it's a private component that will be used only on ListItem.tsx
    ```

4. Avoid too long nesting levels like `components/Layout/Page/Header/Brand.tsx`, try to minimize as much as possible.
5. Use the right visibility for your component, meaning that if your components it's a nested component that will be
   used only inside that component, there's no reason to create an extra component for it.

    So following same List example, we will have 3 components List, ListItem, ListItemText. Only 2 of them are public,
    List and ListItem, because the usage will be:

    ```
    <List>
      <ListItem>Item</ListItem>
    </List
    ```

    The ListItemText will be used only inside ListItemText so, we will say that this component it's a private component
    so instead to create:

    - components/List/List.tsx
    - components/ListItem/ListItem.tsx
    - components/ListItemText/ListItemText.tsx

    We will create:

    - components/List/List.tsx
    - components/ListItem/ListItem.tsx
    - components/ListItem/ListItemText.tsx

    And of course all the other related files.

6. We like reusable & maintainable code, so if we already have the logics written by us or by the vendors, just reuse
   it, don't try to reinvent the wheel.
7. If the page/components and code in general it's complex, don't try to compress everything inside 1 file, split the
   code, using the visibility rule we talked about above (public/private), in that way we can easily understand and
   navigate through it.
8. Make sure you configured all development tools and write code according rules and code style.
9. Each API call should be living into a Repository.
10. Each Entity, Service, Repository should be created under `shared` application.
11. Each known data of any api should have an entity (model) defined.
12. Make sure there's no red in terminal, IDE or browser console.

**Note <sup>1</sup>**: Applications cannot directly import files from one to another. If we share files between the apps
we will have to create the file to the right directory and then use it accordingly.

**Note <sup>2</sup>**: To avoid wrong imports, at build time of each preset only the `@shared` and `@[BUILD_PRESET]`
paths are mounted, for example building admin app, we will have access to only `@shared` and `@admin` import paths.

More about frontend on [/resources/docs/frontend.md](resources/docs/frontend.md)

### FAQ

```
# @TODO
```
