/**
 * @fileoverview use t function to translate
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/use-t-function'),

  RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('use-t-function', rule, {

  valid: [
    {
      code: 'fn()',
    }
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: '',
      errors: [{
        message: 'Fill me in.',
        type: 'Me too'
      }]
    }
  ]
});
