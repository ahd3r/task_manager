const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

const userRepository = require('../components/users/model/repository');

class MiddleWare{
  isValid(req,res,next){
    if(!validationResult(req).isEmpty()){
      res.send({err:validationResult(req).array()});
    }else{
      next()
    }
  }
  isOnlyPassword(req,res,next){
    req.body = {password:req.body.password};
    next();
  }
  isPermission(req,res,next){
    if(req.body.permission && req.body.permission!==1){
      if(isNaN(parseInt(req.body.permission))){
        res.send({err:'Permission can not be string, only 1(user),2(admin),3(paid)'});
      }else{
        next('route'); // check admining
        // 'route' means that request will redirect to another rout with the same url
      }
    }else{
      next(); // continue
    }
  }
  isNotAuth(req,res,next){
    if(res.getHeader('Authorization') || res.getHeader('idUser') || req.body.jwt || req.body.idUser){
      res.send({err:'You are authorizated'});
    }else{
      next();
    }
  }
  async isYour(req,res,next){
    if(res.getHeader('iduser')===req.params.idUser){
      next();
    }else{
      try{
        const curUser = await userRepository.backUser(res.getHeader('iduser'));
        if(curUser[0].length===1 && curUser[0][0].permission==2){
          next();
        }else{
          res.send({err:'It is not your'});
        }
      }catch(err){
        res.send({err});
      }
    }
  }
  async isAuth(req,res,next){
    try{
      if(res.getHeader('Authorization') && res.getHeader('idUser')){
        const userEmail = jwt.verify(res.getHeader('Authorization'),'nationzinewithl');
        const user=await userRepository.backUserByEmail(userEmail.email);
        if(user[0].length===1 && user[0][0].id_user===parseInt(res.getHeader('iduser'))){
          next();
        }else{
          res.send({err:'Wrong jwt'});
        }
      }else if(req.body.jwt && req.body.idUser){
        const userEmail = jwt.verify(req.body.jwt,'nationzinewithl');
        const user=await userRepository.backUserByEmail(userEmail.email);
        if(user[0].length===1 && user[0][0].id_user===parseInt(req.body.idUser)){
          res.header('authorization',req.body.jwt);
          res.header('iduser',req.body.idUser);
          next();
        }else{
          res.send({err:'Wrong jwt'});
        }
      }else{
        res.send({err:'You are not auth'});
      }
    }catch(err){
      res.send({err});
    }
  }
  async isAdmin(req,res,next){
    try{
      const user = await userRepository.backUser(res.getHeader('iduser'));
      if(user[0][0].permission===2){
        next();
      }else{
        res.send({err:'You are not admin'});
      }
    }catch(err){
      res.send({err});
    }
  }
}

module.exports = new MiddleWare;
