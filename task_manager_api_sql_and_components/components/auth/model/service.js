const jwt = require('jsonwebtoken');
const hashed = require('bcrypt');

class Service{
  loginUser(data,inBody){
    return new Promise((resolve,reject)=>{
      const checkPass = hashed.compareSync(inBody.password,data[0][0].password);
      if(checkPass){
        const token = jwt.sign({email:inBody.email},'imusttodoneittodayinanycase');
        resolve({authorization:token,user:data[0],iduser:data[0][0].id_user});
      }else{
        reject('Password is not right');
      }
    });
  }
}

module.exports = new Service;
