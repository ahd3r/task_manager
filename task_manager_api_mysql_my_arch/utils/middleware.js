const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const userRepository = require('../components/user/model/repository');
const tasksRepository = require('../components/tasks/model/repository');
const supportRepository = require('../components/support/model/repository');

class ValidationInMiddleWare{
  isYour(req,res,next){ // if route not only for admin but also for user
    if(req.params.idUser===req.headers.iduser){
      next();
    }else{
      userRepository.takeStatus(req.headers.iduser).then(data=>{
        if(data[0][0].permission==='admin'){
          next();
        }else{
          res.send({err:'You must be an admin'});
        }
      }).catch(err=>{
        res.send({err});
      });
    }
  }
  checkValid(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }else{
      next();
    }
  }
  validConfToken(token){
    return userRepository.getUserByConfToken(token);
  }
  validResetToken(token){
    return userRepository.getUserByResetToken(token);
  }
  checkStatus(idUser){
    return userRepository.takeStatus(idUser);
  }
  checkExistingAccount(req,res,next){
    userRepository.getUser(req.params.idUser).then(data=>{
      if(data[0].length===0){
        res.send({error:"This user does not exist"});
      }else{
        next();
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  isUser(req,res,next){
    if(req.headers.iduser){
      userRepository.takeStatus(req.headers.iduser).then(data=>{
        if(data[0][0].permission==='user'){
          next();
        }else{
          res.send({err:'You are not user'});
        }
      }).catch(err=>{
        res.send({err});
      });
    }else{
      res.send({error:'You are not auth'});
    }
  }
  isAdmin(req,res,next){
    if(req.headers.iduser){
      userRepository.takeStatus(req.headers.iduser).then(data=>{
        if(data[0][0].permission==='admin'){
          next();
        }else{
          res.send({err:'You are not admin'});
        }
      }).catch(err=>{
        res.send({err});
      });
    }else{
      res.send({error:'You are not auth'});
    }
  }
  isPaid(req,res,next){
    if(req.headers.iduser){
      tasksRepository.getUserTasks(req.headers.iduser).then(data=>{
        if(data[0].length>=5){
          userRepository.takeStatus(req.headers.iduser).then(data=>{
            if(data[0][0].permission==='paid'){
              next();
            }else{
              res.send({err:'You are not paid user, for get status paid, you must to say it to admin by support tab, because I dunno how to set paid system for this'});
            }
          }).catch(err=>{
            res.send({err});
          });
        }else{
          next();
        }
      }).catch(err=>{
        res.send({err});
      });
    }else{
      res.send({error:'You are not auth'});
    }
  }
  checkAuth(req,res,next){
    if(req.body.authorizationToken){
      jwt.verify(req.body.authorizationToken,'imusttodoneittodayinanycase',(err,data)=>{
        if(err){
          res.send({err,msg:'Recreate jwt in auth (Reauth)'});
        }else{
          userRepository.getUserByEmail(data.email).then(data=>{
            if(data[0].length===0){
              return res.send({err:'This user does not exist',msg:'Recreate jwt in auth (Reauth)'});
            }
            res.set('authorization',req.body.authorizationToken);
            res.set('iduser',data[0][0].id_user);
            next();
          }).catch(err=>{
            res.send({err});
          });
        }
      })
    }else if(req.headers.authorization){
      jwt.verify(req.headers.authorization,'imusttodoneittodayinanycase',(err,data)=>{
        if(err){
          res.send({err,msg:'Recreate jwt in auth (Reauth)'});
        }else{
          userRepository.getUserByEmail(data.email).then(data=>{
            if(data[0].length===0){
              return res.send({err:'This user does not exist',msg:'Recreate jwt in auth (Reauth)'});
            }
            if(data[0][0].id_user===parseInt(req.headers.iduser)){
              next();
            }else{
              res.send({err:'jwt are not mutch to iduser in header', msg:'Recreate jwt in auth (Reauth)'});
            }
          }).catch(err=>{
            res.send({err});
          });
        }
      });
    }else{
      res.send({err:'Render auth page'});
    }
  }
  checkSupportMsg(req,res,next){
    supportRepository.getMessage(req.params.idMessage).then(data=>{
      if(data[0].length===0){
        res.send({err:'This task does not exist'});
      }else{
        next();
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  checkTask(req,res,next){
    tasksRepository.getTask(req.params.idTask).then(data=>{
      if(data[0][0].task_owner===parseInt(req.headers.iduser)){
        next();
      }else{
        userRepository.takeStatus(req.headers.iduser).then(data=>{
          if(data[0][0].permission==='admin'){
            next();
          }else{
            res.send({err:'You are not admin'});
          }
        }).catch(err=>{
          res.send({err});
        });
      }
    }).catch(err=>{
      res.send({err})
    });
  }
  relocatedForDate(req,res,next){
    userRepository.takeStatus(req.headers.iduser).then(data=>{
      if(data[0][0].permission==='admin'){
        next();
      }else{
        next('route');
      }
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new ValidationInMiddleWare;
