'use strict';

const querystring = require('querystring');

module.exports = class FetchWrap {
  /**
   * sets fetch
   *
   * @param {function} fetch - such as node-fetch, whatwg-fetch (required)
   */
  constructor(fetch) {
    this.fetch = fetch;
    this.Response = fetch.Response;
    this.Headers = fetch.Headers;
    this.Request = fetch.Request;

    this.get = {
      text: (url, query = {}, body = null, opt = {}) =>
        this._getText('GET', url, query, body, opt),
      json: (url, query = {}, body = null, opt = {}) =>
        this._getJson('GET', url, query, body, opt),
    };
    this.post = {
      text: (url, query = {}, body = null, opt = {}) =>
        this._getText('POST', url, query, body, opt),
      json: (url, query = {}, body = null, opt = {}) =>
        this._getJson('POST', url, query, body, opt),
    };
    this.put = {
      text: (url, query = {}, body = null, opt = {}) =>
        this._getText('PUT', url, query, body, opt),
      json: (url, query = {}, body = null, opt = {}) =>
        this._getJson('PUT', url, query, body, opt),
    };
    this.delete = {
      text: (url, query = {}, body = null, opt = {}) =>
        this._getText('DELETE', url, query, body, opt),
      json: (url, query = {}, body = null, opt = {}) =>
        this._getJson('DELETE', url, query, body, opt),
    };
  }

  /**
   * executes fetch and get text/html
   *
   * @param {string} method - method of {GET,POST,PUT,DELETE,PATCH} (required)
   * @param {string} url   - URL or FQDN (required)
   * @param {object} query - query parameter objectr (required)
   * @param {object} body  - body object (required)
   * @param {object} additional - headers, etc (required)
   * @return {object} promise
   */
  _getText(method, url, query, body, additional) {
    if (typeof additional.headers !== 'object')
      additional.headers = {};
    additional.headers.Accept = 'text/plain,text/html';
    return this.fetch(
      this._addQuery(url, query),
      this._getOption(method, body, additional)
    ).then((res) => res.text());
  }

  /**
   * executes fetch and get json
   *
   * @param {string} method - method of {GET,POST,PUT,DELETE,PATCH} (required)
   * @param {string} url   - URL or FQDN (required)
   * @param {object} query - query parameter objectr (required)
   * @param {object} body  - body object (required)
   * @param {object} additional - headers, etc (required)
   * @return {object} promise
   */
  _getJson(method, url, query, body, additional) {
    if (typeof additional.headers !== 'object')
      additional.headers = {};
    additional.headers.Accept = 'application/json';
    if (method === 'GET' && body !== null)
      additional.headers['content-length'] = this._getContentLength(body);
    return this.fetch(
      this._addQuery(url, query),
      this._getOption(method, body, additional)
    ).then((res) => res.json());
  }

  /**
   * adds query parameter to url
   *
   * @param {string} url   - url or FQDN without query parameter
   * @param {object} query - query parameter
   * @return {string} url
   */
  _addQuery(url, query = {}) {
    url = /^\/\//.test(url) ? 'http:' + url : url;
    const option = {encodeURIComponent: querystring.unescape};
    const queryStr = querystring.stringify(query, null, null, option);
    return queryStr === '' ? url : url + '?' + queryStr;
  }

  /**
   * makes option object for node-fetch
   *
   * @param {string} method     - request method
   * @param {object} body       - request body in JSON format
   * @param {object} additional - added to headers option, etc
   * @return {object} option
   */
  _getOption(method, body, additional) {
    let option = {
      headers: {
        'Content-Type': 'application/json',
      },
      // ...additional // spread-operator: es7 or --harmony
    };

    // instead of spread-operator
    for (const key of Object.keys(additional))
      option[key] = Object.assign(additional[key], option[key]);

    option.method = method;
    if (body !== null)
      option.body = JSON.stringify(body);
    return option;
  }

  /**
   * @param {object} body
   * @return {number} byteLength
   */
  _getContentLength(body) {
    const bodyStr = JSON.stringify(body);
    if (typeof self === 'undefined')
      return Buffer.byteLength(bodyStr);
    else
      return encodeURIComponent(bodyStr).replace(/%../g, 'z').length;
  }
};
