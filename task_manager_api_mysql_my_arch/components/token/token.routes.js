const app = require('express')();
const { param } = require('express-validator/check');
const bodyParser = require('body-parser');

const controler = require('./controler');
const middleWare = require('../../utils/middleware');

app.use(bodyParser.json());
app.use(middleWare.isNotAuth);



app.get('/conf/:token',[
  param('token')
    .isLength({min:40,max:40}).withMessage('must be 40 length')
],middleWare.isValid,controler.getTokenByConfToken);

app.get('/reset/:token',[
  param('token')
    .isLength({min:40,max:40}).withMessage('must be 40 length')
],middleWare.isValid,controler.getTokenByResetToken);

app.get('/:idUser',[
  param('idUser')
    .isInt().withMessage('must be id')
],middleWare.isValid,controler.getTokenByUser);



module.exports = app;
