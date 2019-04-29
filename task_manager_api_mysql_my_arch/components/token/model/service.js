const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');

const repository = require('./repository');

const transport = nodemailer.createTransport(sendgrid({
  auth:{
    api_key:'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'
  }
}));

class Service{
  randomStrick(){
    let token='';
    const available = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0;i<40;i++){
      token+=available.charAt(Math.floor(Math.random()*available.length));
    }
    return token
  }
  async originToken(){
    let token = this.randomStrick();
    const isExistConfToken = await repository.getConfToken(token);
    const isExistResToken = await repository.getResetToken(token);
    if(isExistConfToken[0].length!==0 && isExistResToken[0].length!==0){
      while(isExistConfToken[0].length!==0 && isExistResToken[0].length!==0){
        token=service.randomStrick();
      }
    }
    return token
  }
  sendEmail(to,title,htmlBody){
    return transport.sendMail({
      to,
      from:'supporttodo@tm.com',
      subject:title,
      html:htmlBody
    });
  }
}

module.exports = new Service;
