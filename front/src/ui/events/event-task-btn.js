import { http } from '../../http';

class BtnTasksEvent{
  getOneTask(idTask){}
  deleteTaskEvent(){}
  deleteTasksEvent(){}
  updateTaskEvent(){}
  doneTaskEvent(){}
  doneTasksEvent(){}
  createTaskEvent(){}
  getTasksEvent(e,page,amount){
    if(typeof(page)==='number' && typeof(amount)==='number' && !e){
      console.log(page,amount);
    }else if(e){
      if(e.target.textContent==='Previous'){
        const curPage = document.querySelector('.pagination').querySelector('.active').textContent;
        console.log(parseInt(curPage)-1, 5);
      }else if(e.target.textContent==='Next'){
        const curPage = document.querySelector('.pagination').querySelector('.active').textContent;
        console.log(parseInt(curPage)+1, 5);
      }else{
        const newPage = e.target.textContent;
        console.log(parseInt(newPage),5);
      }
    }
  }
}

export const btnTasksEvent = new BtnTasksEvent;
