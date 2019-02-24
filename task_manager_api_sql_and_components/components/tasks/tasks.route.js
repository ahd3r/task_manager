const express = require('express');
const bodyParser = require('body-parser');
const { body,param } = require('express-validator/check');

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
],valid.checkValid,valid.isAdmin,controler.backDoneDelTasks);

app.get('/del/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isAdmin,controler.backDelAllTasks);

app.get('/done/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isAdmin,controler.backDoneTasks);

app.get('/user/del/:idUser/page=:page&amount=:amount',[
  param('idUser')
    .isNumeric().withMessage('NaN'),
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.checkExistingAccount,valid.isYour,controler.backDelTasksForUser);

app.get('/user/alltasks/:idUser',[
  param('idUser')
    .isNumeric().withMessage('NaN')
],valid.checkValid,valid.checkExistingAccount,valid.isYour,controler.backAllTasksForUser);

app.get('/user/:idUser/page=:page&amount=:amount',[
  param('idUser')
    .isNumeric().withMessage('NaN'),
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.checkExistingAccount,valid.isYour,controler.backTasksForUser);

app.get('/alltasks/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isAdmin,controler.backAllTasksTotaly);

app.get('/date/:year&:month&:user',[
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
    }).withMessage('Not a month'),
  param('user')
    .custom(value=>{
      if(value==1){
        return true
      }
    }).withMessage('Last must be equel 1')
],valid.checkValid,controler.backAllUserTasksByDate);

app.get('/date/:year&:month&:day',[
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
    }).withMessage('Not a month'),
  param('day')
    .custom(value=>{
      if(value>0 && value<32){
        return true;
      }
    }).withMessage('Not a day')
],valid.checkValid,valid.relocatedForDate,controler.backAllTasksByDate);

app.get('/date/:year&:month&:day',controler.backAllUserTasksByDate);

app.post('/create',[
  body('call')
    .isString().withMessage('It must be string')
    .isLength({ max:120 }).withMessage('Too long')
    .trim()
],valid.checkValid,valid.isPaid,controler.createTasks);

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
],valid.checkValid,valid.checkTask,valid.checkTask,controler.editTasks);

app.patch('/done/all/user',controler.doneAllTasks); // Take current user for action

app.patch('/done/:idTask',[
  param('idTask')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(/^0/.test(value)){
        return false;
      }else{
        return true;
      }}).withMessage('It does not must to start from 0')
],valid.checkValid,valid.checkTask,controler.doneTask);

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
],valid.checkValid,controler.deleteSomeTasks);

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
],valid.checkValid,valid.checkExistingAccount,valid.isYour,controler.deleteDoneUserTasks);

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
],valid.checkValid,valid.checkExistingAccount,valid.isYour,controler.deleteAllUserTasks);

app.delete('/delete/:idTask',[
  param('idTask')
    .isNumeric().withMessage('It must be a number')
    .custom(value=>{
      if(!/^0/.test(value)){
        return true;
      }}).withMessage('It does not must to start from 0')
],valid.checkValid,valid.checkTask,controler.deleteTask);

app.get('/page=:page&amount=:amount',[
  param('amount')
    .isNumeric().withMessage('Must be num'),
  param('page')
    .isNumeric().withMessage('Must be num')
],valid.checkValid,valid.isAdmin,controler.backTasks);

app.get('/:idTask',[
  param('idTask')
    .isNumeric().withMessage('NaN')
],valid.checkValid,valid.checkTask,controler.backTask);



module.exports = app;
