const db=require('../../../utils/database');

class Repository{
  createAccount(newDataForAccount){
    if(newDataForAccount.permission){
      return db.execute(`INSERT users(username,password,email,confirm_token,permission) VALUES ('${newDataForAccount.username}','${newDataForAccount.password}','${newDataForAccount.email}','${newDataForAccount.tokenConfirm}',${newDataForAccount.permission})`);
    }else{
      return db.execute(`INSERT users(username,password,email,confirm_token) VALUES ('${newDataForAccount.username}','${newDataForAccount.password}','${newDataForAccount.email}','${newDataForAccount.tokenConfirm}')`);
    }
  }
  getUsers(){
    return db.execute('SELECT * FROM users');
  }
  getUserByEmail(email){
    return db.execute(`SELECT * FROM users WHERE email='${email}'`);
  }
  getUser(idUser){
    return db.execute(`SELECT * FROM users WHERE id_user=${idUser}`);
  }
  getUserByConfToken(token){
    return db.execute(`SELECT * FROM users WHERE token_confirm='${token}'`);
  }
  getUserByResetToken(token){
    return db.execute(`SELECT * FROM users WHERE token_reset='${token}'`);
  }
  addStatus(newStatus){
    return db.execute(`INSERT status_perm(permission) VALUES ('${newStatus.call}')`);
  }
  backStatuses(){
    return db.execute('SELECT * FROM status_perm');
  }
  takeStatus(idUser){
    return db.execute(`SELECT * FROM status_perm WHERE id_status=(SELECT permission FROM users WHERE id_user=${idUser})`);
  }
  addImage(newImageData){
    return db.execute(`INSERT image(image_url) VALUES ('${newImageData.url}')`);
  }
  takeImage(idUser){
    return db.execute(`SELECT * FROM image WHERE id_image=(SELECT avatar FROM users WHERE id_user=${idUser})`);
  }
  confirmUser(idUser){
    return db.execute(`UPDATE users SET confirm_token=NULL,confirmed=1 WHERE id_user=${idUser}`);
  }
  editUser(newUserData,idUser){
    let request = `UPDATE users SET `;
    if(newUserData.username){
      request+=`username='${newUserData.username}',`;
    }
    if(newUserData.hashedPassword){
      request+=`password='${newUserData.hashedPassword}',`;
    }
    if(newUserData.email){
      request+=`email='${newUserData.email}',`;
    }
    if(newUserData.avatar){
      request+=`avatar=${newUserData.avatar},`;
    }
    if(newUserData.tokenReset){
      request+=`reset_token='${newUserData.tokenReset}',`;
    }else if(newUserData.tokenReset===null){
      request+=`reset_token=NULL,`;
    }
    if(newUserData.permission){
      request+=`permission='${newUserData.permission}',`;
    }
    if(request !== `UPDATE users SET `){
      return db.execute(`${request.slice(0,-1)} WHERE id_user=${idUser}`);
    }
  }
  deleteUser(idUser){
    return db.execute(`DELETE FROM users WHERE id_user=${idUser}`);
  }
}

module.exports = new Repository;
