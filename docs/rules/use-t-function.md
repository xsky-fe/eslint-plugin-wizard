# use t function to translate (use-t-function)

This rule will find all the string with chinese characters and check whether it was wrapped by the t function.

## Rule Details

This rule aims to ensure all the chinese contents were translated.

Examples of **incorrect** code for this rule:

```js

<Col xs={6}>名称：{name}</Col>

```

Examples of **correct** code for this rule:

```js

<Col xs={6}>{t('名称：')} {name}</Col>

```

## Further Reading

This rule can only check functions with name `t`. So PLEASE DO NOT RENAME THE T FUNCTION WHEN YOU IMPORT IT.
