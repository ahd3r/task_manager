const { validationResult } = require('express-validator/check');

const service = require('./model/service');
const repository = require('./model/repository');
const valid = require('../../utils/middleware');

class Controler{
  backUsers(req,res,next){
    const forPagination = service.validPagination(req.params.page,req.params.amount);
    repository.getUsers(forPagination.last,forPagination.amount).then(data=>{
      repository.getCountOfAllUsers().then(totalyCount=>{
        res.send([totalyCount[0][0],...data[0]]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  backUser(req,res,next){
    repository.getUser(req.params.idUser).then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  backUsersByUsername(req,res,next){
    repository.getUsersByName(req.body.searchByName).then(data=>{
      if(data[0].length===0){
        res.send({err:'User was not found'});
      }else{
        res.send([{total:data[0].length},...data[0]]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  backUserByConfToken(req,res,next){
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
    do {
      req.body.tokenConfirm=service.createToken();
      valid.validConfToken(req.body.tokenConfirm).then(data=>{
        if(data[0].length!==0){
          req.body.tokenConfirm='using';
        }
      }).catch(err=>{
        return res.send({err});
      });
    } while (req.body.tokenConfirm==='using');
    req.body.password=service.hashPassword(req.body.password);
    repository.createAccount(req.body).then(done=>{
      repository.getUserByEmail(req.body.email).then(data=>{
        service.sendingMail(req.body.email,'Confirm account',req.body.htmlBody);
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  createStatus(req,res,next){
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
    repository.takeStatus(req.params.idUser).then(data=>{
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
    repository.addImage(req.body).then(done=>{
      res.send({done});
    }).catch(err=>{
      res.send({err});
    });
  }
  backImage(req,res,next){
    repository.takeImage(req.params.idUser).then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  confirmAccount(req,res,next){
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
  checkCurPass(req,res,next){
    if(req.body.curPass===''){
      res.send({err:'Password are not match'});
    }else if(req.body.curPass){
      repository.getUser(req.params.idUser).then(data=>{
        if(service.comparePass(req.body.curPass,data[0][0].password)){
          next();
        }else{
          res.send({err:'Password are not match'});
        }
      }).catch(err=>{
        res.send({err});
      });
    }else{
      next();
    }
  }
  resetPassworAccount(req,res,next){
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
  addTokenReset(req,res,next){
    do {
      req.body.tokenReset=service.createToken();
      valid.validResetToken(req.body.tokenReset).then(data=>{
        if(data[0].length!==0){
          req.body.tokenReset='using';
        }
      }).catch(err=>{
        return res.send({err});
      });
    } while (req.body.tokenReset==='using');
    repository.editUser({tokenReset:req.body.tokenReset},req.params.idUser).then(done=>{
      repository.getUser(req.params.idUser).then(data=>{
        service.sendingMail(data[0][0].email,'Reset password',`
          <h1>This is letter for reset password</h1>
          <p>For reset password go to this link http://localhost:3000/users/reset/password/${req.params.idUser} in postman 
          with patch request and do not forget to past new password in body in password line</p>
        `);
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      })
    }).catch(err=>{
      res.send({err});
    });
  }
  editUser(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }
    if(!req.body){
      return res.send({error:'Must be data for update'});
    }
    if(req.body.email){
      return res.send('Change email is not posible');
    }
    if(req.body.username){
      if(req.body.username.length<2){
        return res.send({error:'Too short username'});
      }
    }
    if(req.body.avatar){
      if(/^0/.test(req.body.avatar) || isNaN(Number(req.body.avatar))){
        return res.send({error:'Wrong avatar'});
      }
    }
    if(req.body.permission){
      if(/\D/.test(req.body.permission)){
        return res.send({err:'It must be a number'});
      }
    }
    if(req.body.tokenReset===0){
      req.body.tokenReset=null;
    }else if(req.body.tokenReset&&req.body.tokenReset!==0){
      return res.send({err:'tokenReset must be either 0 or nothing'});
    }
    repository.editUser(req.body,req.params.idUser).then(done=>{
      repository.getUser(req.params.idUser).then(data=>{
        res.send(data[0]);
      }).catch(err=>{
        res.send({err});
      })
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteUser(req,res,next){
    repository.deleteUser(req.params.idUser).then(done=>{
      res.send({done});
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new Controler;
