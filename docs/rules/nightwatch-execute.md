# should check undefined variables in nightwatch execute domain (nightwatch-execute)

Please describe the origin of the rule here.


## Rule Details

This rule aims to...

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
