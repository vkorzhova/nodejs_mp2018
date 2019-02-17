const url = require('url');

function queryParser(req, res, next) {
  const { query } = url.parse(req.url);
  const parsedQuery = {};

  query && query.split('&').forEach((query) => {
    const parts = query.split('=');
    parsedQuery[parts.shift().trim()] = decodeURI(parts.join('='));
  })

  req.parsedQuery = parsedQuery;

  next();
}

module.exports = queryParser;
