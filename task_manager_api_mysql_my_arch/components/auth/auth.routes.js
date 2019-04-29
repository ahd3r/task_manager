const app = require('express')();
const { body } = require('express-validator/check');
const bodyParser = require('body-parser');

const controler = require('./controler');
const middleWare = require('../../utils/middleware');
const tokenControler = require('../token/controler');

app.use(bodyParser.json());
app.use(middleWare.isNotAuth);

app.post('/login',[
  body('email')
    .isEmail().withMessage('Must be email'),
  body('password')
    .isLength({min:4}).withMessage('Must be a string')
],middleWare.isValid,controler.checkRightUser,tokenControler.delByUser,controler.backJwt);

app.post('/login',tokenControler.updateConfToken);

module.exports = app;
