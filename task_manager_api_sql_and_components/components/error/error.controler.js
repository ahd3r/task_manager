class Error{
  error404(req,res,next){
    res.send({error:'Page Not Fount'});
  }
  // if you have error 500 it will show you in reponse and where is exactly the error
}

module.exports = new Error;
