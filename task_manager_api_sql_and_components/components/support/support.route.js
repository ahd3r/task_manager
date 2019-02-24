const express = require('express');
const bodyParser = require('body-parser');
const { body,param } = require('express-validator/check');

const controler = require('./support.controler');
const valid = require('../../utils/middleware');

const app = express();

app.use(bodyParser.json());
app.use(valid.checkAuth);



app.get('/user/:idUser/page=:page&amount=:amount',[
  param('page')
    .isNumeric().withMessage('Must be num'),
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('idUser')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isYour,controler.getUserMessages);

app.get('/search',[
  body('searchByTitle')
    .isEmpty().withMessage('Must be fill')
],valid.checkValid,valid.isAdmin,controler.getMsgByTitle);

app.get('/unread/page=:page&amount=:amount',[
  param('page')
    .isNumeric().withMessage('Must be num'),
  param('amount')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isAdmin,controler.getUnreadMessage);

app.post('/create',[
  body('title')
    .isEmpty().withMessage('It must be fill'),
  body('body')
    .isEmpty().withMessage('It must be fill'),
],valid.checkValid,controler.createMessage);

app.patch('/readit/:idMessage',[
  param('idMessage')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.checkSupportMsg,valid.isAdmin,controler.readMessage);

app.patch('/change/status/:idMessage',[
  param('idMessage')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.checkSupportMsg,valid.isAdmin,controler.doneMessage);

app.delete('/delete/:idMessage',[
  param('idMessage')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.checkSupportMsg,valid.isYour,controler.deleteMessage);

app.get('/page=:page&amount=:amount',[
  param('page')
    .isNumeric().withMessage('Must be num'),
  param('amount')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isAdmin,controler.getMessages);

app.get('/:idMessage',[
  param('idMessage')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.checkSupportMsg,valid.isYour,controler.getMessage);



module.exports = app;
