function cookieParser(req, res, next) {
  let cookies = req.headers.cookie;
  let parsedCookies = {};

  cookies && cookies.join().split(';').forEach((cookie) => {
    let parts = cookie.split('=');
    parsedCookies[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  req.parsedCookies = parsedCookies;
  next();
};

module.exports = cookieParser;
