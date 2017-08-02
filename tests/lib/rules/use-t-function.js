/**
 * @fileoverview use t function to translate
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-t-function');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('use-t-function', rule, {

  valid: [
    { code: 'fn()' },
    { code: '"This is not a chinese string."' },
    { code: '\'This is not a chinese string.\'' },
    { code: 'const s = str => `string is ${str}`;' },
    { code: '<Col xs={6}>{t(\'名称：\')} {name}</Col>' },
    { code: '<p>{t(\'当前已选择%d个块存储卷 共%d条信息\', { args: [value.length, totalCount] })}</p>' },
    { code: '<Well>{t(\'提示：请填写集群初始化密码，确保由管理员安全安装集群，\' + \'初始化密码已经在安装服务器的以下位置生成。\')}</Well>' }
  ],

  invalid: [
    {
      code: '<Col xs={6}>名称：{name}</Col>',
      errors: [
        {
          message: '名称： contains Chinese, use t function to wrap it.',
          type: 'Literal'
        }
      ],
    },
    {
      code: '\'。\'',
      errors: [
        {
          message: '。 contains Chinese, use t function to wrap it.',
          type: 'Literal'
        }
      ],
    }
  ],

});
