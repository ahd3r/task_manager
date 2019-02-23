const service = require('./model/service');
const repository = require('./model/repository');
const valid = require('../../utils/middleware');

class Controler{
  backTasks(req,res,next){
    const forPagination=service.pagination(req.params.page,req.params.amount);
    repository.getAllTasks(forPagination.last,forPagination.amount).then(data=>{
      if(data[0].length===0){
        return res.send({msg:'No tasks'});
      }else{
        repository.getCountOfAllTasks().then(result=>{
          res.send([result[0][0],...data[0]]);
        }).catch(err=>{
          res.send({err})
        });
      }
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
    repository.getAllDelTasks(forPagination.last,forPagination.amount).then(data=>{
      repository.getCountOfAllDelTasks().then(result=>{
        if(data[0].length===0){
          res.send({msg:'Deleted tasks does not exist'});
        }else{
          res.send([result[0][0],...data[0]]);
        }
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  backAllTasksTotaly(req,res,next){
    repository.getAllTasks().then(tasks=>{
      repository.getAllDelTasks().then(delTasks=>{
        if(tasks[0].length===0){
          tasks[0]=[{msg:'No Tasks'}];
        }
        if(delTasks[0].length===0){
          delTasks[0]=[{msg:'No Tasks'}];
        }
        res.send([{total:tasks[0].length+delTasks[0].length},...tasks[0],...delTasks[0]]);
      }).catch(err=>{
        res.send({err});
      });
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
    const forPagination = service.pagination(req.params.page,req.params.amount);
    repository.getUserTasks(req.params.idUser,forPagination.last,forPagination.amount).then(data=>{
      if(data[0].length===0){
        res.send({msg:'No tasks'});
      }else{
        repository.getCountOfUserTasks(req.params.idUser).then(count=>{
          res.send([count[0][0],...data[0]]);
        }).catch(err=>{
          res.send({err});
        });
      }
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
    repository.getUserTasks(req.params.idUser).then(tasks=>{
      repository.getUserDelTasks(req.params.idUser).then(delTasks=>{
        if(tasks[0].length===0){
          tasks[0]=[{msg:'No Tasks'}];
        }
        if(delTasks[0].length===0){
          delTasks[0]=[{msg:'No Tasks'}];
        }
        res.send([...tasks[0],...delTasks[0]]);
      }).catch(err=>{
        res.send({err})
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  backAllUserTasksByDate(req,res,next){
    // validation was in middleware routes
    repository.getTasksByDateForOneUser(req.headers.iduser,req.params.year,req.params.month).then(data=>{
      res.send(data[0].slice(0,-1));
    }).catch(err=>{
      res.send(err);
    });
  }
  backAllTasksByDate(req,res,next){
    // validation was in middleware routes
    repository.getTasksByDateForAdmin(req.params.year,req.params.month).then(data=>{
      res.send(data[0].slice(0,-1));
    }).catch(err=>{
      res.send(err);
    });
  }
  createTasks(req,res,next){
    const dataForNewTask={call:req.body.call,creator:req.headers.iduser};
    const forPagination = service.pagination(1,5);
    repository.createTask(dataForNewTask).then(done=>{
      repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
        repository.getCountOfUserTasks(req.headers.iduser).then(count=>{
          res.send([count[0][0],...data[0]]);
        }).catch(err=>{
          res.send({err});
        });
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  editTasks(req,res,next){
    const forPagination = service.pagination(1,5);
    const editedDataOfTasks = {call:req.body.call,id:req.params.idTask};
    repository.editTask(editedDataOfTasks).then(done=>{
      repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(result=>{
        res.send(result[0]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  doneTask(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.doneTask(req.params.idTask).then(done=>{
      repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(result=>{
        res.send(result[0]);
      }).catch(err=>{
        res.send({err});
      });
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
            repository.doneTask(eachTask.id_task).then(done=>{
              repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(result=>{
                res.send(result[0]);
              }).catch(err=>{
                res.send({err});
              });
            }).catch(err=>{
              res.send({err});
            });
          }else{
            repository.doneTask(eachTask.id_task);
          }
        });
      }else{
        res.send({err:'NOPE'});
      }
    }).catch(err=>{
      res.send({err});
    });
  }
  // Just move tasks to delTasks table in db
  deleteTask(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.deleteTask(req.params.idTask).then(done=>{
      repository.getUserTasks(req.headers.iduser,forPagination.last,forPagination.amount).then(result=>{
        if(result[0].length===0){
          return res.send({msg:'No tasks'});
        }else{
          res.send(result[0]);
        }
      }).catch(err=>{
        res.send({err});
      });
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
          repository.deleteTask(elem.id_task).then(done=>{
            repository.getUserTasks(req.params.idUser,forPagination.last,forPagination.amount).then(result=>{
              if(result[0].length===0){
                return res.send({msg:'No tasks'});
              }else{
                res.send(result[0]);
              }
            }).catch(err=>{
              res.send({err});
            });
          }).catch(err=>{
            res.send({err});
          });
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
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
          repository.deleteTask(elem.id_task).then(done=>{
            res.send({msg:'No tasks'});
          }).catch(err=>{
            res.send({err});
          });
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  deleteAllDoneTasks(req,res,next){
    repository.getAllDoneTasks().then(data=>{
      if(data[0].length===0){
        return res.send({msg:'This tasks does not exist'});
      }
      const forPagination = service.pagination(1,5);
      data[0].forEach((elem,ind)=>{
        if(ind+1===data[0].length){
          repository.deleteTask(elem.id_task).then(done=>{
            repository.getAllTasks(forPagination.last,forPagination.amount).then(data=>{
              if(data[0].length===0){
                res.send({msg:'No tasks'});
              }else{
                res.send(data[0]);
              }
            }).catch(err=>{
              res.send({err});
            });
          }).catch(err=>{
            res.send({err});
          });
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
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
          repository.deleteTask(elem.id_task).then(done=>{
            res.send({msg:'No tasks'});
          }).catch(err=>{
            res.send({err})
          });
        }else{
          repository.deleteTask(elem.id_task);
        }
      });
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new Controler;
