const express = require('express');
const jwt = require('jsonwebtoken');

const passport = require('../middlewares/passport');

const router = express.Router();

function handleResponse(req, res) {
  const user = req.user;

  if (user) {
    const userName = user._json.name;
    return res.status(200).json(userName);
  }

  return res.status(500).send({ message: 'Internal Server Error' });
}

router.get('/facebook', passport.authenticate('facebook', { session: false }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), handleResponse);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), handleResponse);

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { session: false }), handleResponse);

router.post('/', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(404).send({ message: 'Not found' });
    }

    req.user = user;
    return next();
  })(req, res, next);

  const user = req.user;
  if (!user) { return; }

  const payload = { email: user.email };
  const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

  return res.status(200).send({
    message: 'OK',
    data: {
      user: {
        email: user.email,
        username: user.login,
      }
    },
    token,
  });
});

module.exports = router;
