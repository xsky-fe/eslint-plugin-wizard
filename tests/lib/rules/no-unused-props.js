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
    {
      code: `
const MyComponent = props => (
  <div>
    {t(
      '存储桶“%s”不允许被取消NFS共享，NFS网关上有客户端正在访问，需要手动退出以下客户端才可以被停止：',
      { args: selectedResource[0].name },
    )}
    {filterMountNfsGatewayMaps[0].mountClients.split(',').map((mountClient, idx) => (
      <p key={idx}><span className="icon icon-client"/>&nbsp;{mountClient}</p>
    ))}
  </div>
)
      `
    },
    {
      code: `
const connector = connect(
  filterSelectors('ui', 'disf'),
);

function UsersBar(props) {
  const selectedResource = getSelectedResource(props.ui, 'userTable');
  return (
    <p>
      {props.disf.isGuest && <span>yes</span>}
    </p>
  )
}
      `
    },
    {
      code: `
 const connector = connect(
  filterSelectors('license'),
);

class Dashboard extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { license } = nextProps;
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { license } = nextProps;
  }
  componentWillUpdate(nextProps, nextState) {
    const { license } = nextProps;
  }
  componentDidUpdate(prevProps, prevState) {
    const { license } = prevProps;
  }
};
      `
    }
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
