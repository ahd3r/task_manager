const { validationResult } = require('express-validator/check');

const service = require('./model/service');
const repository = require('./model/repository');
const forTwoMethod = require('../../utils/middleware');

class Controler{
  backUsers(req,res,next){
    repository.getUsers().then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  backUser(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.getUser(req.params.idUser).then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  backUserByConfToken(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.getUserByConfToken(req.params.confToken).then(data=>{
      if(data[0].length!==0){
        res.send(data[0]);
      }else{
        res.send({err:'This user does not exist'});
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  backUserByResetToken(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.getUserByResetToken(req.params.resetToken).then(data=>{
      if(data[0].length!==0){
        res.send(data[0]);
      }else{
        res.send({err:'This user does not exist'});
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  createAccount(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    if(req.body.permission){
      if(service.checkStatus(repository,req.headers.iduser)){
        return res.send({err:service.checkStatus(repository,req.headers.iduser)});
      }
    }
    do {
      req.body.confToken=forTwoMethod.validConfToken(service.createToken());
      if(req.body.confToken.err){
        return res.send({err:req.body.confToken.err});
      }
    } while (req.body.confToken==='using');
    req.body.password=service.hashPassword(req.body.password);
    repository.createAccount(req.body).then(done=>{
      repository.getUserByEmail(req.body.email).then(data=>{
        if(!req.body.htmlLetter){
          return res.send({err:'Fill htmlLetter in body for send it to mail, and do not forget about link to confirm account'});
        }
        service.sendingMail(req.body.email,'Confirm account',req.body.htmlLetter);
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  createStatus(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.addStatus(req.body).then(done=>{
      repository.backStatuses().then(data=>{
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  backUserStatus(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.takeStatus(req.headers.iduser).then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  backStatus(req,res,next){
    repository.backStatuses().then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  createImage(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.addImage(req.body).then(done=>{
      res.send({done});
    }).catch(err=>{
      res.send({err});
    });
  }
  backImage(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.takeImage(req.params.idUser).then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  confirmAccount(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.confirmUser(req.params.idUser).then(done=>{
      repository.getUser(req.params.idUser).then(data=>{
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  resetPassworAccount(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    const hashedPassword = service.hashPassword(req.body.password);
    repository.editUser({hashedPassword},req.params.idUser).then(done=>{
      repository.getUser(req.params.idUser).then(data=>{
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  editUser(req,res,next){
    let doWeNeedSendEmail=false;
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    if(!req.body){
      return res.send({error:'Must be data for update'});
    }
    if(req.body.email){
      if(!/@/.test(req.body.email)){
        return res.send('Write valid email');
      }
    }
    if(req.body.username){
      if(req.body.username.length<2){
        return res.send({error:'Too short username'});
      }
    }
    if(req.body.avatart){
      if(/^0/.test(req.body.avatart) || isNaN(Number(req.body.avatart))){
        return res.send({error:'Wrong avatar'});
      }
    }
    if(req.body.permission){
      if(/\D/.test(req.body.permission)){
        return res.send({err:'It must be a number'});
      }
    }
    if(req.body.tokenReset===0){
      req.body.tokenReset=null
    }else if(req.body.tokenReset===1){
      do {
        req.body.tokenReset=forTwoMethod.validResetToken(service.createToken());
        if(req.body.tokenReset.err){
          return res.send({err:req.body.tokenReset.err});
        }
      } while (req.body.tokenReset==='using');
      doWeNeedSendEmail=true;
    }
    repository.editUser(req.body,req.params.idUser).then(done=>{
      repository.getUser(req.params.idUser).then(data=>{
        if(doWeNeedSendEmail){
          if(req.body.email){
            service.sendingMail(req.body.email,'Reset password',req.body.htmlLetter);
          }else{
            repository.getUser(req.headers.iduser).then(data=>{
              if(data[0].length===0){
                return res.send({err:'This user does not exist'});
              }
              if(!req.body.htmlLetter){
                return res.send({err:'Fill htmlLetter in body for send it to mail, and do not forget about link to reset password'});
              }
              service.sendingMail(data[0][0].email,'Reset password',req.body.htmlLetter);
            }).catch(err=>{
              res.send({err});
            });
          }
        }
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      })
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteUser(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    repository.deleteUser(req.params.idUser).then(done=>{
      res.send({done});
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new Controler;
