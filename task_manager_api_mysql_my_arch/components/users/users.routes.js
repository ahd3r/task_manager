const app = require('express')();
const { body,param } = require('express-validator/check');
const bodyParser = require('body-parser');

const controler = require('./controler');
const middleWare = require('../../utils/middleware');
const tokenControler = require('../token/controler');

app.use(bodyParser.json());



app.get('/page=:page&amount=:amount',[
  param('page').
    isInt().withMessage('NaN'),
  param('amount').
    isInt().withMessage('NaN')
],middleWare.isValid,middleWare.isAuth,middleWare.isAdmin,controler.backUsers);

app.get('/:idUser',[
  param('idUser')
    .isInt().withMessage('NaN')
],middleWare.isValid,middleWare.isAuth,middleWare.isYour,controler.backUser);

app.get('/byemail',[
  body('email')
    .isEmail().withMessage('Must be email')
],middleWare.isValid,middleWare.isAdmin,controler.backUserByEmail);

app.post('/',[
  body('username')
    .isString().withMessage('Must be a string'),
  body('password')
    .isLength({min:4}).withMessage('Must be longer then 3'),
  body('email')
    .isEmail().withMessage('Must be email')
],middleWare.isValid,middleWare.isPermission,middleWare.isNotAuth,controler.createUser,tokenControler.createConfToken,controler.backUser);

app.post('/',middleWare.isAuth,middleWare.isAdmin,controler.createUser,tokenControler.createConfToken,controler.backUser);

app.put('/:idUser',[
  param('idUser')
    .isInt().withMessage('NaN')
],middleWare.isValid,middleWare.isAuth,middleWare.isYour,controler.editUser);

app.patch('/token/reset',[
  body('email')
    .isEmail().withMessage('Must be an email')
],middleWare.isValid,middleWare.isNotAuth,controler.getIdAndSendToToken,tokenControler.createResetToken);

app.delete('/:idUser',[
  param('idUser')
    .isInt().withMessage('NaN')
],middleWare.isValid,middleWare.isAuth,middleWare.isYour,controler.deleteUser);

app.post('/image',[
  body('image_url')
    .matches(/^https:\/\/res.cloudinary.com\/image\/upload\//).withMessage('It must be link from cloudinary')
],middleWare.isValid,middleWare.isAuth,controler.createImage);

app.post('/status',[
  body('status_call')
    .isString().withMessage('Must be string')
],middleWare.isValid,middleWare.isAuth,middleWare.isAdmin,controler.createStatus);

app.patch('/confirm/:idUser',[
  param('idUser') 
    .isNumeric().withMessage('NaN')
],middleWare.isValid,middleWare.isNotAuth,controler.confirmUser);

app.patch('/reset/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN'),
  body('password')
    .isLength({min:4}).withMessage('Must be longer then 3')
],middleWare.isValid,middleWare.isNotAuth,middleWare.isOnlyPassword,controler.editUser);

app.get('/search=:searchUser',[
  param('searchUser')
    .isString().withMessage('Must be string')
],middleWare.isValid,middleWare.isAuth,middleWare.isAdmin,controler.searchUser);



module.exports = app;
