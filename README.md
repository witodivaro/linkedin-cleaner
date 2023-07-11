## LinkedIn cleaner

There are 2 types of scripts you can find: to *add* and to *remove* connections. You can use both depending on your needs.

# How to get started?

1. `cp req-headers.example.json req-headers.json`
2. Extract `csrf-token` and `Cookie` headers from your LinkedIn Page into `req-headers.json` # This is needed for authorisation
   1. Go to LinkedIn, open *Network* tab, go to XHR requests, and open any POST request
   2. Navigate to request headers, convert them to raw format, and copy `Cookie` value
   3. Go to https://www.freeformatter.com/json-escape.html#before-output and paste your cookie value to escape it
   4. Paste received value into `req-headers.json` under `Cookie` field
   5. Copypaste `csrf-token` header value into `req-headers.json` 
3. Go to `index.js` and uncomment the script you want to use
4. Run `node index.js`

## Issues

1. Responds with `Bad Request 400` on remove connection request
   <br>
   Probably there is an issue with which `entityUrn` code uses to remove the connection. It's required to research the removal request on LinkedIn and compare it to the data the code sends.