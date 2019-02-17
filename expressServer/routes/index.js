const express = require('express');

const router = express.Router();

router.route('/products')
  .get((req, res) => {
    res.send('Return ​ ALL ​products')
  })
  .post((req, res) => {
    res.send('Add ​NEW​ product and return it')
  });

router.get('/products/:id', (req, res) => {
  res.send('Return ​SINGLE​ product')
});

router.get('/products/:id/reviews', (req, res) => {
  res.send('Return ​ALL ​reviews for a single product')
});

router.get('/users', (req, res) => {
  res.send('Return ​ALL​ users')
});

module.exports = router;
