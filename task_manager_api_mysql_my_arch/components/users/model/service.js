const hash = require('bcrypt');

class Service{
  pagination(page,amount){
    return (page-1)*amount
  }
  hashedPass(password){
    return hash.hashSync(password,7);
  }
}

module.exports = new Service;
