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

    function checkCallExpression(node) {
      const { type, callee, arguments: args } = node;
      if (type !== 'CallExpression' || !callee || !args) {
        return false;
      }
      return true;
    }

    function checkPlusOperator(node) {
      const { type, operator, parent } = node;
      if (type !== 'BinaryExpression' || operator !== '+' || !parent) {
        return false;
      }
      return true;
    }

    function notWrappedByT(value, parentNode) {
      if (!parentNode) {
        return true;
      }
      const isCallExpression = checkCallExpression(parentNode);
      const isPlusOperator = checkPlusOperator(parentNode);
      if (!isCallExpression && !isPlusOperator) {
        return true;
      }

      let callee;
      let valueIsValid;
      if (isCallExpression) {
        callee = parentNode.callee;
        valueIsValid = parentNode.arguments[0].value === value;
      } else if (isPlusOperator) {
        callee = parentNode.parent.callee;
        const { left, right } = parentNode.parent.arguments[0];
        valueIsValid = [left.value, right.value].includes(value);
      }

      if (callee.name !== 't' || !valueIsValid) {
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
