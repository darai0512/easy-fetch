wraps node-fetch/whatwg-fetch(/isomorphic-fetch) with adding basic headers and making query parameter string by default.

## API

- fetch(url, option)
  - param {string} url     - URL without query-parameter (required)
  - param {object} option  - method, headers, query, body, etc (optional)
  - return {Promise(object)} - needs res.text() or res.json()
- {get/post/put/delete}.{text/json}(url, option)
  - param {string} url     - URL without query-parameter (required)
  - param {object} option  - headers, query, body, etc (optional)
  - return {Promise(string)} - return text or json

## Example

```
// require
const nodeFetch = require('node-fetch');
const fetch = require('wrap-fetch').set(nodeFetch);

// get
fetch.get.text('https://www.yahoo.co.jp', {
  query: {user: 'darai0512'}
}).then((res) => console.log(res));

// add headers
fetch.put.json('//localhost:8080', {
  body: {
    obj: 'here'
  },
  headers: {
    'X-HTTP-Method-Override': 'PUT',  // DELETE, PATCH
    'Content-Type' : 'text/html'
  }
}).then((res) => console.log(res));
```
