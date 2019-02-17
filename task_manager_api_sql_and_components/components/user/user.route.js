const express = require('express');
const bodyParser = require('body-parser');
const { body,param } = require('express-validator/check');

const controler = require('./user.conroler');
const validMiddle = require('../../utils/middleware');

const app = express();

app.use(bodyParser.json());



app.get('/',validMiddle.checkAuth,validMiddle.isAdmin,controler.backUsers);

app.get('/statuses',validMiddle.checkAuth,validMiddle.isAdmin,controler.backStatus);

app.post('/create',[
  body('password')
    .isLength({ min:8 }).withMessage('Less then 8'),
  body('email')
    .isEmail().withMessage('Not an email'),
  body('username')
    .custom(value=>{
      if(value){
        return true
      }
    }).withMessage('Username must be fill')
],controler.createAccount);

app.post('/create/perm',[
  body('call').custom(value=>{
    if(value){
      return true
    }
  }).withMessage('Call must be fill')
],validMiddle.checkAuth,validMiddle.isAdmin,controler.createStatus);

app.get('/status/:idUser',[
  param('idUser')
    .isNumeric().withMessage('Must be a number')
],validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.backUserStatus);

app.post('/create/image',[
  body('url')
    .matches(/^https:\/\/res.cloudinary.com\/dpacw4pua\/image\/upload\//).withMessage('It must be load to cloudnary and past a link here for save it in db')
],validMiddle.checkAuth,controler.createImage);

app.get('/image/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num')
],validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.backImage);

app.get('/confirm/token/:confToken',[
  param('confToken')
    .isLength({min:40,max:40}).withMessage('Wrong confirm token')
],validMiddle.checkExistingAccountWithConfToken,);

app.get('/reset/token/:resetToken',[
  param('resetToken')
    .isLength({min:40,max:40})
],validMiddle.checkExistingAccountWithResetToken,);

app.patch('/confirm/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num')
],validMiddle.checkExistingAccount,controler.confirmAccount);

app.patch('/reset/password/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num'),
  body('password')
    .isLength({min:8}).withMessage('Min 8 symbol of password')
],validMiddle.checkExistingAccount,controler.resetPassworAccount);

app.put('/edit/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN')
],validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.editUser);

app.delete('/delete/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN')
],validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.deleteUser);

app.get('/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be number')
],validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.backUser);



module.exports = app;
