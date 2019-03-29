let io;

module.exports = {
  init:server=>{
    io=require('socket.io')(server);
    return io;
  },
  getIo:()=>{
    if(!io){
      throw new Error('IO is not defined')
    }
    return io
  }
};
