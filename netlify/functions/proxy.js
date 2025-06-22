const https = require('https');

exports.handler = async (event, context) => {
  const id = event.queryStringParameters.id || '123456';

  const url = `https://designatelier.ct.ws/test4.php?id=${id}`;

  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        // Remove <script> tags injected by InfinityFree
        const cleaned = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*',
          },
          body: cleaned,
        });
      });

    }).on('error', (err) => {
      resolve({
        statusCode: 500,
        body: 'Error: ' + err.message,
      });
    });
  });
};
