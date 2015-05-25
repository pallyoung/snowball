/**
 *用于构建web app 或者类app项目
 *基于事件驱动
 */

/**
* VERSION = "0.0.2" 更新日志
*1、去除了Application对象
*2、view的load和unload方法
*3、删除loadJS方法
*4、大量方法名重写
*5、
*/
(function(window, document, undefined) {
	/**
	 *LIST
	 *@type         	@variable                               @description
	 *String			VERSION                                 版本号
	 *Object 			ERROR                                   自定义错误信息
	 *RegExp			URL_STRING_REG                          去除url中的http://|\.|\/符号
	 */
	/*系统变量*/
	var VERSION = "0.0.2";
	var ERROR = {
		"unimplement": "该方法未被实现"
	}


	var
		slice 						= [].slice,
		push 						= [].push,
		toString 					= Object.prototype.toString,

		URL_STRING_REG 				= /(?:http:\/\/|\.|\/)/g,
		hasOwnProperty 				= Object.prototype.hasOwnProperty,

		views						=[],
		models						=[],
		styleSheets					={},
		viewText 					={},
		viewTextSize				=10,
		onwatch						=[];

	/*系统变量*/
	/**
 	* @type function
 	* @name noop
 	*
 	* @description
 	* A function that performs no operations. 
    */
    var noop = function() {}
    var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};
    var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};
	var isUndefined = function(value) {
		return typeof value === 'undefined';
	}
	var isDefined = function(value) {
		return typeof value !== 'undefined';
	}

	var isObject = function(value) {
		return value !== null && typeof value === 'object';
	}
	var isString = function(value) {
		return typeof value === 'string';
	}
	var isNumber = function(value) {
		return typeof value === 'number';
	}
	var isDate = function(value) {
		return toString.call(value) === '[object Date]';
	}
	var isFunction = function(value) {
		return typeof value === 'function';
	}
	var isArray = Array.isArray;
	var isRegExp = function(value) {
		return toString.call(value) === '[object RegExp]';
	}
	var isWindow = function(obj) {
		return obj && obj.window === obj;
	}

	var type=function(obj){
		return toString.call(obj).slice(8, -1);
	}
	var isFile = function(obj) {
		return toString.call(obj) === '[object File]';
	}


	var isBlob = function(obj) {
		return toString.call(obj) === '[object Blob]';
	}


	var isBoolean = function(value) {
		return typeof value === 'boolean';
	}


	var trim = function(value) {
		return isString(value) ? value.trim() : value;
	};
	var isElement = function(node) {
		return !!(node &&
			(node.nodeName // we are a direct element
				|| (node.prop && node.attr && node.find))); // we have an on and find method part of jQuery API
	};
	/**
	*@description
	*返回当前所有的script标签
	*/
	var scripts = function() {
		return document.getElementsByTagName('script');
	};
	/**
	*@description
	*返回当前所有的link标签
	*/
	var links = function() {
		return document.getElementsByTagName('links');
	};
	var nodeName= function(element) {
		return lowercase(element.nodeName || element[0].nodeName);
	};


	var absPath = function(path) {
		var a = document.createElement("a");
		a.href = path;
		return a.href;
	};
	var encodeURL = function(url) {
		return encodeURI(url = url || "").replace(URL_STRING_REG, "");
	};
	var clone = function(source) {
		var destination;
		var business={
			array:function(source){
				 var result,destination=[];
				for( var i = 0; i < source.length; i++){
					result=clone(source[i]);
					destination.push(result);
				}
			},
			date:function(source){
				return new Date(source.getTime());
			},
			regexp:function(source){
				var destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
				destination.lastIndex = source.lastIndex;
				return destination;
			},
			object:function(source){
				 var destination= Object.create(Object.getPrototypeOf(source));
				for( var o in source){
					result=clone(source[i]);
					destination[o]=result;
				}
			},
			other:function(source){
				return source;
			}
		}
		if (source) {
			destination=(business[lowercase(type(source))]||business["other"])(source);
		}
		return destination;
	}
	var equals = function(o1, o2) {
		if (o1 === o2) return true;
		if (o1 === null || o2 === null) return false;
		if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
		var t1 = typeof o1,
			t2 = typeof o2,
			length, key, keySet;
		if (t1 == t2) {
			if (t1 == 'object') {
				if (isArray(o1)) {
					if (!isArray(o2)) return false;
					if ((length = o1.length) == o2.length) {
						for (key = 0; key < length; key++) {
							if (!equals(o1[key], o2[key])) return false;
						}
						return true;
					}
				} else if (isDate(o1)) {
					if (!isDate(o2)) return false;
					return equals(o1.getTime(), o2.getTime());
				} else if (isRegExp(o1) && isRegExp(o2)) {
					return o1.toString() == o2.toString();
				} else {
					keySet = {};
					for (key in o1) {
						if (!equals(o1[key], o2[key])) return false;
					}
					return true;
				}
			}
		}
		return false;
	}
	var readText = function(url, success, error) {
		var iframe = document.createElement("iframe"),
			success = success || noop,
			error = error || noop;
		iframe.style.display = "none";
		iframe.onload = function() {
			success(iframe);
			document.body.removeChild(iframe);
			iframe.onload = null;
			iframe.onerror = null;
		};
		iframe.onerror = function() {
			iframe.onload = null;
			iframe.onerror = null;
			error("加载失败");
			document.body.removeChild(iframe);
		};
		iframe.src = url;
		document.body.appendChild(iframe);
	}
	var getElementById = function(id, domstring) {
		var div 		= document.createElement("div"),
			wrapper;
		div.innerHTML = domstring;
		document.body.appendChild(div);
		wrapper = activity.getElementById(id);
		document.body.removeChild(div);
		return wrapper;

	}
	var loadStylesheet = function(url, success, error) {
		var stylesheet,
			success = success || noop,
			error = error || noop;
		url=(url&&absPath(url))||"";
		if (styleSheets[encodeURL(url)]===true) {
			success();
			return;
		}
		stylesheet = document.createElement("link");
		stylesheet.rel = "stylesheet";
		stylesheet.href = url;
		stylesheet.type = "text/css";
		stylesheet.onerror= function() {
			stylesheet.onerror = null;
			stylesheet.onload = null;
			error();
		}
		stylesheet.onload = function() {
			stylesheet.onerr = null;
			stylesheet.onload = null;
			success();
		}
		document.head.appendChild(stylesheet);

	};
	var emitModeChange=function(){
		for(var i=onwatch.length-1;i>=0;i--){
			var model=onwatch[i];
			if(!equals(model.record,model._record)){
				model.emit(change,model);
			}
		}
	}
	var immediately=function(func){
		setTimeout(func,0);
	}
	//
	var digest=function(model){
		if(!model.onwatching){
			model.onwatching=true;
			onwatch.push(model);
		}
		immediately(emitModeChange);
	}
		//自定义事件
	var EventEmitter = function() {
		this.events = {};
	}
	EventEmitter.prototype = {
			on: function(event, callback) {
				this.events[event] = this.events[event] || [];
				this.events[event].push(callback);
			},
			emit: function(event, _) {
				var events = this.events[event],
					args = slice.call(arguments, 1),
					i, m;

				if (!events) {
					return;
				}
				for (i = 0, m = events.length; i < m; i++) {
					events[i].apply(null, args);
				}
			}

		}
		//视图 需要添加updete事件
	var View = function(config) {
		EventEmitter.call(this);
		this.wrapper = null;
		this.status = 0;
		this.config = config || {
			url: "",
			id: "",
			content: "",
			css: [],
			success: noop,
			error: noop,
		};
	};
	View.prototype = new EventEmitter();
	View.prototype.changed = function(target) {
		this.emit("change", target);
	}
	View.prototype.load = function() {
		var config = this.config,
			css=config.css,
			success = config.success || noop,
			error = config.error || noop
			path,
			self=this;
			config.success = function(iframe) {
				var content=iframe.contentWindow.document.body.innerHTML;
				var wrapper = getElementById(this.id, content);
				var keys=Object.keys(viewText);
				//超过最大存储数 那么删除
				if(keys.length===viewTextSize){
					delete viewText[keys[0]];
				}
				//存储最新的
				viewText[encodeURL(iframe.src)]=content;

				self.wrapper = wrapper;
				document.body.appendChild(self.wrapper);
				views.push(self);
				success();
				self.init();
				this.emit("load", self)
				this.status = 1;
			}
			for (var i = css.length - 1; i >= 0; i--) {
				loadStylesheet(css[i]);
			}
			path= absPath(config.url);
			if (viewText[encodeURL(url)]) {
				content = viewText[encodeURL(url)].content;
				config.success(content);
				return;
			}else{
				readText(path, config.success, config.error);
			}
			
	};
	View.prototype.unload = function() {
		this.status = 0;
		this.finalize();
		this.emit("unload", this);
		document.body.removeChild(this.wrapper);
	};
	View.prototype.init = function() {};
	//清理
	View.prototype.finalize = function() {};

	//模型 需要添加update事件
	var Model = function(record) {
		EventEmitter.call(this);
		this.record = clone(record);
		this._record=clone(record);
		this._onwatching=false;

	}

	Model.prototype = new EventEmitter();
	//由controller调用 负责调用模型更新方法并触发update事件
	Model.prototype.set = function(record) {
		//触发change事件并传入相应的data
		for (var o in record) {
			if (record.hasOwnProperty(record[o])) {
				this.record[o] = clone(record[o]);
			}
		}
		digest(this);
		//this.emit("change", clone(this.record));

	};
	Model.prototype.get = function() {
		return clone(this.record);

	};
	/**
	*@description 视图的工厂方法
	*@param {object}
	*@return {View}
	*/	
	var createView=function(config){
		return (views.push(new View(config))&&views[views.length-1]);
	}
	/**
	*@description 模型的工厂方法
	*@param {object}
	*@return {Model}
	*/	
	var createModel=function(value){
		return (models.push(new Model(value))&&models[models.length-1]);
	}
	/**
	*@description change事件监听函数
	*@param null
	*@return null
	*/	
	var changeObserver = function(e) {
		var _target = e.target;
		for (var i = views.length - 1; i >= 0; i--) {
			if (views[i].wrapper.contains(_target)) {
				views[i].changed(_target);
				return;
			}
		}

	}
	/**
	*@description 绑定dom监听事件
	*@param null
	*@return null
	*/	
	var bindObservers=function(){
		document.body.addEventListener("change",changeObserver, false);
	}
	/**
	*@description 获取所有已经添加的stylesheet
	*@param null
	*@return null
	*/
	var getDocumentStylesheets=function(){
		var _links=links();
		for(var i=_links.length-1;i>=0;i--){
			var _linkhref=_links[i].href;
			if(isDefined(_linkhref)){
				styleSheets[encodeURL(absPath(_linkhref))]=true;
			}
		}
	}
	/**
	*@description 入口函数
	*@param null
	*@return null
	*/
	var main=function(){
		getDocumentStylesheets();
		bindObservers();
	}
	var sn=window.sn={
		createView:createView,
		createModel:createModel
	};

	main();
	
})(window, document)