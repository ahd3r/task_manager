class Err{
  Error404(req,res,next){
    res.status(404).send({err:'Not found 404'});
    // throw new Error('Not found 404');
  }
}

module.exports = new Err;
