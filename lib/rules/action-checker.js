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
    const checkerProps = {};

    function getStartLine(node) {
      return node.loc.start.line;
    }

    function getKeys(properties) {
      return properties.map((property) => property.key.name);
    }

    function getUsedRules(properties) {
      const usedRules = [];
      const rulesValueNode = properties.find(
        (property) => property.key.name === 'rules'
      ).value;
      if (rulesValueNode.type === 'ArrayExpression') {
        rulesValueNode.elements.forEach((element) => {
          if (element.type === 'Literal') {
            usedRules.push({
              name: element.value,
              node: element,
            });
          }
        });
      }
      return usedRules;
    }

    function collectDefinedRulesFromConstructor(idx, rulesNode) {
      rulesNode.value.properties.forEach((property) => {
        checkerProps[idx].definedRules.push({
          name: property.key.name,
          node: property,
        });
      });
    }

    function collectUsedRulesFromConstructor(idx, actionsNode) {
      actionsNode.value.properties.forEach((action) => {
        checkerProps[idx].usedRules.push(
          ...getUsedRules(action.value.properties)
        );
      });
    }

    function getCalleeName(calleeNode) {
      return calleeNode.object.name || getCalleeName(calleeNode.object.callee);
    }

    function getIdxByName(name) {
      for (const idx in checkerProps) {
        if (checkerProps[idx].name === name) {
          return idx;
        }
      }
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
        const idx = startLine - 1;
        if (markerLines[idx]) {
          const { properties, parent } = expressionNode;
          const checkerName = parent.parent.id.name;
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

            markerLines[idx] = HAS_CHECKER;
            checkerProps[idx] = {
              name: checkerName,
              definedRules: [],
              usedRules: [],
            };
            collectDefinedRulesFromConstructor(idx, rulesNode);
            collectUsedRulesFromConstructor(idx, actionsNode);
          }
        }
      },
      CallExpression(expressionNode) {
        if (expressionNode.callee.type === 'MemberExpression') {
          // addAction and addRule can be called chainable
          const idx = getIdxByName(getCalleeName(expressionNode.callee));
          if (idx !== undefined) {
            switch (expressionNode.callee.property.name) {
              case 'addAction':
                const [, actionObj] = expressionNode.arguments;
                checkerProps[idx].usedRules.push(
                  ...getUsedRules(actionObj.properties)
                );
                break;
              case 'addRule':
                const [ruleNameNode] = expressionNode.arguments;
                checkerProps[idx].definedRules.push({
                  name: ruleNameNode.value,
                  node: ruleNameNode,
                });
                break;
              default:
                break;
            }
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
        for (const idx in checkerProps) {
          const { definedRules, usedRules } = checkerProps[idx];
          definedRules.forEach(({ name, node }) => {
            if (!usedRules.some((usedRule) => usedRule.name === name)) {
              context.report({
                message: "Rule '{{ name }}' was defined but not used.",
                node,
                data: { name },
              });
            }
          });
          usedRules.forEach(({ name, node }) => {
            if (
              !definedRules.some((definedRule) => definedRule.name === name)
            ) {
              context.report({
                message: "Rule '{{ name }}' was not defined in the checker.",
                node,
                data: { name },
              });
            }
          });
        }
        console.log(checkerProps[2]);
      },
    };
  },
};
