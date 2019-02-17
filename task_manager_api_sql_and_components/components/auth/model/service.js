const jwt = require('jsonwebtoken');
const hashed = require('bcrypt');

class Service{
  loginUser(data){
    return new Promise((resolve,reject)=>{
      if(data[0].length!==0){
        const checkPass = hashed.compareSync(req.body.password,data[0][0].password);
        if(checkPass){
          const token = jwt.sign({email:req.body.email},'imusttodoneittodayinanycase');
          resolve({authorization:token,user:data[0],iduser:data[0][0].id_user});
        }else{
          reject({error:'Password is not right'});
        }
      }else{
        reject({error:'This user does not exist'});
      }
    });
  }
}

module.exports = new Service;
