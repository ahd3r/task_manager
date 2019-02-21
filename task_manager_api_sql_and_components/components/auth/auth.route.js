const express = require('express');
const bodyParser = require('body-parser');
const { body } = require('express-validator/check');

const controler = require('./auth.controler');
const { checkValid } = require('../../utils/middleware');

const app = express();

app.use(bodyParser.json());

app.get('/login', [
  body('email')
    .isEmail().withMessage('Write valid email'),
  body('password')
    .isLength({ min:8 }).withMessage('Password too short')
],checkValid,controler.backJwt);

module.exports = app;
