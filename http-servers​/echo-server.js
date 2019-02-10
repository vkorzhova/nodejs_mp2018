const http = require('http');
const PORT = 3000;

http.createServer()
  .on('request', (req, res) => {
    req.pipe(res);
  })
  .listen(PORT, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`server is listening on ${PORT}`);
  });
