const url = require('url');

function queryParser(req, res, next) {
  let parts = url.parse(req.url);
  req.parsedQuery = parts.query;
  next();
}

module.exports = queryParser;
