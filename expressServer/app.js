const express = require('express');
const passport = require('passport');

const cookieParser = require('./middlewares/cookieParser');
const queryParser = require('./middlewares/queryParser');
const authRoute = require('./routes/auth');
const router = require('./routes');

const app = express();

app.use(cookieParser);
app.use(queryParser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute);
app.use('/api', router);

module.exports = app;
