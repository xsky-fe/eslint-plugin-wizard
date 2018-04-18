/**
 * @fileoverview test wizard toolbar&#39;s action checker
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/action-checker'),
  RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions });
ruleTester.run('action-checker', rule, {
  valid: [
    {
      code: `
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
    }
  }
});

checker
  .addAction('actionC', { rules: ['ruleC'] })
  .addAction('actionD', { rules: ['ruleD'] });
checker.addRule('ruleC', {
  fn(item) {
    return Boolean(item.c);
  },
  msg: 'ruleC was not passed',
  nMsg: 'ruleC was passed',
}).addRule('ruleD', {
  fn(item) {
    return Boolean(item.d);
  },
  msg: 'ruleD was not passed',
  nMsg: 'ruleD was passed',
});
      `,
    },
    {
      code: `
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
  },
  actions: {
    actionA: {
      rules: ['!ruleA'],
    },
    actionB: {
      rules: ['ruleA'],
    }
  }
});
      `,
    },
    {
      code: `
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
        return Boolean(item.a);
      },
      msg: 'ruleA was not passed',
      nMsg: 'ruleA was passed',
      required: ['!ruleA'],
    },
  },
  actions: {
    actionA: {
      rules: ['ruleB'],
    },
  }
});
      `,
    },
    {
      code: `
// [action-checker]
const c = new Checker({});
        `,
    },
  ],

  invalid: [
    {
      code: `
// [action-checker]

        `,
      errors: [
        {
          message:
            'Action checker marker comments must be followed by checker expression.',
          type: 'Line',
        },
      ],
    },
    {
      code: `
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
    }
  }
});

checker
  .addAction('actionC', { rules: ['ruleC'] });
checker.addRule('ruleD', {
  fn(item) {
    return Boolean(item.d);
  },
  msg: 'ruleD was not passed',
  nMsg: 'ruleD was passed',
});
      `,
      errors: [
        {
          message: "Rule 'ruleB' was defined but not used.",
          type: 'Property',
        },
        {
          message: "Rule 'ruleC' was not defined in the checker.",
          type: 'Literal',
        },
        {
          message: "Rule 'ruleD' was defined but not used.",
          type: 'Literal',
        },
      ],
    },
    {
      code: `
// [action-checker]
const checker = new Checker({
  rules: {
    ruleA: {},
  },
  actions: {
    actionA: {
      rules: ['ruleA'],
    }
  }
});
        `,
      errors: [
        {
          message: "'fn' was required in a rule.",
          type: 'ObjectExpression',
        },
        {
          message: "'msg' was required in a rule.",
          type: 'ObjectExpression',
        },
        {
          message: "'nMsg' was required in a rule.",
          type: 'ObjectExpression',
        },
      ],
    },
  ],
});
