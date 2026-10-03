/**
 * Created by admin on 2016/3/14.
 */
puremvc.define({
        name: 'Slots.SystemConfigProxy',
        parent: puremvc.Proxy,
        constructor: function () {
            puremvc.Proxy.call(this);
        }
    },

    // INSTANCE MEMBERS
    {
        timer:null,
        me:this,
        t:[],
        rtt:0,
        networkState:1,
        onRegister: function() {

        },
        init:function(){
            if (!AppConstants.ACTIVE_OTFETM) {
                var self = this;
                self.timer = setInterval(function(){
                        self.testNetWork(self);
                },6*1000);
                //AppFacadeInstance.sendNotification(SlotsEvents.CHECK_LOGIN);
            }
        },

        testNetWork:function(self) {
            if (!AppConstants.ACTIVE_OTFETM) {
                self.t.push(+new Date);
                if(self.t.length>=2){
                    self.rtt = self.t[1] - self.t[0];
                    self.t =[];
                    var obj = new Object();
                    obj.rtt = self.rtt;
                    AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_STATE,obj);
                }
                else{
                    self.pingServer(self);
                }
            }
        },

        pingServer:function(self){
            // if (!AppConstants.ACTIVE_OTFETM) {
            //     var req = new Object();
            //     req.action = "/api/v1/long-ping?configId="+GlobalClass.GAME_CONFIG_ID+"&gameType="+GlobalClass.GAME_TYPE;
            //     req.method = HttpConnection.METHOD_GET;
            //     this.send2server(req,function(){
            //         GlobalClass.networkState = 1;
            //         self.testNetWork(self);
            //     });
            // }
        },

        send2server:function(obj,callback){
            var self = this;
            var header = new Object();
            header['x-auth-token'] = GlobalClass.GAME_AUTH_TOKEN;
            var req = new Object();
            req.header = header;
            req.params = obj;//JSON.stringify(obj);
            var type = obj.type;
            var startTime = new Date().getTime();
            HttpConnection.send2server(req,function(rsp){
                //self.testNetWork(self);
                self.onServerResponse(rsp,callback);
                if(type && type == "SPIN"){
                    var endTime = new Date().getTime();
                    var td = new Object();
                    td.rtt = endTime - startTime;
                    AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_STATE,td);
                }
            });
        },

        onServerResponse:function(rsp,callback){
            // console.log(rsp);
            if(rsp.httpCode!=200){
                if(rsp.httpCode==500){
                	if(this.timer){
                		 this.timer.clear();
                	}
                   // this.init();

                }
                else{
                    // console.log("network error");
                    this.processError("network error");
                }
                return;
            }
            var data = rsp.msg;
            //AppConstants.NOW = data.currTime;

            // if(data.code!=0){

            //     var message = data.message;
            //     console.log(message);
            //     return true;
            // }
            // GlobalClass.SERVER_DEBUG = data.debug;
            if(callback){
            	callback(data);
            }
        },
        processError:function(message){
            //AppFacadeInstance.sendNotification(TexasEvents.HIDE_LOADING);
            var obj = new Object();
            obj.content = message;
            AppFacadeInstance.sendNotification(SlotsEvents.SHOW_NETWORK_WIN,obj);
        }
    },

    // CLASS MEMBERS
    {
        NAME: 'SystemConfigProxy'
    }
);
