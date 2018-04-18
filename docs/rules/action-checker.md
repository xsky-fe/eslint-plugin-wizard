# test wizard toolbar&#39;s action checker (action-checker)

This rule was designed to test the action checker in toolbar was used as expected.

## Rule Details

This rule aims to check following incorrect usages of action checker:

1.  All the defined rules should be used by actions, including rules being added dynamically.
2.  All the rules used by actions should be defined, including actions' rules being added dynamically.
3.  A rule at least need 'fn', 'msg', 'nMsg' properties.

Examples of **incorrect** code for this rule:

```js
// [action-checker]
const checker = new Checker({
  rules: {
    ruleA: {
      fn(item) {
        return Boolean(item.a);
      },
      msg: 'ruleA was not passed',
      nMsg: 'ruleA was passed',
    },
    ruleB: {
      fn(item) {
        return Boolean(item.b);
      },
      msg: 'ruleB was not passed',
      nMsg: 'ruleB was passed',
    },
  },
  actions: {
    actionA: {
      rules: ['ruleA'],
    },
  },
});

checker.addAction('actionC', { rules: ['ruleC'] });
checker.addRule('ruleD', {
  fn(item) {
    return Boolean(item.d);
  },
  msg: 'ruleD was not passed',
  nMsg: 'ruleD was passed',
});
```

Examples of **correct** code for this rule:

```js
// [action-checker]
const checker = new Checker({
  rules: {
    ruleA: {
      fn(item) {
        return Boolean(item.a);
      },
      msg: 'ruleA was not passed',
      nMsg: 'ruleA was passed',
    },
    ruleB: {
      fn(item) {
        return Boolean(item.b);
      },
      msg: 'ruleB was not passed',
      nMsg: 'ruleB was passed',
    },
  },
  actions: {
    actionA: {
      rules: ['ruleA'],
    },
    actionB: {
      rules: ['ruleA', 'ruleB'],
    },
  },
});

checker
  .addAction('actionC', { rules: ['ruleC'] })
  .addAction('actionD', { rules: ['ruleD'] });
checker
  .addRule('ruleC', {
    fn(item) {
      return Boolean(item.c);
    },
    msg: 'ruleC was not passed',
    nMsg: 'ruleC was passed',
  })
  .addRule('ruleD', {
    fn(item) {
      return Boolean(item.d);
    },
    msg: 'ruleD was not passed',
    nMsg: 'ruleD was passed',
  });
```

## Further Reading

This rule relies on a technique called 'comments marker' (named by me :)), which looks like the attribute syntax in some other languages.

For example, when we write a comments like `// [action-checker]`, this rule will recognize the line following this comments has the Checker constructor, and applys the lint test to it.
