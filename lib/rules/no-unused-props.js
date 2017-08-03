/**
 * @fileoverview should not connect unused state/dispatcher to props with filterSelector/filterDispatcher
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Should not connect unused state/dispatcher to props with filterSelector/filterDispatcher.',
      category: 'no-unused-props',
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

    let connectedProps;
    let usedProps;

    function getLastMemberPropertyValue(node) {
      let _node = node;
      while(_node.object.type === 'MemberExpression') {
        _node = _node.object;
      }
      if (_node.property.type === 'Identifier') {
        return _node.property.name;
      } else {
        return _node.property.value;
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Program: function() {
        connectedProps = new Set();
        usedProps = new Set();
      },
      CallExpression: function(node) {
        const { type, name } = node.callee;
        if (type === 'Identifier' && ['filterSelectors', 'filterDispatchers'].includes(name)) {
          node.arguments.forEach(arg => {
            if (arg.type === 'Literal') {
              connectedProps.add({
                prop: arg.value,
                node,
              });
            }
          });
        } else if (type === 'MemberExpression') {
          const callByProps = node.callee.object.name === 'props' || getLastMemberPropertyValue(node.callee) === 'props';
          if (callByProps) {
            usedProps.add(node.callee.property.name);
          }
        }
      },
      VariableDeclarator: function(node) {
        const destructuring = node.init && node.id && node.id.type === 'ObjectPattern';
        if (!destructuring) {
          return;
        }
        const thisDestructuring = node.init.type === 'ThisExpression';
        const thisPropsDestructuring = node.init.type === 'MemberExpression' &&
          node.init.object.type === 'ThisExpression' && node.init.property.name === 'props';
        const propsDestructuring = node.init.type === 'Identifier' && node.init.name === 'props';

        if (thisDestructuring) {
          node.id.properties.forEach(property => {
            const { key = {}, value = {} } = property;
            const isProps = key.name === 'props' || key.value === 'props';
            if (isProps && value.type === 'ObjectPattern') {
              value.properties.forEach(({ key }) => usedProps.add(key.name));
            }
          });
        } else if (thisPropsDestructuring || propsDestructuring) {
          node.id.properties.forEach(p => {
            const { key } = p;
            if (key && key.name) {
              usedProps.add(key.name);
            }
          });
        }
      },
      MemberExpression: function(node) {
        const isProps = node.object.name === 'props' || getLastMemberPropertyValue(node) === 'props';
        if (isProps) {
          usedProps.add(node.property.name);
        }
      },
      'Program:exit': function() {
        const unused = [];
        connectedProps.forEach(({ prop, node }) => {
          if (!usedProps.has(prop)) {
            unused.push({ prop, node });
          }
        });
        unused.forEach(({ node, prop }) => {
          context.report({
            node,
            message: '{{ prop }} is connected to props but not used.',
            data: {
              prop,
            },
          });
        });
        connectedProps = null;
        usedProps = null;
      }
    };
  }
};
