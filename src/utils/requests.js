const https = require('https');

/**
 * HTTP post method with json body and json response
 * @param  {Object} data            The object with all the data to send
 * @param  {String} url             The http options
 * @param  {Object} headers         The headers for the request
 * @param  {Boolean} jsonResponse   If the response will be a json
 * @return {Promise}
 */
function post(data, url, headers, jsonResponse = true) {
  const apiUrl = new URL(url);

  const options = {
    hostname: apiUrl.hostname,
    path: apiUrl.pathname,
    method: 'POST',
    headers,
  };

  const json = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let response = '';

      res.on('data', (chunk) => {
        response += chunk;
      });

      res.on('end', () => {
        if (jsonResponse) {
          response = JSON.parse(response);
        }

        // FIXME probably also other status?
        if (res.statusCode !== 200 || res.statusCode !== 201) {
          reject(response);
        }

        resolve(response);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(json);
    req.end();
  });
}

module.exports = {
  post,
};
