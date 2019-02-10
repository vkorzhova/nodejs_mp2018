const express = require('express');

const cookieParser = require('./middlewares/cookieParser');
const queryParser = require('./middlewares/queryParser');
const router = require('./routes');

const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

module.exports = app;
