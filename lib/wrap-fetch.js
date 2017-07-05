'use strict';

// Node.js Core API or npm package
const querystring = require('querystring');

module.exports = class FetchWrap {
  /**
   * sets fetch
   *
   * @param {function} fetch - such as node-fetch, whatwg-fetch (required)
   */
  constructor(fetch) {
    this._fetch = fetch;
    this.Response = fetch.Response;
    this.Headers = fetch.Headers;
    this.Request = fetch.Request;

    this.get = {
      text: (url, opt = {}) =>
        this._getText('GET', url, opt),
      json: (url, opt = {}) =>
        this._getJson('GET', url, opt),
    };
    this.post = {
      text: (url, opt = {}) =>
        this._getText('POST', url, opt),
      json: (url, opt = {}) =>
        this._getJson('POST', url, opt),
    };
    this.put = {
      text: (url, opt = {}) =>
        this._getText('PUT', url, opt),
      json: (url, opt = {}) =>
        this._getJson('PUT', url, opt),
    };
    this.delete = {
      text: (url, opt = {}) =>
        this._getText('DELETE', url, opt),
      json: (url, opt = {}) =>
        this._getJson('DELETE', url, opt),
    };
  }

  /**
   * executes raw fetch with basical options and query parameters
   *
   * @param {string} url - URL or FQDN + path (required)
   * @param {object} opt - query, body, headers, etc (optional)
   * @return {object} promise
   */
  fetch(url, opt = {}) {
    const query = opt.query || {};
    delete opt.query;
    return this._fetch(
      this._addQuery(url, query),
      this._reform(opt)
    );
  }

  /**
   * executes fetch and get text/html
   *
   * @param {string} method - method of {GET,POST,PUT,DELETE,PATCH} (required)
   * @param {string} url   - URL or FQDN + path (required)
   * @param {object} opt - query, body, headers, etc (required)
   * @return {object} promise
   */
  _getText(method, url, opt) {
    opt = this._reform(opt);
    opt.headers.Accept = 'text/plain,text/html';
    opt.method = method;
    return this.fetch(url, opt).then((res) => res.text());
  }

  /**
   * executes fetch and get json
   *
   * @param {string} method - method of {GET,POST,PUT,DELETE,PATCH} (required)
   * @param {string} url   - URL or FQDN + path (required)
   * @param {object} opt - query, body, headers, etc (required)
   * @return {object} promise
   */
  _getJson(method, url, opt) {
    opt = this._reform(opt);
    opt.headers.Accept = 'application/json';
    opt.method = method;
    return this.fetch(url, opt).then((res) => res.json());
  }

  /**
   * adds query parameter to url
   *
   * @param {string} url   - url or FQDN without query parameter
   * @param {object} query - query parameter
   * @return {string} url
   */
  _addQuery(url, query) {
    url = /^\/\//.test(url) ? 'http:' + url : url;
    const option = {encodeURIComponent: querystring.unescape};
    const queryStr = querystring.stringify(query, null, null, option);
    return queryStr === '' ? url : url + '?' + queryStr;
  }

  /**
   * makes option object
   *
   * @param {object} option - added to headers option, etc
   * @return {object} option
   */
  _reform(option) {
    if (!option.headers || typeof option.headers !== 'object')
      option.headers = {'Content-Type': 'application/json'};
    else if (!option.headers['Content-Type'])
      option.headers['Content-Type'] = 'application/json';

    if (typeof option.body === 'object' && option.body !== null)
      option.body = JSON.stringify(option.body);
    if (!option.headers['content-length'] &&
      (option.method === 'GET' || typeof option.method === 'undefined') &&
      typeof option.body === 'string')
      option.headers['content-length'] = this._getContentLength(option.body);
    return option;
  }

  /**
   * In not browser but Node.js (= typeof self === 'undefined),
   * returns the same value as `Buffer.byteLength(bodyStr)`
   *
   * @param {string} bodyStr
   * @return {number} byteLength
   */
  _getContentLength(bodyStr) {
    return encodeURIComponent(bodyStr).replace(/%../g, 'z').length;
  }
};
