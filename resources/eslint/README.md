# eslint-plugin-robograding

Robograding eslint plugin

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-robograding`:

```sh
npm install eslint-plugin-robograding --save-dev
```

## Usage

Add `robograding` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "robograding"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "robograding/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here
