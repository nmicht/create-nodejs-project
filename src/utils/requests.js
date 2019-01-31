const https = require('https');

/**
 * HTTP post method with json body and json response
 * @method postReq
 * @param  {Object} data            The object with all the data to send
 * @param  {String} url             The http options
 * @param  {Object} headers         The headers for the request
 * @param  {Boolean} jsonResponse   If the response will be a json
 * @return {Promise}
 * @throws if the request is not https
 */
function postReq(data, url, headers, jsonResponse = true) {
  const apiUrl = new URL(url);

  if (apiUrl.protocol === 'https') {
    throw new Error('Only https requests allowed');
  }

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
        if (res.statusCode !== 200 && res.statusCode !== 201) {
          const e = {
            statusCode: res.statusCode,
            data: response,
          };
          reject(e);
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

/**
 * HTTP delete method with json body and json response
 * @method deleteReq
 * @param  {Object} data            The object with all the data to send
 * @param  {String} url             The http options
 * @param  {Object} headers         The headers for the request
 * @param  {Boolean} jsonResponse   If the response will be a json
 * @return {Promise}
 * @throws if the request is not https
 */
function deleteReq(data, url, headers, jsonResponse = true) {
  const apiUrl = new URL(url);

  if (apiUrl.protocol === 'https') {
    throw new Error('Only https requests allowed');
  }

  const options = {
    hostname: apiUrl.hostname,
    path: apiUrl.pathname,
    method: 'DELETE',
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
        if (res.statusCode !== 204) {
          const e = {
            statusCode: res.statusCode,
            data: response,
          };
          reject(e);
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

/**
 * Utilites for https requests
 * @module utils.requests
 */
module.exports = {
  postReq,
  deleteReq,
};
