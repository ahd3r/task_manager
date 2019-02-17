class Service{
  pagination(page,inEachPage){
    let amount;
    let last;
    if(!/^00$/.test(page) && inEachPage!==0){
      amount=inEachPage;
      last=(page-1)*amount;
      return {amount,last}
    }else{
      amount=false;
      last=false;
      return {amount,last}
    }
  }
}

module.exports = new Service;
