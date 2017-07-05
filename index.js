'use strict';

const Wrap = require('./lib/wrap-fetch');

/**
 * wraps node-fetch/whatwg-fetch(/isomorphic-fetch).
 * adds basic headers and makes query parameter string by default
 *
 * @example
 * // require
 * const nodeFetch = require('node-fetch');
 * const fetch = require('wrap-fetch').set(nodeFetch);
 *
 * // get
 * fetch.get.text('https://www.yahoo.co.jp', {
 *   query: {user: 'darai0512'}
 * }).then((res) => console.log(res));
 *
 * // add headers
 * fetch.put.json('//localhost:8080', {
 *   body: {
 *     obj: 'here'
 *   },
 *   headers: {
 *     'X-HTTP-Method-Override': 'PUT',  // DELETE, PATCH
 *     'Content-Type' : 'text/html'
 *   }
 * }).then((res) => console.log(res));
 */

module.exports = {
  set: (fetch) => new Wrap(fetch),
  setGlobal: (fetch) => {
    if (!global.fetch) {
      global.fetch = new Wrap(fetch);
      global.Response = fetch.Response;
      global.Headers = fetch.Headers;
      global.Request = fetch.Request;
    }
    return global.fetch;
  },
};
