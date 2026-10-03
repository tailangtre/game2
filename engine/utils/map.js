Array.prototype.remove = function(s) {
	for (var i = 0; i < this.length; i++) {
		if (s == this[i])
			this.splice(i, 1);
	}
}

/**   
 * Simple Map   
 *    
 *    
 * var m = new Map();   
 * m.put('key','value');   
 * ...   
 * var s = "";   
 * m.each(function(key,value,index){   
 *      s += index+":"+ key+"="+value+"/n";   
 * });   
 * alert(s);   
 *    
 * @author wahaha   
 * 
 */
function Map() {
	/** 存放键的数组(遍历用到) */
	this.keys = new Array();
	/** 存放数据 */
	this.data = new Object();

	/**   
	 * 放入一个键值对   
	 * @param {String} key   
	 * @param {Object} value   
	 */
	this.put = function(key, value) {
		if (this.data[key] == null) {
			this.keys.push(key);
		}
		this.data[key] = value;
	};

	/**   
	 * 获取某键对应的值   
	 * @param {String} key   
	 * @return {Object} value   
	 */
	this.get = function(key) {
		return this.data[key];
	};

	/**   
	 * 删除一个键值对   
	 * @param {String} key   
	 */
	this.remove = function(key) {
		this.keys.remove(key);
		this.data[key] = null;
	};

	/**   
	 * 遍历Map,执行处理函数   
	 *    
	 * @param {Function} 回调函数 function(key,value,index){..}   
	 */
	this.each = function(fn) {
		if (typeof fn != 'function') {
			return;
		}
		var len = this.keys.length;
		for (var i = 0; i < len; i++) {
			var k = this.keys[i];
			fn(k, this.data[k], i);
		}
	};

	/**   
	 * 获取键值数组(类似Java的entrySet())   
	 * @return 键值对象{key,value}的数组   
	 */
	this.entrys = function() {
		var len = this.keys.length;
		var entrys = new Array(len);
		for (var i = 0; i < len; i++) {
			entrys[i] = {
				key: this.keys[i],
				value: this.data[i]
			};
		}
		return entrys;
	};

	/**   
	 * 判断Map是否为空   
	 */
	this.isEmpty = function() {
		return this.keys.length == 0;
	};

	/**   
	 * 获取键值对数量   
	 */
	this.size = function() {
		return this.keys.length;
	};

	/**   
	 * 重写toString    
	 */
	this.toString = function() {
		var s = "{";
		for (var i = 0; i < this.keys.length; i++, s += ',') {
			var k = this.keys[i];
			s += k + "=" + this.data[k];
		}
		s += "}";
		return s;
	};
}
// 找出3
function findArryrandomWildCol(arr){
	var _len=arr.length;
	var _map=new Map();
	var randomWildColArr=[];
	for(var i=0;i<_len;i++){
		var line=arr[i];
		var _col=arr[i].col;
		var _row=arr[i].row;
		var _rowArr=_map.get(_col);
		if(!_rowArr){
			_rowArr=[];
		}
		_rowArr.push(_row);
		_map.put(_col,_rowArr);
	}
	for(var a=0;a<_map.keys.length;a++){
		var key=_map.keys[a];
		var dataArr=_map.get(key);
		if(dataArr.length==3){
			randomWildColArr.push(key);
		}
	}
	return randomWildColArr;
}

function findArrayMax(arr) {
	var max = arr[0];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] > max) {
			max = arr[i];
		}
	}
    return max
}

function findReelRowArry(reelArr){
	var rowArr=[];
	for (var i=0;i<reelArr.length;i++){
		var row=reelArr[i].row;
		rowArr.push(row);
	}
	return rowArr;
}

function findRowMax(reelArr){
	var maxRow;
	var rowArr=findReelRowArry(reelArr);
	maxRow=findArrayMax(rowArr);
	if(maxRow==2 && rowArr.length==1){
		maxRow=3;
	}
	return maxRow;
}

function replaceRandomWildArr(col,wildArr){
	var replaceArr=[];
	for(var i=0;i<wildArr.length;i++){
		var _data=wildArr[i];
		var _col=_data.col;
		var _row=_data.row;
		if(_col !=col){
			replaceArr.push(_data);
		}
	}
	return replaceArr;
}
