const {test} = require('node:test');
const assert = require('node:assert/strict');
const utils = require('../utils');
test('random number includes both bounds and handles a one-value range', () => {
  const original = Math.random;
  try {
    Math.random = () => 0;
    assert.equal(utils.ran_no(3, 9), 3);
    Math.random = () => 0.999999;
    assert.equal(utils.ran_no(3, 9), 9);
    assert.equal(utils.ran_no(4, 4), 4);
  } finally { Math.random = original; }
});
test('uid produces the requested length using the permitted alphabet', () => {
  assert.equal(utils.uid(0), '');
  for (const length of [1, 8, 32]) {
    const id = utils.uid(length);
    assert.equal(id.length, length);
    assert.match(id, /^[A-Za-z0-9]+$/);
  }
});
test('forbidden sends HTTP 403 with matching plain-text headers and body', () => {
  const headers = {};
  let body;
  const res = {setHeader(k,v) {headers[k]=v;}, end(v) {body=v;}};
  utils.forbidden(res);
  assert.equal(res.statusCode, 403);
  assert.equal(headers['Content-Type'], 'text/plain');
  assert.equal(headers['Content-Length'], Buffer.byteLength(body));
  assert.equal(body, 'Forbidden');
});
