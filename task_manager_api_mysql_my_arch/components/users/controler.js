const repository = require('./model/repository');
const service = require('./model/service');
// const io = require('../../utils/socket');

class Controler{
  async backUsers(req,res,next){
    const last = service.pagination(req.params.page,req.params.amount);
    try {
      const responseFromBD = await repository.backUsers(last,req.params.amount);
      res.send(responseFromBD);
    } catch (err) {
      return res.send({err});
    }
  }
  async backUser(req,res,next){
    try {
      const responseFromBD = await repository.backUser(req.params.idUser?req.params.idUser:req.body.idUser);
      res.send(responseFromBD[0]);
    } catch (err) {
      return res.send({err});
    }
  }
  async backUserByEmail(req,res,next){
    try {
      const user = await repository.backUserByEmail(req.body.email);
      res.send(user[0]);
    } catch (err) {
      return res.send({err});
    }
  }
  async createUser(req,res,next){
    try {
      req.body.password = service.hashedPass(req.body.password);
      const newUser = await repository.createUser(req.body);
      req.body.idUser=newUser[0].insertId;
      req.params.idUser=newUser[0].insertId;
      next();
    } catch (err) {
      return res.send({err});
    }
  }
  async getIdAndSendToToken(req,res,next){
    try {
      const user = await repository.backUserByEmail(req.body.email);
      if(user[0].length===1){
        req.body.idUser=user[0][0].id_user;
        next();
      }else{
        return res.send({err:'Wrong email'});
      }
    } catch (err) {
      res.send({err});
    }
  }
  async editUser(req,res,next){
    if(!req.body){
      return res.send({err:'You must to set some data for change in body'});
    }
    try {
      await repository.editUser(req.body,req.params.idUser);
      const responseFromBD = await repository.backUsers(0,5);
      res.send(responseFromBD[0]);
    } catch (err) {
      return res.send({err});
    }
  }
  async deleteUser(req,res,next){
    try {
      await repository.deleteUser(req.params.idUser);
      const responseFromBD = await repository.backUsers(0,5);
      res.send(responseFromBD[0]);
    } catch (err) {
      return res.send({err});
    }
  }
  async createImage(req,res,next){
    try {
      const newImageCreated = await repository.createImage(req.body.image_url);
      res.send(newImageCreated);
    } catch (err) {
      return res.send({err});
    }
  }
  async createStatus(req,res,next){
    try{
      await repository.createStatus(req.body.status_call);
      const statuses = await repository.backStatuses();
      res.send(statuses[0]);
    }catch(err){
      return res.send({err});
    }
  }
  async confirmUser(req,res,next){
    try{
      await repository.confirmUser(req.params.idUser);
      const users = await repository.backUser(req.params.idUser);
      res.send(users[0]);
    }catch(err){
      return res.send({err});
    }
  }
  async searchUser(req,res,next){
    try {
      const user = await repository.backUsersBySearch(req.params.searchUser);
      res.send(user[0]);
    } catch (err) {
      return res.send({err});
    }
  }
}

module.exports = new Controler;
