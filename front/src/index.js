import { http } from './http';
import { ui } from './ui/ui-main';
import { ui_auth } from './ui/ui-main-auth';

import './css/style.css';

const token = localStorage.getItem('token');
const iduser = localStorage.getItem('iduser');

if(token&&iduser){
  http.get(`http://localhost:3000/users/${iduser}`, {authorizationToken: token}).then(data=>{
    if(data[0].permission===1 || data[0].permission===2 || data[0].permission===3){
      ui.renderMainStartPage(data[0]);
    }else{
      ui_auth.renderAuthPage();
    }
  }).catch(err=>{
    ui_auth.renderAuthPage('Error');
    console.log(err);
  });
}else{
  ui_auth.renderAuthPage();
}
