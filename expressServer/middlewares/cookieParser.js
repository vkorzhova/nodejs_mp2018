function cookieParser(req, res, next) {
  let cookies = req.header('Set-Cookie');
  let parsedCookies = {};

  cookies && cookies.split(';').forEach((cookie) => {
    let parts = cookie.split('=');
    parsedCookies[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  req.parsedCookies = parsedCookies;
  next();
};

module.exports = cookieParser;
