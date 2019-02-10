const http = require('http');

const PORT = 3000;

const requestHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });

  res.end('Hello, World');
};

http.createServer()
  .on('request', requestHandler)
  .listen(PORT, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`server is listening on ${PORT}`);
  });
