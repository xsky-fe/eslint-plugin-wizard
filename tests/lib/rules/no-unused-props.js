/**
 * @fileoverview should not connect unused state/dispatcher to props with filterSelector/filterDispatcher
 * @author yanzhen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-props');
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
ruleTester.run('no-unused-props', rule, {

  valid: [
    {
      code: `
const connector = connect(
  null,
  filterDispatchers(
    'patchClientGroups',
  ),
);
function ClientGroupFormContainer(props) {
  const { patchClientGroups } = props;
  props.callSomeThing();
  return null;
};
export default connector(ClientGroupFormContainer);
      `
    },
    {
      code: `
const connector = connect(
  filterSelectors('disf'),
  filterDispatchers(
    'patchClientGroups',
  ),
);
class ClientGroupFormContainer extends React.Component {
  render() {
    const { disf, staticClientGroup: { id } } = this.props;
    const { props: { patch, cluster: cluster1 } } = this;
    this.props.patchClientGroups();
    return null;
  }
};
export default connector(ClientGroupFormContainer);
      `
    },
    {
      code: `
const connector = connect(
  filterSelectors('disf'),
  filterDispatchers(
    'patchClientGroups',
    'postClientGroups',
    'setNotification',
  ),
);
class ClientGroupFormContainer extends React.Component {
  render() {
    const { mode, staticClientGroup, setNotification, callback, disf } = this.props;
    this.props.patchClientGroups(staticClientGroup.id);
    const { props } = this;
    props.postClientGroups(staticClientGroup.id);
    return null;
  }
};
export default connector(ClientGroupFormContainer);
      `
    },
  ],

  invalid: [
    {
      code: `
const connector = connect(
  filterSelectors('disf'),
  filterDispatchers(
    'patchClientGroups',
    'postClientGroups',
    'setNotification',
  ),
);
class ClientGroupFormContainer extends React.Component {
  render() {
    const { mode, staticClientGroup, setNotification, callback } = this.props;
    this.props.patchClientGroups(staticClientGroup.id);
    return null;
  }
};
export default connector(ClientGroupFormContainer);
      `,
      errors: [{
        message: 'disf is connected to props but not used.',
        type: 'CallExpression'
      }, {
        message: 'postClientGroups is connected to props but not used.',
        type: 'CallExpression'
      }]
    },
    {
      code: `
const connector = connect(
  filterSelectors('disf', 'cluster'),
  filterDispatchers(
    'setNotification',
  ),
);
class ClientGroupFormContainer extends React.Component {
  render() {
    const { mode } = this.props;
    this.props.patchClientGroups(staticClientGroup.id);
    return null;
  }
};
export default connector(ClientGroupFormContainer);
      `,
      errors: [{
        message: 'disf is connected to props but not used.',
        type: 'CallExpression'
      }, {
        message: 'cluster is connected to props but not used.',
        type: 'CallExpression'
      }, {
        message: 'setNotification is connected to props but not used.',
        type: 'CallExpression'
      }]
    }
  ]
});
