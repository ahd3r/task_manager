class Error{
  error404(req,res,next){
    res.send({error:'Page Not Fount'});
  }
}

module.exports = new Error;
