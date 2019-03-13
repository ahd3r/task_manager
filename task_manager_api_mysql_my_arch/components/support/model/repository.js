let db;
if(process.env.NODE_ENV==='test'){
  db = require('../../../utils/database_test');
}else{
  db = require('../../../utils/database');
}

class Repository{
  getMessages(last,amount){
    return db.execute(`SELECT * FROM support_message LIMIT ${last},${amount} ORDER BY id_message DESC`);
  }
  getUnreadMessages(last,amount){
    return db.execute(`SELECT * FROM support_message WHERE readed=0 LIMIT ${last},${amount} ORDER BY id_message DESC`);
  }
  getCountOfUnreadMessages(){
    return db.execute('SELECT COUNT(*) AS total FROM support_message WHERE readed=0');
  }
  getMessagesByTitle(title){
    return db.execute(`SELECT * FROM support_message WHERE title LIKE '%${title}%' ORDER BY id_message DESC`);
  }
  getCountOfMessage(){
    return db.execute('SELECT COUNT(*) AS total FROM support_message');
  }
  getMessage(idMessage){
    return db.execute(`SELECT * FROM support_message WHERE id_message=${idMessage}`);
  }
  getMessagesForUser(idUser,last,amount){
    return db.execute(`SELECT * FROM support_message WHERE creator=${idUser} LIMIT ${last},${amount} ORDER BY id_message DESC`);
  }
  getCountOfMessageForUser(){
    return db.execute('SELECT COUNT(*) AS total FROM support_message');
  }
  createMessage(dataMessage,idUser){
    return db.execute(`INSERT support_message(title,body,creator) VALUES ('${dataMessage.title}','${dataMessage.body}',${idUser})`);
  }
  doneMessage(idMessage){
    return db.execute(`UPDATE support_message SET message_status='Done' WHERE id_message=${idMessage}`);
  }
  readMessage(idMessage){
    return db.execute(`UPDATE support_message SET readed=1 WHERE id_message=${idMessage}`);
  }
  deleteMessage(idMessage){
    return db.execute(`DELETE FROM support_message WHERE id_message=${idMessage}`);
  }
}

module.exports = new Repository;
