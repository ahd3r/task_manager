import { http } from './http';
import { ui } from './ui/ui-main';

const token = localStorage.getItem('token');
const iduser = localStorage.getItem('iduser');

if(token&&iduser){
  http.get(`http://localhost:3000/users/${iduser}`).then(data=>{
    if(data[0].permission==='admin'){
      ui.renderAdminPage(data[0]);
    }else if(data[0].permission==='user'||data[0].permission==='paid'){
      ui.renderUserPage(data[0]);
    }else{
      ui.renderAuthPage();
    }
  }).catch(err=>{
    console.log(err);
  });
}else{
  ui.renderAuthPage();
}
