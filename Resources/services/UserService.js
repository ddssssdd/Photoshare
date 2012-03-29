var User = require("model/User");
var saved = Ti.App.Properties.getString("User");
var user = (saved)?JSON.parse(saved):new User();


var serverUrl2 = settings.serverUrl;
exports.saveUserToLocal=function(user){
	Ti.App.Properties.setString("User",JSON.stringify(user));	
}

exports.user = user;

exports.isLogin=function(){
	var saved1 = Ti.App.Properties.getString("User");
	var user1 = (saved1)?JSON.parse(saved1):new User();
	
	return user1.login;
}

exports.login=function(userName,password){
	var url =  serverUrl2 +"login?email="+userName+"&password="+password;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){					
				user.userName = json.user.email;
				user.password = json.user.password;
				user.firstname = json.user.firstname;
				user.lastname = json.user.lastname;
				user.id = json.user.id;
				user.nickname = json.user.nickname;
				user.source = json.user;
				user.login = true;
				exports.saveUserToLocal(user);
				Ti.App.fireEvent("app:loginSuccess", {
					user : user
				});
				
				//show + 2012.3.29
				Ti.App.fireEvent('app:pinInfo',{text:json.thisOperPoint});
				
			}else{
				Ti.App.fireEvent("app:message",{text:json.memo});
			}
		
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}
exports.getProfile=function(uid,callBackFunction){
	var url =  serverUrl2 +"getUserProfile?userId="+uid;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){			
				var u = new User();		
				/*
				 "avatar":"771184.995893536483566E7.JPEG",
      "firstName":"yu",
      "lastName":"kai",
      "email":"fish_king_k@163.com",
      "board_count":6,
      "comment_count":6,
      "followed_count":1,
      "following_count":17,
      "like_count":3,
      "pin_count":3,
      "repin_count":3
				 * */
				callBackFunction.call(this,json.user);
			}
		
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}
exports.logout=function(){
	exports.user.login=false;
	exports.user = {};
	Ti.App.Properties.setString("User",JSON.stringify({}));
	Ti.App.fireEvent("app:logout");
}


exports.getBoards=function(userId,callBackFunction){
	
	//var url =serverUrl +"/forIOS/getBoardsByUserId4IOS?userId="+userId;
	var url =serverUrl2 +"getUserBoards?userId="+userId;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
				for(var i=0;i<json.list.length;i++){
					var item = json.list[i];
					datas.push(item);
				}
				if (userId=user.id){
					user.boardList=datas;
					Ti.App.Properties.setString("User",JSON.stringify(user));	
				}				
				if (callBackFunction){
					callBackFunction.call(this,datas);	
				}
					
			}
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}

exports.getPins=function(userId,offset,callBackFunction){
	
	//var url =serverUrl +"/forIOS/getPinsByUserId4IOS?userId="+userId;
	//var url =serverUrl2 +"getUserPins?userId="+userId
	var url =serverUrl2 +"getUserPins?userId="+userId+"&max=27&offset="+(offset?offset:1);
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
				for(var i=0;i<json.list.length;i++){
					var item = json.list[i];
					datas.push({id:item.id,url:item.pin,width:item.imgWidth,height:item.imgHeight});
				}
				callBackFunction.call(this,datas);	
			}
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}
exports.getBoardPins=function(bid,callBackFunction){
	
	//var url =serverUrl +"/forIOS/getPinsByUserId4IOS?userId="+userId;
	var url =serverUrl2 +"getBoardPins?boardId="+bid+"&userId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
				for(var i=0;i<json.list.length;i++){
					var item = json.list[i];
					datas.push({id:item.id,url:item.pin,width:item.imgWidth,height:item.imgHeight});
				}
				callBackFunction.call(this,datas,json.hasFollowed);	
			}
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}


exports.getLikes=function(userId,offset,callBackFunction){
	
	//var url =serverUrl +"/forIOS/getLikesByUserId4IOS?userId="+userId;
	var url =serverUrl2 +"getUserLikes?userId="+userId+"&max=27&offset="+(offset?offset:1);
	//var url =serverUrl2 +"getUserLikes?userId="+userId;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
				for(var i=0;i<json.list.length;i++){
					var item = json.list[i];
					datas.push({id:item.id,url:item.pin,width:item.imgWidth,height:item.imgHeight});
				}
				callBackFunction.call(this,datas);	
			}
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}
exports.like=function(pinId,callBackFunction){
	
	//var url =serverUrl +"/forIOS/getLikesByUserId4IOS?userId="+userId;
	var url =serverUrl2 +"favourite?pinId="+pinId+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}
exports.deletePin=function(pinId,callBackFunction){	
	
	var url =serverUrl2 +"deletePin?pinId="+pinId+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}
// http://localhost:8080/IOS/doRegisterWithoutInvite?email=1&password=2&firstname=111&lastname=asdf
exports.register=function(email,password,firstname,lastname,callBackFunction){
	
	//var url =serverUrl +"doRegisterWithoutInvite?email="+email""&password=2&firstname=111&lastname=asdf;
	var url =serverUrl2 +"doRegisterWithoutInvite?email="+email+"&password="+password+"&firstname="+firstname+"&lastname="+lastname;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){					
				user.userName = json.user.email;
				user.password = json.user.password;
				user.firstname = json.user.firstName;
				user.lastname = json.user.lastName;
				user.id = json.user.id;
				user.nickname = json.user.nickName;
				user.source = json.user;
				user.login = true;
				exports.saveUserToLocal(user);
				Ti.App.fireEvent("app:loginSuccess", {
					user : user
				});
			}
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
	
}
//http://localhost:8080/IOS/doComment?pinId=1019001&content=sososo&currentLoginUserId=701
exports.comment=function(pinId,comment,callBackFunction){
	var url =serverUrl2 +"doComment?pinId="+pinId+"&content="+comment+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}
// http://localhost:8080/IOS/createBoard?title=test111&category=10&currentLoginUserId=701
exports.createBoard=function(title,cid,callBackFunction){
	var url =serverUrl2 +"createBoard?title="+title+"&category="+cid+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);			
			callBackFunction.call(this,json);
			exports.getBoards(user.id);
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}

//http://localhost:8080/IOS/followBoard?boardId=274004&userId=169091&currentLoginUserId=701
exports.followBoard=function(boardId,userId,callBackFunction){
	var url =serverUrl2 +"followBoard?boardId="+boardId+"&userId="+userId+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}

//http://localhost:8080/IOS/followAllBoard?userid=169091&alltag=followall&currentLoginUserId=701
exports.followAllBoard=function(userId,action,callBackFunction){
	/*
	 action = followall, unfollowall
	 */
	var url =serverUrl2 +"followAllBoard?userId="+userId+"&alltag="+action+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}

//http://localhost:8080/IOS/repin?board.id=689495&title=great+spacesaver!&parent.id=555769&currentLoginUserId=702

exports.repin=function(boardId,title,pinId,callBackFunction){
	var url =serverUrl2 +"repin?board.id="+boardId+"&title="+title+"&parent.id="+pinId+"&currentLoginUserId="+user.id;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}
//createPin?board.id=701890&imgWebUrl=&source=upload&prefix=&uploadMethod=UserUpload&url=theNameOfFileUploaded
//&title=upload%20success%20but%20cannot%20see%20image&facebook=false&currentLoginUserId=701
exports.createPin=function(image,boardId,title,callBackFunction){
	var url = serverUrl2 + "createPin?board.id="+boardId;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var datas=[];
			var json = JSON.parse(this.responseText);
			callBackFunction.call(this,json);
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("POST", url);
	xhr.send({myfile:image,imgWebUrl:null,source:"upload",prefix:null,
				url:"uploadfile",facebook:false,title:title,currentLoginUserId:user.id});
}
