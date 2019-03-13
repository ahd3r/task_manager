import { http } from '../http';

class Helpers{
  clearNav(){
    if(document.querySelector('nav')){
      document.querySelector('nav').remove();
    }
  }
  clearTaskPlace(idTask){}
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
    document.insertBefore(nav,document.querySelector('body>.container'));
    document.querySelector('nav>a').textContent='TODO';
  }
  renderNav(userInfo){
    this.clearNav();
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-light bg-light mb-3';
    nav.appendChild(document.createElement('a')).className='title navbar-brand m-auto';
    document.querySelector('nav>.title').textContent='TODO';
    nav.appendChild(document.createElement('a')).className='navbar-brand mr-auto ava';
    nav.querySelector('.ava').appendChild(document.createElement('img')).setAttribute('src','');
    document.insertBefore(nav,document.querySelector('body>.container'));
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
    document.querySelector('body').insertBefore(alert,document.querySelector('.container'))
  }
  paginationTasks(){}
  paginationUsers(){}
  formForEditTask(){}
  checkConfToken(){}
  checkResetToken(){}
}

export const helpers = new Helpers;
