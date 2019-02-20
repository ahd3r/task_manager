const express = require('express');
const bodyParser = require('body-parser');
const { body,param,validationResult } = require('express-validator/check');

const controler = require('./task.controler');
const valid = require('../../utils/middleware');

const app = express();

app.use(bodyParser.json());
app.use(valid.checkAuth);



app.get('/del/done/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.isAdmin,controler.backDoneDelTasks);

app.get('/del/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.isAdmin,controler.backDelAllTasks);

app.get('/done/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.isAdmin,controler.backDoneTasks);

app.get('/user/del/:idUser/page=:page&amount=:amount',[
  param('idUser')
    .isNumeric().withMessage('NaN'),
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkExistingAccount,controler.backDelTasksForUser);

app.get('/user/alltasks/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN')
],valid.checkExistingAccount,controler.backAllTasksForUser);

app.get('/user/:idUser/page=:page&amount=:amount',[
  param('idUser')
    .isNumeric().withMessage('NaN'),
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkExistingAccount,controler.backTasksForUser);

app.get('/alltasks',valid.isAdmin,controler.backAllTasksTotaly);

app.get('/date/:year&:month',[
  param('year')
    .isNumeric().withMessage('NaN')
    .custom(value=>{
      return /^20/.test(value);
    }).withMessage('Not a Year')
    .isLength({min:4, max:4}).withMessage('Not a Year'),
  param('month')
    .isNumeric().withMessage('NaN')
    .custom(value=>{
      return !/^0/.test(value);
    }).withMessage('Do not start at 0')
    .custom(value=>{
      if(value<=12 && value>=1){
        return true;
      }
    }).withMessage('Not a month')
],(req,res,next)=>{
  if(!validationResult(req).isEmpty()){
    return res.send({err:'Wrong param for request'});
  }else{
    next();
  }
},valid.relocatedForData,valid.isAdmin,controler.backAllTasksByDate);

app.get('/date/:year&:month',controler.backAllUserTasksByDate);

app.post('/create',[
  body('call')
    .isString().withMessage('It must be string')
    .isLength({ max:120 }).withMessage('Too long')
    .trim()
],valid.isPaid,controler.createTasks);

app.put('/edit/:idTask',[
  body('call')
    .isString().withMessage('It must be string')
    .isLength({ max:120 }).withMessage('Too long')
    .trim(),
  param('idTask')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(/^0/.test(value)){
        return false;
      }else{
        return true;
      }}).withMessage('It does not must to start from 0')
],controler.editTasks);

app.patch('/done/all/:idUser',[
  param('idUser')
    .isNumeric().withMessage('it must be number')
    .custom(value=>{
      if(/^0/.test(value)){
        return false
      }else{
        return true
      }
    }).withMessage('It should not begin from 0')
],valid.checkExistingAccount,controler.doneAllTasks);

app.patch('/done/:idTask',[
  param('idTask')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(/^0/.test(value)){
        return false;
      }else{
        return true;
      }}).withMessage('It does not must to start from 0')
],controler.doneTask);

app.delete('/delete/some/',[
  body('arrOfId')
    .isArray().withMessage('Must be array')
    .custom(value=>{
      value.forEach((eachId,index)=>{
        if(isNaN(Number(eachId))){
          return false
        }
      });
      return true
    }).withMessage('Wrong data in array')
],controler.deleteSomeTasks);

app.delete('/delete/done',valid.isAdmin,controler.deleteAllDoneTasks);

app.delete('/delete/done/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(/^0/.test(value)){
        return false;
      }else{
        return true;
      }}).withMessage('It does not must to start from 0')
],valid.checkExistingAccount,controler.deleteDoneUserTasks);

app.delete('/delete/all/totaly',valid.isAdmin,controler.deleteAllTasks);

app.delete('/delete/all/:idUser',[
  param('idUser')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(/^0/.test(value)){
        return false;
      }else{
        return true;
      }}).withMessage('It does not must to start from 0')
],valid.checkExistingAccount,controler.deleteAllUserTasks);

app.delete('/delete/:idTask',[
  param('idTask')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(!/^0/.test(value)){
        return true;
      }}).withMessage('It does not must to start from 0')
],controler.deleteTask);

app.get('/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.isAdmin,controler.backTasks);

app.get('/:idTask',[
  param('idTask')
    .isNumeric().withMessage('NaN')
],controler.backTask);



module.exports = app;
