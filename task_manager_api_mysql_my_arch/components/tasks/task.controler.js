const service = require('./model/service');
const repository = require('./model/repository');
const valid = require('../../utils/middleware');

class Controler{
  backTasks(req,res,next){
    const forPagination=service.pagination(req.params.page,req.params.amount);
    let resultForSend;
    repository.getAllTasks(forPagination.last,forPagination.amount).then(data=>{
      if(data[0].length===0){
        return res.send({msg:'No tasks'});
      }else{
        resultForSend = [...data[0]];
        return repository.getCountOfAllTasks()
      }
    }).then(result=>{
      resultForSend = [result[0][0],...resultForSend];
      res.send(resultForSend);
    }).catch(err=>{
      res.send({err});
    });
  }
  backTask(req,res,next){
    repository.getTask(req.params.idTask).then(data=>{
      if(data[0].length===0){
        res.send({error:'This id does not exist'});
      }else{
        res.send(data[0]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  backDelAllTasks(req,res,next){
    const forPagination = service.pagination(req.params.page,req.params.amount);
    let sendIt;
    repository.getAllDelTasks(forPagination.last,forPagination.amount).then(data=>{
      if(data[0].length===0){
        res.send({msg:'Deleted tasks does not exist'});
      }else{
        sendIt = [...data[0]];
        return repository.getCountOfAllDelTasks();
      }
    }).then(result=>{
      sendIt=[result[0][0],...sendIt];
      res.send(sendIt);
    }).catch(err=>{
      res.send({err});
    });
  }
  backAllTasksTotaly(req,res,next){
    let sendIt=[];
    let totalCountOfTasks=0;
    repository.getAllTasks().then(tasks=>{
      totalCountOfTasks+=tasks[0].length;
      if(tasks[0].length===0){
        sendIt=[...sendIt,{msg:'No Tasks'}];
      }else{
        sendIt=[...sendIt,...tasks[0]];
      }
      return repository.getAllDelTasks()
    }).then(delTasks=>{
      totalCountOfTasks+=delTasks[0].length;
      if(delTasks[0].length===0){
        sendIt=[...sendIt,{msg:'No Del Tasks'}];
      }else{
        sendIt=[...sendIt,...delTasks[0]];
      }
      res.send([{total:totalCountOfTasks},...sendIt]);
    }).catch(err=>{
      res.send({err});
    });
  }
  backDoneTasks(req,res,next){
    repository.getAllDoneTasks().then(data=>{
      if(data[0].length===0){
        res.send({msg:'Does not exist'});
      }else{
        res.send(data[0]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  backDoneDelTasks(req,res,next){
    repository.getAllDoneDelTasks().then(data=>{
      if(data[0].length===0){
        res.send({msg:'Does not exist'});
      }else{
        res.send(data[0]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  backTasksForUser(req,res,next){
    let sendIt;
    const forPagination = service.pagination(req.params.page,req.params.amount);
    repository.getUserTasks(req.params.idUser,forPagination.last,forPagination.amount).then(data=>{
      if(data[0].length===0){
        res.send({msg:'No tasks'});
      }else{
        sendIt=[...data[0]];
        return repository.getCountOfUserTasks(req.params.idUser);
      }
    }).then(count=>{
      sendIt = [count[0][0],...sendIt]
      res.send(sendIt);
    }).catch(err=>{
      res.send({err});
    });
  }
  backDelTasksForUser(req,res,next){
    const forPagination = service.pagination(req.params.page,req.params.amount);
    repository.getUserDelTasks(req.params.idUser,forPagination.last,forPagination.amount).then(data=>{
      if(data[0].length===0){
        res.send({msg:'No tasks'});
      }else{
        res.send(data[0]);
      }
    }).catch(err=>{
      res.send(err);
    });
  }
  backAllTasksForUser(req,res,next){
    let sendIt=[];
    let resCount = 0;
    repository.getUserTasks(req.params.idUser).then(tasks=>{
      resCount+=tasks[0].length;
      if(tasks[0].length===0){
        sendIt=[{msg:'No Tasks'},...sendIt];
      }else{
        sendIt=[...tasks[0],...sendIt];
      }
      return repository.getUserDelTasks(req.params.idUser)
    }).then(delTasks=>{
      resCount+=delTasks[0].length;
      if(delTasks[0].length===0){
        sendIt=[...sendIt,{msg:'No Del Tasks'}];
      }else{
        sendIt=[...sendIt,...delTasks[0]];
      }
      res.send([{total:resCount},...sendIt]);
    }).catch(err=>{
      res.send({err});
    });
  }
  backAllUserTasksByDate(req,res,next){
    // validation was in middleware routes
    if(req.params.idUser){
      repository.getTasksByDateForOneUser(req.params.idUser,req.params.year,req.params.month,req.params.day).then(data=>{
        res.send(data[0].slice(0,-1));
      }).catch(err=>{
        res.send(err);
      });
    }else{
      repository.getTasksByDateForOneUser(req.headers.iduser,req.params.year,req.params.month,req.params.day).then(data=>{
        res.send(data[0].slice(0,-1));
      }).catch(err=>{
        res.send(err);
      });
    }
  }
  backAllTasksByDate(req,res,next){
    // validation was in middleware routes
    repository.getTasksByDateForAdmin(req.params.year,req.params.month,req.params.day).then(data=>{
      res.send(data[0].slice(0,-1));
    }).catch(err=>{
      res.send(err);
    });
  }
  createTasks(req,res,next){
    const dataForNewTask={call:req.body.call,creator:req.headers.iduser};
    const forPagination = service.pagination(1,5);
    let sendIt;
    repository.createTask(dataForNewTask).then(done=>{
      return repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount)
    }).then(data=>{
      sendIt = [...data[0]];
      return repository.getCountOfUserTasks(req.headers.iduser)
    }).then(count=>{
      sendIt = [count[0][0],...sendIt];
      res.send(sendIt);
    }).catch(err=>{
      res.send({err});
    });
  }
  editTasks(req,res,next){
    const forPagination = service.pagination(1,5);
    const editedDataOfTasks = {call:req.body.call,id:req.params.idTask};
    repository.editTask(editedDataOfTasks).then(done=>{
      return repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount)
    }).then(result=>{
      res.send(result[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  doneTask(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.doneTask(req.params.idTask).then(done=>{
      return repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount)
    }).then(result=>{
      res.send(result[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  doneAllTasks(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.getUserUndoneTasks(req.headers.iduser).then(data=>{
      if(data[0].length!==0){
        data[0].forEach((eachTask,index)=>{
          if(data[0].length===index+1){
            return repository.doneTask(eachTask.id_task)
          }else{
            repository.doneTask(eachTask.id_task);
          }
        });
      }else{
        res.send({err:'NOPE'});
      }
    }).then(done=>{
      return repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount)
    }).then(result=>{
      res.send(result[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
  // Just move tasks to delTasks table in db
  deleteTask(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.deleteTask(req.params.idTask).then(done=>{
      return repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount)
    }).then(result=>{
      if(result[0].length===0){
        return res.send({msg:'No tasks'});
      }else{
        res.send(result[0]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteSomeTasks(req,res,next){
    const forPagination = service.pagination(1,5);
    req.body.arrOfId.forEach((elem,ind)=>{
      repository.getTask(elem).then(data=>{
        if(req.body.arrOfId.length===ind+1){
          if(data[0][0].task_owner===parseInt(req.headers.iduser)){
            repository.deleteTask(elem).then(done=>{
              repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
                repository.getCountOfUserTasks(req.headers.iduser).then(count=>{
                  res.send([count[0][0],...data[0]]);
                }).catch(err=>{
                  res.send(err);
                });
              }).catch(err=>{
                res.send({err})
              });
            }).catch(err=>{
              res.send({err});
            });
          }else{
            valid.checkStatus(req.headers.iduser).then(data=>{
              if(data[0][0].permission==='admin'){
                repository.deleteTask(elem).then(data=>{
                  repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
                    repository.getCountOfUserTasks(req.headers.iduser).then(count=>{
                      res.send([count[0][0],...data[0]]);
                    }).catch(err=>{
                      res.send(err);
                    });
                  }).catch(err=>{
                    res.send({err})
                  });
                }).catch(err=>{
                  res.send({err});
                });
              }else{
                res.send({err:'You are not admin'});
              }
            }).catch(err=>{
              res.send({err});
            });
          }
        }else{
          if(data[0][0].task_owner===parseInt(req.headers.iduser)){
            repository.deleteTask(elem);
          }else{
            valid.checkStatus(req.headers.iduser).then(data=>{
              if(data[0][0].permission==='admin'){
                repository.deleteTask(elem);
              }else{
                res.send({err:'You are not admin'});
              }
            }).catch(err=>{
              res.send({err});
            });
          }
        }
      }).catch(err=>{
        res.send({err});
      });
    });
  }
  deleteDoneUserTasks(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.getUserDoneTasks(req.params.idUser).then(data=>{
      if(data[0].length===0){
        return res.send({msg:'No tasks'});
      }
      data[0].forEach((elem,ind)=>{
        if(ind+1===data[0].length){
          return repository.deleteTask(elem.id_task)
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
    }).then(done=>{
      return repository.getUserTasks(req.params.idUser,forPagination.last,forPagination.amount)
    }).then(result=>{
      if(result[0].length===0){
        return res.send({msg:'No tasks'});
      }else{
        res.send(result[0]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteAllUserTasks(req,res,next){
    repository.getUserTasks(req.params.idUser).then(data=>{
      if(data[0].length===0){
        return res.send({msg:'No tasks'});
      }
      data[0].forEach((elem,ind)=>{
        if(ind+1===data[0].length){
          return repository.deleteTask(elem.id_task)
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
    }).then(done=>{
      res.send({msg:'No tasks'});
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteAllDoneTasks(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.getAllDoneTasks().then(data=>{
      if(data[0].length===0){
        return res.send({msg:'This tasks does not exist'});
      }
      data[0].forEach((elem,ind)=>{
        if(ind+1===data[0].length){
          return repository.deleteTask(elem.id_task);
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
    }).then(done=>{
      repository.getAllTasks(forPagination.last,forPagination.amount)
    }).then(data=>{
      if(data[0].length===0){
        res.send({msg:'No tasks'});
      }else{
        res.send(data[0]);
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteAllTasks(req,res,next){
    repository.getAllTasks().then(data=>{
      if(data[0].length===0){
        return res.send({msg:'No tasks'});
      }
      data[0].forEach((elem,ind)=>{
        if(ind+1===data[0].length){
          return repository.deleteTask(elem.id_task)
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
    }).then(done=>{
      res.send({msg:'No tasks'});
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new Controler;
