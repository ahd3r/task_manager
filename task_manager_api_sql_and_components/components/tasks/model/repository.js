const db = require('../../../utils/database');

class Repository{
  getAllTasks(last,amount){
    if(last&&amount){
      return db.execute(`SELECT * FROM tasks LIMIT ${last},${amount}`);
    }else{
      return db.execute(`SELECT * FROM tasks`);
    }
  }
  getAllDelTasks(last,amount){
    if(last&&amount){
      return db.execute(`SELECT * FROM del_tasks LIMIT ${last},${amount}`);
    }else{
      return db.execute(`SELECT * FROM del_tasks`);
    }
  }
  // getAllTasksTotaly(){}
  getTask(idTask){
    return db.execute(`SELECT * FROM tasks WHERE id_task=${idTask}`);
  }
  getAllDoneTasks(last,amount){
    if(last&&amount){
      return db.execute(`SELECT * FROM tasks WHERE NOT task_done=0 LIMIT ${last},${amount}`);
    }else{
      return db.execute(`SELECT * FROM tasks WHERE NOT task_done=0`);
    }
  }
  getAllDoneDelTasks(last,amount){
    if(last&&amount){
      return db.execute(`SELECT * FROM del_tasks WHERE NOT del_task_done=0 LIMIT ${last},${amount}`);
    }else{
      return db.execute(`SELECT * FROM del_tasks WHERE NOT del_task_done=0`);
    }
  }
  getUserTasks(idUser,last,amount){
    if(last&&amount){
      return db.execute(`SELECT * FROM tasks WHERE task_owner = ${idUser} LIMIT ${last},${amount}`);
    }else{
      return db.execute(`SELECT * FROM tasks WHERE task_owner = ${idUser}`);
    }
  }
  getUserDelTasks(idUser,last,amount){
    if(last&&amount){
      return db.execute(`SELECT * FROM del_tasks WHERE user_deleted = ${idUser} LIMIT ${last},${amount}`);
    }else{
      return db.execute(`SELECT * FROM del_tasks WHERE user_deleted = ${idUser}`);
    }
  }
  getUserUndoneTasks(idUser){
    return db.execute(`SELECT * FROM tasks WHERE task_owner=${idUser} AND task_done=0`);
  }
  getUserDoneTasks(idUser){
    return db.execute(`SELECT * FROM tasks WHERE task_owner=${idUser} AND NOT task_done=0`);
  }
  // getUserAllTasks(idUser){}
  getTasksByDateForOneUser(idUser,year,month){
    return db.execute(`CALL show_tasks_by_date(${idUser},${year},${month},0)`);
  }
  getTasksByDateForAdmin(year,month){
    return db.execute(`CALL show_tasks_by_date(1,${year},${month},1)`);
  }
  createTask(newTaskData){
    return db.execute(`INSERT tasks(task_name,task_owner) VALUES ('${newTaskData.call}',${newTaskData.creator})`);
  }
  editTask(editedTaskData){
    return db.execute(`UPDATE tasks SET task_name='${editedTaskData.call}' WHERE id_task = ${editedTaskData.id}`);
  }
  doneTask(idTask){
    return db.execute(`CALL done_task(${idTask})`); // nothing return
  }
  deleteTask(idTask){
    return db.execute(`CALL delete_task(${idTask})`);
  }
  // deleteDoneTasks(idUser){}
  // deleteAllTasks(idUser){}
  // deleteAllTasksTotaly(){}
}

module.exports = new Repository;
