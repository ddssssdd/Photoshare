var winProfile=function(){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		navBarHidden:false,
		tabBarHidden:true,
		fullscreen:false
	});
	Ti.App.fireEvent("app:tabgroup",{visible:true});
	var buttonLeft = Ti.UI.createButton({
		backgroundImage:'images/account.png',
		width: 74,
		height: 28
	});
	self.leftNavButton = buttonLeft;
	buttonLeft.addEventListener("click",function(e){
		
		var logoutOption = Ti.UI.createOptionDialog({
			options : ['Logout', 'Cancel'],
			cancel : 1,
			destructive:1
		});
		logoutOption.show();
		logoutOption.addEventListener("click", function(e) {
			if (e.index==0){
				//logout;
				var userService = require("/services/UserService");
				userService.logout();
			}
		});

	});
	/*
	var buttonRight = Ti.UI.createButton({
		backgroundImage:'images/edit.png',
		width: 59,
		height: 28
	});
	self.rightNavButton = buttonRight;
	buttonRight.addEventListener("click",function(e){
		
		Ti.App.fireEvent("app:openWindow",{tab:"winProfile",url:"editProfile"});
	});
	*/
	var hasDone = false;
	var createProfileView = function(u){
		if ((self.children) && (self.children.length>0)){
			self.remove(self.children[0]);
		}
		var UserProfileView = require("publicUI/UserProfileView");
		var userView = new UserProfileView(u,"tabProfile");
		self.add(userView);
		hasDone = true;
	}
		
	
	self.addEventListener("focus",function(e){
		if (!hasDone){
			var userService = require("services/UserService");
			userService.getProfile(userService.user.id,createProfileView);	
		}
		
		Ti.App.fireEvent("app:tabgroup",{visible:true});
	});

	return self;
};
module.exports = winProfile;
