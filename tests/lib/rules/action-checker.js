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
  ],

  invalid: [
    // {
    //     code: "",
    //     errors: [{
    //         message: "Fill me in.",
    //         type: "Me too"
    //     }]
    // }
  ],
});
