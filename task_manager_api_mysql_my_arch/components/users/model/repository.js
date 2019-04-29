let db;
if(process.env.NODE_ENV==='test'){
  db = require('../../../utils/database_test');
}else{
  db = require('../../../utils/database');
}

class Repository{
  backUsers(last,amount){
    return db.execute(`SELECT * FROM users LIMIT ${last},${amount}`);
  }
  backUser(idUser){
    return db.execute(`SELECT * FROM users WHERE id_user=${idUser}`);
  }
  backUserByEmail(email){
    return db.execute(`SELECT * FROM users WHERE email='${email}'`);
  }
  backStatuses(){
    return db.execute('SELECT * FROM status_perm');
  }
  createUser(userData){
    if(userData.permission){
      return db.execute(`INSERT users(username,password,email,permission) VALUES ('${userData.username}','${userData.password}','${userData.email}',${userData.permission})`);
    }else{
      return db.execute(`INSERT users(username,password,email) VALUES ('${userData.username}','${userData.password}','${userData.email}')`);
    }
  }
  editUser(newData,idUser){
    const request = 'UPDATE users SET ';
    if(newData.username){
      request+=`username = '${newData.username}' `;
    }
    if(newData.password){
      request+=`password = '${newData.password}' `;
    }
    if(newData.email){
      request+=`email = '${newData.email}' `;
    }
    if(newData.avatar){
      request+=`avatar = ${newData.avatar} `;
    }
    if(newData.permission){
      request+=`permission = ${newData.permission} `;
    }
    request+=`WHERE id_user=${idUser}`;
    return db.execute(request);
  }
  deleteUser(idUser){
    return db.execute(`UPDATE users SET active=0 WHERE id_user=${idUser}`);
  }
  createImage(url){
    return db.execute(`INSERT image(image_url) VALUES ('${url}')`);
  }
  createStatus(statusCall){
    return db.execute(`INSERT status_perm(permission) VALUES ('${statusCall}')`);
  }
  confirmUser(idUser){
    return db.execute(`UPDATE users SET confirmed=1 WHERE id_user=${idUser}`);
  }
  backUsersBySearch(search){
    return db.execute(`SELECT * FROM users WHERE username LIKE '%${search}%'`);
  }
}

module.exports = new Repository;
