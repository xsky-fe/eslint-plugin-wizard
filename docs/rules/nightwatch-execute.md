# should check undeclared variables in nightwatch execute scope (nightwatch-execute)

When using nightwatch's execute/executeAsync api, we will pass a function to the browser's JS env and evaluate the function. All the arguments of this function need be passed as the second argument of the api callee. But since eslint do not recognized the evaluate function will be execute in another scope, it will not check whether there is some undeclared variables in the evaluate function.


## Rule Details

This rule aims make sure no undeclared variables are used in execute/executeAsync scope.

Examples of **incorrect** code for this rule:

```js

this.demoTest = function (browser) {
  const b = 1;
  const imageData = 'buffer';
  browser.execute(function(data) {
    const a = b; // use undefined variable
    return a;
  }, [imagedata], function(result) {
  });
};

```

Examples of **correct** code for this rule:

```js

this.demoTest = function (browser) {
  browser.execute(function(data) {
    const a = data; // can access arguments of the execute function
    document.querySelector('*') // document is a valid global variable
    if (window.location.href.match('^https')) { // window is also a valid global variable
      return 'https';
    }
    return a;
  }, [], function(result) {
  });
};

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
