let io;

module.exports = {
  init:(server)=>{
    io = require('socket.io')(server);
  },
  getIo:()=>{
    if(!io){
      throw new Error('Socket is not on');
    }else{
      return io
    }
  }
};
