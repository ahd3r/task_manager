const express = require('express');
const bodyParser = require('body-parser');
const { body,param } = require('express-validator/check');

const controler = require('./user.conroler');
const validMiddle = require('../../utils/middleware');

const app = express();

app.use(bodyParser.json());



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
    }).withMessage('Username must be fill'),
  body('htmlBody')
    .isEmpty().withMessage('Must be fill')
],validMiddle.checkValid,(req,res,next)=>{
  if(req.body.permission){
    next('route');
  }else{
    next();
  }
},controler.createAccount);

app.post('/create',[
  body('permission')
    .isNumeric().withMessage('Must be num')
    .custom(value=>{
      if(value>0&&value<4){
        return true;
      }
    }).withMessage('Only 1, 2 or 3')
],validMiddle.checkValid,validMiddle.isAdmin,controler.createAccount);

app.get('/search',[
  body('searchByName')
    .isEmpty().withMessage('Must be fill')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.isAdmin,controler.backUsersByUsername);

app.post('/create/perm',[
  body('call').custom(value=>{
    if(value){
      return true
    }
  }).withMessage('Call must be fill')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.isAdmin,controler.createStatus);

app.get('/status/:idUser',[
  param('idUser')
    .isNumeric().withMessage('Must be a number')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.checkExistingAccount,validMiddle.isYour,controler.backUserStatus);

app.post('/create/image',[
  body('url')
    .matches(/^https:\/\/res.cloudinary.com\/dpacw4pua\/image\/upload\//).withMessage('It must be load to cloudnary and past a link here for save it in db')
],validMiddle.checkValid,validMiddle.checkAuth,controler.createImage);

app.get('/image/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.backImage);

app.get('/token/confirm/:confToken',[
  param('confToken')
    .isLength({min:40,max:40}).withMessage('Wrong confirm token')
],validMiddle.checkValid,controler.backUserByConfToken);

app.get('/token/reset/:resetToken',[
  param('resetToken')
    .isLength({min:40,max:40})
],validMiddle.checkValid,controler.backUserByResetToken);

app.patch('/confirm/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num')
],validMiddle.checkValid,validMiddle.checkExistingAccount,controler.confirmAccount);

app.patch('/reset/password/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num'),
  body('password')
    .isLength({min:8}).withMessage('Min 8 symbol of password')
],validMiddle.checkValid,validMiddle.checkExistingAccount,controler.checkCurPass,controler.resetPassworAccount);

app.patch('/token/reset/add/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be num')
],validMiddle.checkValid,validMiddle.checkExistingAccount,controler.addTokenReset);

app.put('/edit/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.checkExistingAccount,(req,res,next)=>{
  if(req.body.permission){
    next('route');
  }else{
    next();
  }
},validMiddle.isYour,controler.editUser);

app.put('/edit/:idUser',validMiddle.isAdmin,controler.editUser);

app.delete('/delete/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.checkExistingAccount,validMiddle.isYour,controler.deleteUser);

app.get('/page=:page&amount=:amount',[
  param('page')
    .isNumeric().withMessage('Must be num'),
  param('amount')
    .isNumeric().withMessage('Must be num'),
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.isAdmin,controler.backUsers);

app.get('/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be number')
],validMiddle.checkValid,validMiddle.checkAuth,validMiddle.checkExistingAccount,controler.backUser);



module.exports = app;
