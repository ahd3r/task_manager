const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const userRepository = require('../components/user/model/repository');
const tasksRepository = require('../components/tasks/model/repository');

class ValidationInMiddleWare{
  checkValid(req,res,next){
    if(!validationResult(req).isEmpty()){
      return res.send({error:validationResult(req).array()});
    }else{
      next();
    }
  }
  validConfToken(token){
    return userRepository.getUserByConfToken(token);
    // .then(data=>{
    //   if(data[0].length===0){
    //     return token;
    //   }else{
    //     return 'using'
    //   }
    // }).catch(err=>{
    //   return {err};
    // });
  }
  validResetToken(token){
    return userRepository.getUserByResetToken(token);
    // .then(data=>{
    //   if(data[0].length!==0){
    //     return token;
    //   }else{
    //     return 'using'
    //   }
    // }).catch(err=>{
    //   return {err}
    // })
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
      req.headers.iduser=parseInt(req.headers.iduser);
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
      req.headers.iduser=parseInt(req.headers.iduser);
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
      req.headers.iduser=parseInt(req.headers.iduser);
      tasksRepository.getUserTasks(req.headers.iduser).then(data=>{
        if(data[0].length>5){
          userRepository.takeStatus(req.headers.iduser).then(data=>{
            if(data[0][0].permission==='paid'){
              next();
            }else{
              res.send({err:'You are not paid user'});
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
  checkStatus(idUser){
    return userRepository.takeStatus(idUser);
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
  relocatedForData(req,res,next){
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
