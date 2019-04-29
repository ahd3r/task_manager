const app = require('express')();

const usersRoute = require('./components/users/users.routes');
const authRoute = require('./components/auth/auth.routes');
// const taskRoute = require('./components/tasks/tasks.routes');
// const supportRoute = require('./components/tasks/support.routes');
const tokenRoute = require('./components/token/token.routes');
const error = require('./components/error/controler');

app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // *
  res.header('Access-Control-Allow-Methods', '*'); // GET, PUT, POST, DELETE, PATCH
  res.header('Access-Control-Allow-Headers', '*'); // Content-Type
  next();
});

app.use('/auth',authRoute);
app.use('/token',tokenRoute);
app.use('/users',usersRoute);
// app.use('/tasks',middleWare.isAuth,taskRoute);
// app.use('/support',middleWare.isAuth,supportRoute);

app.use(error.Error404);

module.exports = app;
