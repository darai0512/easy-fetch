'use strict';
const assert = require('power-assert');
const nock = require('nock');
const bluebird = require('bluebird');
const Wrap = require('../lib/wrap-fetch');

const fqdn = '//test.co.jp';
const baseURL = 'http:' + fqdn;

const resText = 'text/plain';
const reqJson = {req: 'json'};

nock(baseURL)
  .get('/')
  .reply(200, resText)
  .get('/?req=text')
  .reply(200, {method: 'GET'})
  .post('/', reqJson)
  .reply(200, {method: 'POST'})
  .put('/', reqJson)
  .reply(200, {method: 'PUT'})
  .delete('/', reqJson)
  .reply(200, {method: 'DELETE'});

describe('wrap-fetch', function() {
  const fetch = new Wrap(require('node-fetch'));

  it('should get URL with params', function() {
    assert(fetch._addQuery(baseURL, {}) === baseURL);
    assert(fetch._addQuery(baseURL, null) === baseURL);
    assert(fetch._addQuery(baseURL, undefined) === baseURL);
    assert(fetch._addQuery(baseURL, {a: 1}) === baseURL + '?a=1');
    assert(fetch._addQuery(fqdn, {a: 1, b: 2}) === baseURL + '?a=1&b=2');
  });

  it('should get ContentLength', function() {
    assert(fetch._getContentLength('{"headers":{"content-length":33}}') === 33);
    assert(fetch._getContentLength('{"Daiki Arai":"アライダイキ"}') === 35);
  });

  it('should be get/post/put/delete', function(done) {
    bluebird.coroutine(function* (url) {
      let res = yield fetch.get.text(url);
      assert(res === resText);

      res = yield fetch.get.json(url, {query: {req: 'text'}});
      assert.deepStrictEqual(res, {method: 'GET'});

      res = yield fetch.post.json(url, {body: reqJson});
      assert.deepStrictEqual(res, {method: 'POST'});

      res = yield fetch.fetch(url, {body: reqJson, method: 'PUT'}).then((res) =>
        res.json()
      );
      assert.deepStrictEqual(res, {method: 'PUT'});

      res = yield fetch.delete.json(url, {body: reqJson});
      assert.deepStrictEqual(res, {method: 'DELETE'});

      done();
    })(baseURL + '/');
  });
});
