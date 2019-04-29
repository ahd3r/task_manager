let db;
if(process.env.NODE_ENV==='test'){
  db = require('../../../utils/database_test');
}else{
  db = require('../../../utils/database');
}

class Repository{
  async getConfToken(token){
    return await db.execute(`SELECT * FROM token WHERE confirm_token='${token}'`);
  }
  async getResetToken(token){
    return await db.execute(`SELECT * FROM token WHERE reset_token='${token}'`);
  }
  async getTokenByUserId(idUser){
    return await db.execute(`SELECT * FROM token WHERE owner_user=${idUser}`);
  }
  async createConfirmTokenForUser(idUser,token){
    return await db.execute(`INSERT token(owner_user,confirm_token) VALUES (${idUser},'${token}')`);
  }
  async createResetTokenForUser(idUser,token){
    return await db.execute(`INSERT token(owner_user,reset_token) VALUES (${idUser},'${token}')`);
  }
  async updTokenResetToken(idUser,token){
    return await db.execute(`UPDATE token SET confirm_token='${token}' WHERE owner_user=${idUser}`);
  }
  async updTokenConfToken(idUser,token){
    return await db.execute(`UPDATE token SET reset_token='${token}' WHERE owner_user=${idUser}`);
  }
  async deleteTokenByConfToken(token){
    return await db.execute(`DELETE FROM token WHERE confirm_token='${token}'`);
  }
  async deleteTokenByResetToken(token){
    return await db.execute(`DELETE FROM token WHERE reset_token='${token}'`);
  }
  async deleteTokenByUserId(idUser){
    return await db.execute(`DELETE FROM token WHERE owner_user=${idUser}`);
  }
}

module.exports = new Repository;
