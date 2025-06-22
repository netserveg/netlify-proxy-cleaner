const https = require('https');

exports.handler = async (event) => {
  const id = event.queryStringParameters.id;
  if (!id) return { statusCode: 400, body: "Missing id" };

  const url = `https://designatelier.ct.ws/test4.php?id=${id}`;

  return new Promise((resolve) => {
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        // Remove all <script> blocks (including aes.js, redirection, etc.)
        let cleaned = data.replace(/<script[\s\S]*?<\/script>/gi, '');

        // Remove <noscript> fallback
        cleaned = cleaned.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
          },
          body: cleaned
        });
      });
    }).on('error', err => resolve({
      statusCode: 500,
      body: 'Error: ' + err.message
    }));
  });
};
