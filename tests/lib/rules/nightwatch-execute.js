/**
 * @fileoverview should check undefined variables in nightwatch execute domain
 * @author yanzhen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/nightwatch-execute"),

  RuleTester = require("eslint").RuleTester;

const parserOptions = {
  ecmaVersion: 8,
};


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions });
ruleTester.run("nightwatch-execute", rule, {

  valid: [
    {
      code: `
const b = new RegExp();
this.demoTest = function (browser) {
  const imagedata = 'buffer';
  this.api.execute(function(data) {
    const a = data;
    const b = new RegExp();
    return a;
  }, [imagedata], function(result) {
  });
};
      `
    },
    {
      code: `
this.demoTest = function (browser) {
  browser.execute(function() {
    return document.querySelectorAll('*').length;
  }, [], function(result) {
  });
};
      `
    },
    {
      code: `
this.demoTest = function (browser) {
  browser.execute(function() {
    return window.location.href.match('^https');
  }, [], function(result) {
  });
};
      `
    },
  ],

  invalid: [
    {
      code: `
const b = 1;
this.demoTest = function (browser) {
  browser.execute(function(data) {
    const a = b; // use undefined variable
    return a;
  }, [], function(result) {
  });
};
      `,
      errors: [{
        message: "'b' is not defined.",
        type: "Identifier"
      }]
    },
    {
      code: `
this.demoTest = function (browser) {
  browser.executeAsync(function(data) {
    const a = data1; // use undefined variable
    return a;
  }, [], function(result) {
  });
};
      `,
      errors: [{
        message: "'data1' is not defined.",
        type: "Identifier"
      }]
    }
  ]
});
