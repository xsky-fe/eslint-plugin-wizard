# eslint-plugin-wizard

eslint rules for wizard project

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-wizard`:

```
$ npm install eslint-plugin-wizard --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-wizard` globally.

## Usage

Add `wizard` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "wizard"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "wizard/use-t-function": "warn",
        "wizard/no-unused-props": "warn"
    }
}
```

## Supported Rules

* use-t-function
* no-unused-props





