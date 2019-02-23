const repository = require('./model/repository');
const service = require('./model/service');

class Controler{
  getUserMessages(req,res,next){
    const forPagination = service.pagination(req.params.page,req.params.amount);
    repository.getMessagesForUser(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
      repository.getCountOfMessageForUser().then(count=>{
        res.send([count[0][0],...data[0]]);
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  createMessage(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.createMessage(req.body,req.headers.iduser).then(done=>{
      repository.getMessagesForUser(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
        repository.getCountOfMessageForUser().then(count=>{
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
  readMessage(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.readMessage(req.params.idMessage).then(done=>{
      repository.getMessagesForUser(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
        repository.getCountOfMessageForUser().then(count=>{
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
  doneMessage(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.doneMessage(req.params.idMessage).then(done=>{
      repository.getMessagesForUser(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
        repository.getCountOfMessageForUser().then(count=>{
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
  deleteMessage(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.deleteMessage(req.params.idMessage).then(data=>{
      repository.getMessagesForUser(req.headers.iduser,forPagination.last,forPagination.amount).then(data=>{
        repository.getCountOfMessageForUser().then(count=>{
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
  getMessages(req,res,next){
    const forPagination = service.pagination(1,5);
    repository.getMessages(forPagination.last,forPagination.amount).then(data=>{
      repository.getCountOfMessage().then(count=>{
        res.send([count[0][0],...data[0]])
      }).catch(err=>{
        res.send({err});
      });
    }).catch(err=>{
      res.send({err});
    });
  }
  getMessage(req,res,next){
    repository.getMessage(req.params.idMessage).then(data=>{
      res.send(data[0]);
    }).catch(err=>{
      res.send({err});
    });
  }
}

module.exports = new Controler;
