class Service{
  pagination(page,amount){
    return {last:(page-1)*amount,amount}
  }
}

module.exports = new Service;
