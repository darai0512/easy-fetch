'use strict';

const FetchWrap = require('./lib/easy-fetch');

/**
 * wraps node-fetch/whatwg-fetch(/isomorphic-fetch).
 * adds basic headers and makes query parameter string by default
 *
 * @param {string} url   - URL or FQDN (required)
 * @param {object} query - query parameter objectr (optional)
 * @param {object} body  - body object (optional)
 * @param {object} opt   - headers, etc (optional)
 * @return {object} promise
 * @example
 * // require
 * const nodeFetch = require('node-fetch');
 * const fetch = require('easy-fetch').set(nodeFetch);
 *
 * // get
 * fetch.get.text('https://www.yahoo.co.jp').then(res => console.log(res));
 *
 * // add headers
 * fetch.put.json('//localhost:8080', null, {body: 'here'}, {
 *   headers: {
 *     'X-HTTP-Method-Override': 'PUT',  // DELETE, PATCH
 *     'Content-Type' : 'text/html'
 *   }
 * });
 */

module.exports = {
  set: (fetch) => new FetchWrap(fetch),
  setGlobal: (fetch) => {
    if (!global.fetch) {
      global.fetch = new FetchWrap(fetch);
      global.Response = global.fetch.Response;
      global.Headers = global.fetch.Headers;
      global.Request = global.fetch.Request;
    }
  },
};
