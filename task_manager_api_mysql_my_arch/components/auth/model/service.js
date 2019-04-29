const hash = require('bcrypt');
const jwt = require('jsonwebtoken');

class Service{
  isRightPass(rawPassOfTry,yourHashPass){
    return hash.compareSync(rawPassOfTry,yourHashPass);
  }
  createJwt(email){
    return jwt.sign({email},'nationzinewithl');
  }
}

module.exports = new Service;
