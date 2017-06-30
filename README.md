wraps node-fetch/whatwg-fetch(/isomorphic-fetch) with adding basic headers and making query parameter string by default.

## API

- {get/post/put/delete}.{text/json}
  - param {string} url   - URL (required)
  - param {object} query - query parameter objectr (optional)
  - param {object} body  - body object (optional)
  - param {object} opt   - headers, etc (optional)
  - return {object} promise

## Example

```
// require
const nodeFetch = require('node-fetch');
const fetch = require('easy-fetch').set(nodeFetch);

// get
fetch.get.text('https://www.yahoo.co.jp').then(res => console.log(res));

// add headers
fetch.put.json('//localhost:8080', null, {body: 'here'}, {
  headers: {
    'X-HTTP-Method-Override': 'PUT',  // DELETE, PATCH
    'Content-Type' : 'text/html'
  }
});
```
