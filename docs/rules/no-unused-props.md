# Should not connect unused state/dispatcher to props with filterSelector/filterDispatcher (no-unused-props)

Sometimes we filter unexpected selector/dispatcher and caused unused props.
This may cause unnecessary render.

## Rule Details

This rule aims to check whether all the selectors/dispatchers are working correctly.

Examples of **incorrect** code for this rule:

```js

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

```

Examples of **correct** code for this rule:

```js

const connector = connect(
  null,
  filterDispatchers(
    'patchClientGroups',
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

```

## When Not To Use It

In some special situations we need to connect selectors/dispatchers and pass its to child components. If we intended to do this, we can disable this rule because we are confident with this use.
