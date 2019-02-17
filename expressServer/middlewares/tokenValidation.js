const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        return res.status(400).json({ success: 'false', message: 'Failed to authenticate token' });
      } else {
        return next();
      }
    })
  } else {
    return res.status(403).send({ success: 'false', message: 'No token provided' });
  }
}

module.exports = checkToken;
