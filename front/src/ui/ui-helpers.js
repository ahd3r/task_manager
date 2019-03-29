import { btnUsersEvent } from './evetns/event-user-btn';
import { btnTasksEvent } from './evetns/event-task-btn';

class Helpers{
  clearTaskPlace(idTask){
    if(document.querySelector(`#taskid-${idTask}`)){
      while(document.querySelector(`#taskid-${idTask}`).firstChild){
        document.querySelector(`#taskid-${idTask}`).remove();
      }
    }else{
      console.log('Task with this id in #id does not exist');
    }
  }
  formForEditTask(idTask){
    this.clearTaskPlace(idTask);
    const taskInfo = btnTasksEvent(idTask);
    const editForm = document.createElement('form');
    editForm.className = 'form-inline mb-3 mt-3 editTaskForm';
    const input = document.createElement('input');
    k.idunno
  }
  clearNav(){
    if(document.querySelector('nav')){
      while(document.querySelector('nav')){
        document.querySelector('nav').remove();
      }
    }
  }
  clearMain(){
    if(document.querySelector('body>.container>.row>#main').firstChild){
      while(document.querySelector('body>.container>.row>#main').firstChild){
        document.querySelector('body>.container>.row>#main').firstChild.remove();
      }
    }
  }
  renderNavForUnsignedUser(){
    this.clearNav();
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-light bg-light mb-3';
    nav.appendChild(document.createElement('a')).className='title navbar-brand m-auto';
    document.querySelector('body').insertBefore(nav,document.querySelector('.container'));
    document.querySelector('nav>a').textContent='TODO';
    document.querySelector('nav>.title').addEventListener('click',btnUsersEvent.toMain);
  }
  renderNav(userInfo){
    this.clearNav();
    const logout = document.createElement('a');
    logout.className = 'LogOut';
    logout.textContent = 'LogOut mr-auto';
    logout.addEventListener('click', btnUsersEvent.logoutUser);
    const ava = document.createElement('img');
    ava.height = 30;
    ava.width = 30;
    ava.style.borderRadius = '50%';
    ava.src = userInfo.avatar;
    ava.className = 'ml-auto';
    const nickname = document.createElement('h7');
    nickname.textContent = userInfo.username;
    nickname.className = 'ml-auto';
    const menu = document.createElement('a');
    menu.textContent = 'Menu';
    menu.className = 'menuOpen mr-auto';
    if(userInfo.permission = 'admin'){
      menu.addEventListener('mouseover',btnUsersEvent.showAdminMenu);
    }else{
      menu.addEventListener('mouseout',btnUsersEvent.showUserMenu);
    }
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-light bg-light mb-3';
    nav.appendChild(document.createElement('a')).className='title navbar-brand m-auto';
    document.querySelector('nav>.title').textContent='TODO';
    document.querySelector('nav>.title').addEventListener('click',btnUsersEvent.toMain);
    nav.appendChild(ava);
    nav.appendChild(nickname);
    nav.appendChild(logout);
    nav.appendChild(menu);
    document.querySelector('body').insertBefore(nav,document.querySelector('.container'));
  }
  renderAlert(msg,color){
    const alert = document.createElement('div');
    if(color==='red'){
      alert.className='alert alert-danger';
    }else if(color==='green'){
      alert.className='alert alert-success';
    }else if(color==='orange'){
      alert.className='alert alert-warning';
    }else if(color==='grey'){
      alert.className='alert alert-dark';
    }
    alert.className+=' myalert';
    alert.textContent = msg;
    document.querySelector('body').insertBefore(alert,document.querySelector('.container'));
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }
  paginationAll(cur,allPage){
    const pagination = document.createElement('ul');
    pagination.className='pagination justify-content-center';
    const previous = document.createElement('li');
    if(cur===1){
      previous.className = 'page-item disabled';
    }else{
      previous.className = 'page-item';
    }
    previous.appendChild(document.createElement('a')).className = 'page-link';
    previous.querySelector('a').textContent = 'Previous';
    previous.addEventListener('click',btnTasksEvent.getTasksEvent);
    pagination.appendChild(previous);
    if(allPage>=9){
      const some = document.createElement('li');
      some.appendChild(document.createElement('a')).className='page-link';
      some.querySelector('a').textContent='...';
      if(cur>4 && cur<allPage-3){
        const first = document.createElement('li');
        first.appendChild(document.createElement('a')).className='page-link';
        first.querySelector('a').textContent=1;
        first.addEventListener('click',btnTasksEvent.getTasksEvent);
        pagination.appendChild(first);
        pagination.appendChild(some);
        for(let i=1; i<=5; i++){
          const page = document.createElement('li');
          if(i===3){
            page.appendChild(document.createElement('a')).className='page-link active';
          }else{
            page.appendChild(document.createElement('a')).className='page-link';
          }
          page.querySelector('a').textContent=cur-2+i;
          page.addEventListener('click',btnTasksEvent.getTasksEvent);
          pagination.appendChild(page);
        }
        pagination.appendChild(some);
        const last = document.createElement('li');
        last.appendChild(document.createElement('a')).className='page-link';
        last.querySelector('a').textContent=allPage;
        last.addEventListener('click',btnTasksEvent.getTasksEvent);
        pagination.appendChild(last);
      }else if(cur<=4){
        for(let i=1; i<=5; i++){
          const page = document.createElement('li');
          if(cur===i){
            page.appendChild(document.createElement('a')).className='page-link active';
          }else{
            page.appendChild(document.createElement('a')).className='page-link';
          }
          page.querySelector('a').textContent=cur-2+i;
          page.addEventListener('click',btnTasksEvent.getTasksEvent);
          pagination.appendChild(page);
        }
        pagination.appendChild(some);
        const last = document.createElement('li');
        last.appendChild(document.createElement('a')).className='page-link';
        last.querySelector('a').textContent=allPage;
        last.addEventListener('click',btnTasksEvent.getTasksEvent);
        pagination.appendChild(last);
      }else if(cur>=allPage-3){
        const first = document.createElement('li');
        first.appendChild(document.createElement('a')).className='page-link';
        first.querySelector('a').textContent=1;
        first.addEventListener('click',btnTasksEvent.getTasksEvent);
        pagination.appendChild(first);
        pagination.appendChild(some);
        for(let i=1; i<=5; i++){
          const page = document.createElement('li');
          if(cur===cur-2+i){
            page.appendChild(document.createElement('a')).className='page-link active';
          }else{
            page.appendChild(document.createElement('a')).className='page-link';
          }
          page.querySelector('a').textContent=cur-2+i;
          page.addEventListener('click',btnTasksEvent.getTasksEvent);
          pagination.appendChild(page);
        }
      }
    }else{
      for(let i=1; i<=allPage; i++){
        const page = document.createElement('li');
        if(cur===i){
          page.className='page-item active';
        }else{
          page.className='page-item';
        }
        page.appendChild(document.createElement('a')).className='page-link';
        page.querySelector('a').textContent=i;
        page.addEventListener('click',btnTasksEvent.getTasksEvent);
        pagination.appendChild(page);
      }
    }
    const next = document.createElement('li');
    if(cur===allPage){
      next.className = 'page-item disabled';
    }else{
      next.className = 'page-item';
    }
    next.appendChild(document.createElement('a')).className = 'page-link';
    next.querySelector('a').textContent = 'Next';
    next.addEventListener('click',btnTasksEvent.getTasksEvent);
    pagination.appendChild(next);
    document.querySelector('#pag').appendChild(pagination);
  }
  checkConfToken(user){
    if(user.confirm_token){
      return false
    }else{
      return true
    }
  }
  checkResetToken(user){
    if(user.reset_token){
      return false
    }else{
      return true
    }
  }
}

export const helpers = new Helpers;
