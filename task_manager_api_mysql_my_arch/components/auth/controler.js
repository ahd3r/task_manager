const service = require('./model/service');
const userRepository = require('../users/model/repository');

class Controler{
  async checkRightUser(req,res,next){
    try{
      const user = await userRepository.backUserByEmail(req.body.email);
      if(user[0].length!==1){
        return res.send({err:'User does not exist'});
      }else{
        req.body.idUser=user[0][0].id_user;
        req.body.user = user[0][0];
      }
      if(user[0][0].confirmed===0){
        next('route');
      }else{
        next();
      }
    }catch(err){
      res.send({err});
    }
  }
  backJwt(req,res,next){
    if(service.isRightPass(req.body.password,req.body.user.password)){
      const token = service.createJwt(req.body.user.email);
      res.header('Authorization', token);
      res.header('idUser', req.body.user.id_user);
      res.send({token,idUser:req.body.user.id_user});
    }else{
      res.send({err:'Wrong password'});
    }
  }
}

module.exports = new Controler;
