const http = require('http');

const PORT = 3000;
const product = {
  id: 1,
  name: 'Supreme T-Shirt',
  brand: 'Supreme',
  price: 99.99,
  options: [
    { color: 'blue' },
    { size: 'XL' },
  ]
};

const requestHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify(product));
};

http.createServer()
  .on('request', requestHandler)
  .listen(PORT, (err) => {
    if (err) {
      console.error(err);
    }

    console.log(`server is listening on ${PORT}`);
  });
