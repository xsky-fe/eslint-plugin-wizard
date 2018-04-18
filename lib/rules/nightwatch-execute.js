/**
 * @fileoverview should check undefined variables in nightwatch execute domain
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const { safeGet } = require('../utils');

// check whether current scope is the first argument of execute/executeAsync call expression
function isFirstArgument(calleeArgument, scopeBlock) {
  const { type, start, end } = scopeBlock;
  if (type !== 'FunctionExpression') {
    return false;
  }
  if (start !== calleeArgument.start || end !== calleeArgument.end) {
    return false;
  }
  return true;
}

const apis = ['execute', 'executeAsync'];
const whitelist = [
  'Array',
  'Boolean',
  'Date',
  'Error',
  'Function',
  'Number',
  'Object',
  'RegExp',
  'String',
  'Symbol',
  'window',
  'document',
];

module.exports = {
  meta: {
    docs: {
      description:
        'should check undefined variables in nightwatch execute domain',
      category: 'nightwatch-execute-no-undef',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
  },

  create: function(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'Program:exit': function() {
        const globalScope = context.getScope();

        const stack = globalScope.childScopes.slice();

        while (stack.length) {
          const scope = stack.pop();

          stack.push.apply(stack, scope.childScopes);
          const calleeName = safeGet(
            scope,
            'block.parent.callee.property.name'
          );
          if (
            apis.includes(calleeName) &&
            isFirstArgument(scope.block.parent.arguments[0], scope.block)
          ) {
            const undefs = scope.through
              .filter((ref) => !whitelist.includes(ref.identifier.name))
              .forEach((ref) =>
                context.report({
                  node: ref.identifier,
                  message: "'{{name}}' is not defined.",
                  data: ref.identifier,
                })
              );
          }
        }
      },
    };
  },
};
