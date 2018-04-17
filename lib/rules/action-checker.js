/**
 * @fileoverview test wizard toolbar's action checker
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const COMMENT_MARKER = '[action-checker]';
const HAS_CHECKER = 'HAS_CHECKER';

module.exports = {
  meta: {
    docs: {
      description: "test wizard toolbar's action checker",
      category: 'valid-action-checker',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },

  create: function(context) {
    // variables should be defined here
    const sourceCode = context.getSourceCode();

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    const markerLines = {};

    function getStartLine(node) {
      return node.loc.start.line;
    }

    function getKeys(properties) {
      return properties.map((property) => property.key.name);
    }

    function checkUsedRules(definedRules, actionsNode) {
      const usedRules = new Set();
      actionsNode.value.properties.forEach((action) => {
        const rulesValueNode = action.value.properties.find(
          (property) => property.key.name === 'rules'
        ).value;
        if (rulesValueNode.type === 'ArrayExpression') {
          rulesValueNode.elements.forEach((element) => {
            if (element.type === 'Literal') {
              usedRules.add(element.value);
              if (!definedRules.includes(element.value)) {
                context.report({
                  message: "Rule '{{ rule }}' was not defined in the checker.",
                  node: element,
                  data: { rule: element.value },
                });
              }
            }
          });
        }
      });

      return usedRules;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program() {
        const comments = sourceCode.getAllComments();
        comments.forEach((comment) => {
          if (comment.value.trim() === COMMENT_MARKER) {
            markerLines[getStartLine(comment)] = comment;
          }
        });
      },
      ObjectExpression(expressionNode) {
        const startLine = getStartLine(expressionNode);
        if (markerLines[startLine - 1]) {
          const { properties, parent } = expressionNode;
          if (
            parent.type === 'NewExpression' &&
            parent.callee.name === 'Checker'
          ) {
            const rulesNode = properties.find(
              (property) => property.key.name === 'rules'
            );
            const actionsNode = properties.find(
              (property) => property.key.name === 'actions'
            );
            if (!rulesNode) {
            }
            if (!actionsNode) {
            }
            markerLines[startLine - 1] = HAS_CHECKER;
            const ruleNames = getKeys(rulesNode.value.properties);
            const usedRules = checkUsedRules(ruleNames, actionsNode);
            ruleNames.forEach((ruleName) => {
              if (!usedRules.has(ruleName)) {
                const propertyNode = rulesNode.value.properties.find(
                  (property) => property.key.name === ruleName
                );
                context.report({
                  message: "Rule '{{ rule }}' was defined but not used.",
                  node: propertyNode,
                  data: { rule: ruleName },
                });
              }
            });
          }
        }
      },
      'Program:exit'() {
        for (const line in markerLines) {
          if (markerLines[line] !== HAS_CHECKER) {
            context.report({
              message:
                'Action checker marker comments must be followed by checker expression.',
              node: markerLines[line],
            });
          }
        }
      },
    };
  },
};
