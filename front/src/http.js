class EasyHTTP{
  async get(url, token){
    if(token){
      const request = await fetch(url, { headers:{'Content-type':'application/json'}, body:{authorizationToken:token} });
      const  response= await request.json();
      return response;
    }else{
      const request = await fetch(url);
      const  response= await request.json();
      return response;
    }
  }
  async post(url,data){
    const request=await fetch(url, {method:'POST', headers:{'Content-type':'application/json'}, body:data});
    const response = await request.json();
    return response;
  }
  async put(url,data){
    const request=await fetch(url, {method:'PUT', headers:{'Content-type':'application/json'}, body:data});
    const response = await request.json();
    return response;
  }
  async patch(url){
    const request=await fetch(url, {method:'PATCH'});
    const response = await request.json();
    return response;
  }
  async delete(url){
    const request = await fetch(url, {method:'DELETE'});
    const  response= await request.json();
    return response;
  }
}

export const http = new EasyHTTP;
