const hashed = require('bcrypt');
const sendGrid = require('nodemailer-sendgrid-transport');
const nodeMailer = require('nodemailer');

const transport = nodeMailer.createTransport(sendGrid({
  auth:{
    api_key:'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',
  }
}));

class Service{
  hashPassword(rawPassword){
    const p=hashed.hashSync(rawPassword,7);
    return p;
  }
  checkStatus(repository,idUser){
    repository.takeStatus(idUser).then(data=>{
      if(data[0][0].permission !== 'admin'){
        return 'You can not create this type of user'
      }
    }).catch(err=>{
      return err;
    });
  }
  createToken(){
    let text='';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@!?<>,.|~[]{}()*&^#$+-*/";
    for (let i = 0; i < 40; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  sendingMail(toEmail,subject,htmlBody){
    return transport.sendMail({
      to:toEmail,
      from:'supporttodo@tz.com',
      subject:subject,
      html:htmlBody
    });
  }
}

module.exports = new Service;
