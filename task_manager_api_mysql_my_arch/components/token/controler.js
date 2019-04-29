const validator = require('validator');

const repository = require('./model/repository');
const service = require('./model/service');

class Controler{
  async getTokenByConfToken(req,res,next){
    try{
      const token = await repository.getConfToken(req.params.token);
      if(token[0].length===1){
        res.send(token[0]);
      }else{
        res.send({err:'Wrong token'});
      }
    }catch(err){
      res.send({err});
    }
  }
  async getTokenByResetToken(req,res,next){
    try{
      const token = await repository.getResetToken(req.params.token);
      if(token[0].length===1){
        res.send(token[0]);
      }else{
        res.send({err:'Wrong token'});
      }
    }catch(err){
      return res.send({err});
    }
  }
  async getTokenByUser(req,res,next){
    try{
      const token = await repository.getTokenByUserId(req.params.idUser);
      if(token[0].length===1){
        res.send(token[0]);
      }else{
        res.send({err:'Wrong token'});
      }
    }catch(err){
      return res.send({err});
    }
  }
  async createConfToken(req,res,next){
    if(!validator.isInt(String(req.body.idUser))){
      return res.send({err:'In body you must put id of user'});
    }
    try {
      const token = await service.originToken();
      await repository.createConfirmTokenForUser(req.body.idUser,token);
      await service.sendEmail(req.body.email,'Confirm token',`<h1>Take this token ${token} and push it in your ass</h1>`);
      req.params.idUser = req.body.idUser;
      next();
    } catch (err) {
      res.send({err});
    }
  }
  async createResetToken(req,res,next){
    if(!validator.isInt(req.body.idUser)){
      return res.send({err:'In body you must put id of user'});
    }
    try {
      const userToken = await repository.getTokenByUserId(req.body.idUser);
      if(userToken[0].length===0){
        const token = await service.originToken();
        await repository.createResetTokenForUser(req.body.idUser,token);
        await service.sendEmail(req.body.email,'Reset token',`<h1>Take this token ${token} and push it in your ass</h1>`);
      }else if(userToken[0].length===1 && userToken[0][0].confirm_token=='NULL'){
        const newToken = service.originToken();
        await repository.updTokenResetToken(req.body.idUser,newToken);
        await service.sendEmail(req.body.email,'Reset token',`<h1>Take this token ${newToken} and push it in your ass</h1>`);
      }else{
        res.send({err:'You must to confirm your account at first'});
      }
    } catch (err) {
      res.send({err});
    }
  }
  async updateConfToken(req,res,next){
    if(!validator.isInt(String(req.body.idUser))){
      return res.send({err:'Wrong id'});
    }
    if(!validator.isEmail(req.body.email)){
      return res.send({err:'Wrong email'});
    }
    const newToken = await service.originToken();
    try{
      await repository.updTokenConfToken(req.body.idUser,newToken);
      await service.sendEmail(req.body.email,'Confirm token',`<h1>Take this token ${newToken} and push it in your ass</h1>`);
      res.send({err:'You must to confirm your account, we send you confirm letter again'});
    }catch(err){
      res.send({err});
    }
  }
  async delByConfToken(req,res,next){
    if(!validator.isLength(req.body.token,{ min:40, max:40 })){
      return res.send({err:'Wrong token'});
    }
    try{
      await repository.deleteTokenByConfToken(req.body.token);
      next();
    }catch(err){
      res.send({err});
    }
  }
  async delByResetToken(req,res,next){
    if(!validator.isLength(req.body.token,{ min:40, max:40 })){
      return res.send({err:'Wrong token'});
    }
    try{
      await repository.deleteTokenByResetToken(req.body.token);
      next();
    }catch(err){
      res.send({err});
    }
  }
  async delByUser(req,res,next){
    if(!validator.isInt(String(req.body.idUser))){
      return res.send({err:'Wrong user id'});
    }
    try{
      await repository.deleteTokenByUserId(req.body.idUser);
      next();
    }catch(err){
      res.send({err});
    }
  }
}

module.exports = new Controler;
