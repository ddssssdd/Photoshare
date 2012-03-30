var serverUrl2 = settings.serverUrl;
var UserService = require("services/UserService");
var userid = UserService.user().id;

exports.getList=function(callBackFunction){
	var Category = require("model/Category");
	var UserService = require("services/UserService");
	var user = UserService.user();
	var url = serverUrl2 + "categoryList?currentLoginUserId="+user.id;
	if (UserService.isLogin()) {
		url += '&countryId='+user.source.country.id;
	}
	else if (Ti.App.Properties.getInt("countryId")) {
		url+='&countryId='+Ti.App.Properties.getInt("countryId");
	}
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
			
				var datas = [];

				for(var i = 0; i < json.list.length; i++) {
					var tag = json.list[i];
					var category = new Category(tag.id, tag.code, tag.title, tag);
					datas.push(category);
				}
				var user = 	UserService.user();
				user.categoryList = datas;
				Ti.App.Properties.setString("User",JSON.stringify(user));
				callBackFunction.call(this, datas);

	
			}
			
		},
		onerror : function(e) {
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.open("GET", url);
	xhr.send();
};


exports.getCategory=function(cid,offset,callBackFunction){
	//var url = serverUrl + "/forIOS/getPinsByCategory4IOS?categoryId=" +cid+  "&max=27&offset="+offset;
	var UserService = require("services/UserService");
	var user = UserService.user();
	var url = serverUrl2;
	if (cid==0){
		url = url + "getHotPins?max=27&offset="+offset+"&currentLoginUserId="+(user.id?user.id:0);
	}else{
		url = url + "getPinsByCategoryId?categoryId=" +cid+  "&max=27&offset="+offset+"&currentLoginUserId="+user.id;
	}
	
	if (UserService.isLogin()){
		url += '&countryId='+user.source.country.id;
	}else if (Ti.App.Properties.getInt('countryId')) {
		url += '&countryId='+Ti.App.Properties.getInt('countryId');
	}
	
	
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var Photo = require("model/Photo");
			var datas = [];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
			
				for(var i = 0; i < json.list.length; i++) {
					var item = json.list[i];
					var photo = new Photo(item.id, item.pin, item.imgWidth, item.imgHeight);
					datas.push(photo);
				}
				callBackFunction.call(this, datas,true);	
			}else{
				callBackFunction.call(this, [],false);
			}
			
		},
		onerror : function(e) {
			callBackFunction.call(this, [],false);
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();


};

//http://beta.pinspire.com/ios/query?key=123
exports.searchByKey=function(key,offset,callBackFunction){
	//var url = serverUrl + "/forIOS/getPinsByCategory4IOS?categoryId=" +cid+  "&max=27&offset="+offset;
	var UserService = require("services/UserService");
	var user = UserService.user();
	var url =  serverUrl2 + "query?key=" +key+  "&max=27&offset="+offset+"&currentLoginUserId="+user.id;
	
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var Photo = require("model/Photo");
			var datas = [];
			var json = JSON.parse(this.responseText);
			if (json.status=="success"){
			
				for(var i = 0; i < json.list.length; i++) {
					var item = json.list[i];
					var photo = new Photo(item.id, item.pin, item.imgWidth, item.imgHeight);
					datas.push(photo);
				}
				callBackFunction.call(this, datas,true);	
			}else{
				callBackFunction.call(this, [],false);
			}
			
		},
		onerror : function(e) {
			callBackFunction.call(this, [],false);
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();


};


exports.getFollowingLatest=function(offset,callBackFunciton){
	var UserService = require("services/UserService");
	var user = UserService.user();
	
	//var url = serverUrl +"/forIOS/getFollowings4IOS?userId="+userid+"&max=3&offset=1";
	var url = serverUrl2 +"getFollowingLatest?userId="+user.id+"&max=10&offset="+offset;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {		
			//Ti.API.log(this.responseText);
				
			var datas = [];
			var items=JSON.parse(this.responseText);
			if (items.status=="success"){
			
				var Following = require("model/Following");
				var Photo = require("model/Photo");
				for(var i = 0; i < items.list.length; i++) {
					var item = items.list[i];
					var p = new Photo(item.id, item.pin, item.imgWidth, item.imgHeight, item.boardId, item.boardName, item.pinTitle, 
						item.fromUrl, item.dateCreated, item.repinCount,item.likeCount,item.commentCount,item.commentsList);
					var following = new Following(item.avatar, item.firstName, item.lastName, p,item.userId,item.boardId,item);
					datas.push(following);
				}
				//callBackFunciton(datas);
				callBackFunciton.call(this, datas,true);

	
			}else{
				callBackFunciton.call(this,[],false);
			}
			
		},
		onerror : function(e) {
			callBackFunciton.call(this,[],false);
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}
exports.getFollowings=function(offset,callBackFunciton){
	var UserService = require("services/UserService");
	var user = UserService.user();
	
	//var url = serverUrl +"/forIOS/getFollowings4IOS?userId="+userid+"&max=3&offset=1";
	var url = serverUrl2 +"getFollowings?userId="+user.id+"&max=20&offset="+offset;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {		
			//Ti.API.log(this.responseText);
				
			var items=JSON.parse(this.responseText);
			if (items.status=="success"){
				callBackFunciton.call(this, items.list,true);	
			}else{
				callBackFunciton.call(this, [],false);
			}
			
		},
		onerror : function(e) {
			callBackFunciton.call(this, [],false);
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}


exports.getActivities=function(callBackFunciton){
	var UserService = require("services/UserService");
	var user = UserService.user();
	//var url = serverUrl +"/forIOS/getActivity4IOS?userId="+user.id;
	var url = serverUrl2 +"getActivities?userId="+user.id
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {		
			//Ti.API.log(this.responseText);
				
			var datas = [];			
			var items=JSON.parse(this.responseText);
			if (items.status=="success"){
		
				var Activity = require("model/Activity");

				for(var i = 0; i < items.list.length; i++) {
					var item = items.list[i];
					var a = new Activity(item.avater, item.firstName, item.lastName, item.operate, item.target,item.userId);
					datas.push(a);
				}
				//callBackFunciton(datas);
				callBackFunciton.call(this, datas);

	
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
exports.getActivityList=function(callBackFunciton){
	var UserService = require("services/UserService");
	var user = UserService.user();
	
	var url = serverUrl2 +"getActivityList?userId="+user.id
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {		
			
				
			var datas = [];			
			var items=JSON.parse(this.responseText);
			//callBackFunciton.call(this,items);
			
			if (items.status=="success"){
				callBackFunciton.call(this, items.list);
				/*
				var Activity = require("model/Activity");

				for(var i = 0; i < items.list.length; i++) {
					var item = items.list[i];
					var a = new Activity(item.avater, item.firstName, item.lastName, item.operate, item.target,item.userId,item);
					datas.push(a);
				}
				*/

	
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


exports.getActivityList2=function(callBackFunciton){
	var UserService = require("services/UserService");
	var user = UserService.user();
	
	var url = serverUrl2 +"getActivityList2?userId="+user.id
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {		
			
				
			var datas = [];			
			var items=JSON.parse(this.responseText);
			//callBackFunciton.call(this,items);
			
			if (items.status=="success"){
				callBackFunciton.call(this, items.list);
				/*
				var Activity = require("model/Activity");

				for(var i = 0; i < items.list.length; i++) {
					var item = items.list[i];
					var a = new Activity(item.avater, item.firstName, item.lastName, item.operate, item.target,item.userId,item);
					datas.push(a);
				}
				*/

	
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



exports.getPin=function(pinId,callBackFunciton){
	var UserService = require("services/UserService");
	var user = UserService.user();
	if (user.id){
		var url = serverUrl2 +"getPin?pinId="+pinId+"&userId="+user.id;	
	}else{
		var url = serverUrl2 +"getPin?pinId="+pinId;
	}
	
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var items=JSON.parse(this.responseText);
			if (items.status=="success"){
				var item = items.pin;
				var Following = require("model/Following");
				var Photo = require("model/Photo");

				var p = new Photo(pinId, item.pin, item.imgWidth, item.imgHeight, item.boardId, item.boardName, item.pinTitle, item.fromUrl, item.dateCreated, item.repinCount, item.likeCount, item.commentCount, items.comments,items.hasLiked);
				var following = new Following(item.avater, item.firstName, item.lastName, p,item.userId,item.boardId, item);

				callBackFunciton.call(this, following,true);
				return;
			}
			callBackFunciton.call(this,[],false);
			
		},
		onerror : function(e) {
			callBackFunciton.call(this,[],false);
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}
exports.getComments=function(pinId,callBackFunciton){
	//var url = serverUrl +"/forIOS/getCommentsByPinId4IOS?pinId="+pinId;
	var url = serverUrl2 +"getComments?pinId="+pinId;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			
			var items=JSON.parse(this.responseText);
			if (items.status=="success"){
				callBackFunciton.call(this,items.list);					
			}else{
				callBackFunciton.call(this,[],false);
			}
			
		},
		onerror : function(e) {
			callBackFunciton.call(this,[],false);
			Ti.App.fireEvent("app:message",{text:settings.noneInternet});
		}
	});
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
}

exports.getCountryList=function(callBackFunction){
	var url=serverUrl2+'getCountryList';
	var xhr=Ti.Network.createHTTPClient({
		onload:function(){
			var item=JSON.parse(this.responseText);
			if (item.status=='success') {
				callBackFunction.call(this,item.list);
			}
		},
		onerror:function(e){
			Ti.App.fireEvent('app:message',{text:settings.noneInternet});
		}

	}); //end xhr
	
	xhr.timeout = settings.timeOut;
	xhr.open("GET", url);
	xhr.send();
};
