const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname,'dist')));

app.use('/',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname,'dist/index.html'));
});

app.listen(8080,()=>{
  console.log('Front is on...');
});
