/**
 * Created by zhangrunfu on 17/9/30.
 */
(function () {
    function GRandom() {
        this.chance = new Chance(new Date().getMilliseconds());
    }

    /**
     * generate a random value ,the value scope is from 0 to maxValue-1
     * @param maxValue
     */
    GRandom.prototype.nextInt = function (maxValue) {
        if (!maxValue || maxValue <=0){
            throw "I cann't generate a random value <=0";
        }
        var rd = this.chance.integer({min:0,max:maxValue-1});
        return rd;
    };


    if (typeof window === "object" && typeof window.document === "object") {
        window.GRandom = GRandom;
    };
})();

myNumeral = function(num){

    num = Math.floor(num * 10000) / 10000;
    return numeral(num);
}

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                
       "d+" : this.getDate(),                    
       "h+" : this.getHours(),                   
       "m+" : this.getMinutes(),                
       "s+" : this.getSeconds(),                
       "q+" : Math.floor((this.getMonth()+3)/3),
       "S"  : this.getMilliseconds()            
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}


var myLocalStorage = {

    setItem:function(key,value){
        try {
            localStorage.setItem(key,value);
        } catch (error) {
            console.log(error)
        }
    },

    getItem:function(key){
        var res = "0";
        try {
            res = localStorage.getItem(key);
        } catch (error) {
            console.log(error)
        }

        return res;
    }

}