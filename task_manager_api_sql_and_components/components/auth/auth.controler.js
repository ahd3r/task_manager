const { validationResult } = require('express-validator/check');

const service = require('./model/service');
const userRepository = require('../user/model/repository');

class Controler{
  backJwt(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({err:validationResult(req).array()});
    }
    userRepository.getUserByEmail(req.body.email).then(data=>{
      service.loginUser(data).then(data=>{
        res.set('authorization',data.authorization);
        res.set('iduser',data.iduser);
        res.send({jwt:data.authorization,user:data.user});
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new Controler;
