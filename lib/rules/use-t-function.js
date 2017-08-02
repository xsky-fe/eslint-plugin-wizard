/**
 * @fileoverview use t function to translate
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const SYMBOL_REGEX = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/;
const WORD_REGEX = /[\u3400-\u9FBF]/;

module.exports = {
  meta: {
    docs: {
      description: 'Use t function to translate chinese strings.',
      category: 'use-t-function',
      recommended: false
    },
    fixable: null,  // or 'code' or 'whitespace'
    schema: [],
  },

  create: function (context) {

    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function hasChinese(value) {
      return WORD_REGEX.test(value) || SYMBOL_REGEX.test(value);
    }

    function notWrappedByT(value, parentNode) {
      if (!parentNode) {
        return true;
      }
      if (parentNode.type !== 'CallExpression' || !parentNode.callee || !parentNode.arguments) {
        return true;
      }
      const { callee, arguments: args } = parentNode;
      if (callee.name !== 't' || value !== args[0].value) {
        return true;
      }
      return false;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Literal: function(node) {
        const { value, parent } = node;
        if (hasChinese(value) && notWrappedByT(value, parent)) {
          context.report({
            node,
            message: '{{ str }} contains Chinese, use t function to wrap it.',
            data: {
              str: node.value,
            },
          });
        }
      }
    };
  }
};
