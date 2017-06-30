'use strict';
const assert = require('power-assert');
const nock = require('nock');
const bluebird = require('bluebird');
const FetchWrap = require('../lib/easy-fetch');

const fqdn = '//test.co.jp';
const baseURL = 'http:' + fqdn;

const resText = 'text/plain';
const reqJson = {req: 'json'};
const resJson = {res: 'application/json'};

nock(baseURL)
  .get('/')
  .reply(200, resText)
  .get('/?req=text')
  .reply(200, Object.assign({method: 'GET'}, resJson))
  .post('/', reqJson)
  .reply(200, Object.assign({method: 'POST'}, resJson))
  .put('/', reqJson)
  .reply(200, Object.assign({method: 'PUT'}, resJson))
  .delete('/', reqJson)
  .reply(200, Object.assign({method: 'DELETE'}, resJson));

describe('easy-fetch', function() {
  const fetch = new FetchWrap(require('node-fetch'));

  it('should get URL with params', function() {
    assert(fetch._addQuery(baseURL, {}) === baseURL);
    assert(fetch._addQuery(baseURL, null) === baseURL);
    assert(fetch._addQuery(baseURL, undefined) === baseURL);
    assert(fetch._addQuery(baseURL, {a: 1}) === baseURL + '?a=1');
    assert(fetch._addQuery(fqdn, {a: 1, b: 2}) === baseURL + '?a=1&b=2');
  });

  it('should get ContentLength', function() {
    const test = {
      headers: {
        'content-length': 33,
      },
    };
    assert(fetch._getContentLength(test) === 33);
  });

  it('should be get/post/put/delete', function(done) {
    bluebird.coroutine(function* (url) {
      let res = yield fetch.get.text(url);
      assert(res === resText);
      res = yield fetch.get.json(url, {req: 'text'});
      assert.deepStrictEqual(res, {method: 'GET', res: 'application/json'});
      res = yield fetch.post.json(url, null, reqJson);
      assert.deepStrictEqual(res, {method: 'POST', res: 'application/json'});
      res = yield fetch.put.json(url, null, reqJson);
      assert.deepStrictEqual(res, {method: 'PUT', res: 'application/json'});
      res = yield fetch.delete.json(url, null, reqJson);
      assert.deepStrictEqual(res, {method: 'DELETE', res: 'application/json'});
      done();
    })(baseURL + '/');
  });
});
