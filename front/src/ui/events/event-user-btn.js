import { http } from '../../http';

class BtnUsersEvent{
  clearConfToken(idUser){}
  clearResetToken(idUser){}
  createUser(e){
    e.preventDefault();
  }
  resetPass(e){
    this.clearResetToken();
    e.preventDefault();
  }
  editUser(){}
  confirmUser(){
    this.clearConfToken();
  }
  loginUser(e){
    e.preventDefault();
    this.clearResetToken();
  }
  logoutUser(){}
  deleteUser(){}
  showAdminMenu(){}
  showUserMenu(){}
  toMain(){
    location.reload();
  }
  sendLetterToEmail(e){
    e.preventDefault();
  }
}

export const btnUsersEvent = new BtnUsersEvent;
