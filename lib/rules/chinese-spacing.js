/**
 * @fileoverview Warn when there is no space between Zh-En or Zh-Number
 * @author Ryan Huang
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'English or Number should be space around in regular strings',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/xsky-fe/eslint-plugin-wizard/',
    },

    schema: [],
  },

  create(context) {
    const regex = /([\u3400-\u9FBF][0-9a-zA-Z])|([0-9a-zA-Z][\u3400-\u9FBF])/;

    function checkSpacingAround(node, value) {
      if (typeof value === 'string' && regex.test(value)) {
        context.report({
          node,
          message: 'English or Number should have space around.',
        });
      }
    }

    const sourceCode = context.getSourceCode();
    return {
      Literal(node) {
        const token = sourceCode.getFirstToken(node);
        if (token.type === 'RegularExpression') {
          checkSpacingAround(node, node.regex.pattern);
        }
        if (token.type === 'String') {
          checkSpacingAround(node, node.value);
        }
      },
      TemplateElement(node) {
        checkSpacingAround(node, node.value.raw);
      },
    };
  },
};
