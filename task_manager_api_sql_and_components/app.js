const express = require('express');

const authRouters = require('./components/auth/auth.route');
const tasksRouters = require('./components/tasks/tasks.route');
const userRouters = require('./components/user/user.route');
const error = require('./components/error/error.controler');

const app = express();

app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080/');
  res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH'); // OPTIONS
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/auth',authRouters);
app.use('/tasks',tasksRouters);
app.use('/users',userRouters);

app.use(error.error404);

app.listen(3000,()=>{
  console.log('API is runing...');
});
