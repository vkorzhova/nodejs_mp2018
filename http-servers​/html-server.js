const fs = require('fs');
const http = require('http');
const through = require('through2');

const PORT = 3000;

const requestHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  const replaceMessage = through((data, enc, callback) => {
    callback(null, data.toString().replace('{message}', 'Hello, World'));
  });

  fs.createReadStream('./index.html')
    .pipe(replaceMessage)
    .pipe(res);
};

http.createServer()
  .on('request', requestHandler)
  .listen(PORT, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`server is listening on ${PORT}`);
  });
