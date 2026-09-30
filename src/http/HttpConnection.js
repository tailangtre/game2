/**
 * Created by admin on 2016/3/14.
 */
var HttpConnection = {
    METHOD_POST:'POST',
    METHOD_GET:'GET',
    send2server:function(request,callback){
        var xhr = new XMLHttpRequest();
        if (xhr){
            var params = request.params;
            var method = "POST";
            var login = false;
            if(params.method){
                method = params.method;
            }
            if(params.action.indexOf("api/v2/login/platform")!=-1){
                login = true;
            }
            xhr.open(method,AppConstants.SERVER_BASE_URL+params.action);
            if(request.header){
                for(var key in request.header){
                    xhr.setRequestHeader(key,request.header[key]);
                }
            }
            xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
            delete params.action;
            delete params.method;
            xhr.send(JSON.stringify(params));
            //xhr.timeout = 2000;
            xhr.ontimeout = function(){
                var resp = new Object();
                resp.httpCode= -1;
                resp.msg = "time out";
                callback(resp);
                GlobalClass.networkState = 0;
            };
            xhr.onreadystatechange = function(){
                if(xhr.status!=200 && xhr.readyState==4){
                    var resp = new Object();
                    resp.httpCode= xhr.status;
                    resp.msg = "";
                    callback(resp);
                }
                else if(xhr.status==200 && xhr.readyState==4){
                    if(login){
                        if (GlobalClass.GAME_AUTH_TOKEN == '') {
                            var token = xhr.getResponseHeader('x-auth-token');
                            GlobalClass.GAME_AUTH_TOKEN = token;
                        }
                    }
                    var resp = new Object();
                    resp.httpCode = 200;
                    resp.msg = JSON.parse(xhr.responseText);
                    callback(resp);
                }
            };
        }
    }
};