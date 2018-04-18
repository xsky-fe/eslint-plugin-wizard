function safeGet(obj, path, expect) {
  if (!path) {
    return obj;
  }
  let cur = obj;
  const propKeys = path.split('.');
  while (propKeys.length) {
    const propKey = propKeys.shift();
    cur = (cur || {})[propKey];
  }
  return cur || expect;
}

module.exports = { safeGet };
