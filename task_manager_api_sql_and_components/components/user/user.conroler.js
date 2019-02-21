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
    const create = ()=>{
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
      console.log('create');
      req.body.password=service.hashPassword(req.body.password);
      repository.createAccount(req.body).then(done=>{
        repository.getUserByEmail(req.body.email).then(data=>{
          service.sendingMail(req.body.email,'Confirm account',`
            <h1>This is confirm letter</h1>
            <p>For confirm it go to this link in postman with patch request:
            http://localhost:3000/user/confirm/${data[0][0].id_user}</p>
          `);
          res.send(data[0]);
        }).catch(err=>{
          res.send({err});
        });
      }).catch(err=>{
        res.send({err});
      });
    };
    if(req.body.permission){
      if(!req.headers.iduser){
        return res.send({err:'You must be authorized admin'});
      }
      valid.checkStatus(req.headers.iduser).then(data=>{
        if(data[0][0].permission!=='admin'){
          return res.send({err:'You must be admin'});
        }else{
          create();
        }
      }).catch(err=>{
        res.send({err});
      });
    }else{
      create();
    }
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
  editUser(req,res,next){
    let doWeNeedSendEmail=false;
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
      if(service.checkStatus(repository,req.headers.iduser)){
        return res.send({err:service.checkStatus(repository,req.headers.iduser)});
      }
    }
    if(req.body.tokenReset===0){
      req.body.tokenReset=null;
    }else if(req.body.tokenReset&&req.body.tokenReset===1){
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
      doWeNeedSendEmail=true;
    }else if(req.body.tokenReset){
      return res.send({err:'tokenReset must be either 1 or 0'});
    }
    const editIt=()=>{
      repository.editUser(req.body,req.params.idUser).then(done=>{
        repository.getUser(req.params.idUser).then(data=>{
          if(doWeNeedSendEmail){
            service.sendingMail(data[0][0].email,'Reset password',`
              <h1>This is letter for reset password</h1>
              <p>For reset password go to this link http://localhost:3000/users/reset/password/${data[0][0].id_user} in postman 
              with patch request and do not forget to past new password in body in password line</p>
            `);
          }
          res.send(data[0]);
        }).catch(err=>{
          res.send({err});
        })
      }).catch(err=>{
        res.send({err});
      });
    };
    if(req.headers.iduser!==req.params.idUser){
      repository.takeStatus(req.headers.iduser).then(data=>{
        if(data[0][0].permission!=='admin'){
          return res.send({err:'You must be an admin'});
        }else{
          editIt();
        }
      }).catch(err=>{
        res.send({err});
      });
    }else{
      editIt();
    }
  }
  deleteUser(req,res,next){
    const deleteIt = ()=>{
      repository.deleteUser(req.params.idUser).then(done=>{
        res.send({done});
      }).catch(err=>{
        res.send({err});
      });
    };
    if(req.headers.iduser!==req.params.idUser){
      repository.takeStatus(req.headers.iduser).then(data=>{
        if(data[0][0].permission!=='admin'){
          return res.send({err:'You must be an admin'});
        }else{
          deleteIt();
        }
      }).catch(err=>{
        return res.send({err});
      });
    }else{
      deleteIt();
    }
  }
}

module.exports = new Controler;
