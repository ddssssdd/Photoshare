var winHot=function(){
	var self = Titanium.UI.createWindow({
		backgroundColor:'#336699',
		barImage:"images/top_logo.png"
	});
	
	var registerButton = Ti.UI.createButton({
		title : 'register',
		top : 10,
		left : 10,
		width : 100,
		style : Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	registerButton.addEventListener("click", function(e) {
		//userService.login();
		Ti.App.fireEvent("app:register");
	});
	var loginButton = Ti.UI.createButton({
		title : 'login',
		top : 10,
		left : 160,
		width : 100,
		style : Ti.UI.iPhone.SystemButtonStyle.BORDERED
	});
	loginButton.addEventListener("click", function(e) {
		//userService.login();
		Ti.App.fireEvent("app:login");
		var LoginView = require("ui/LoginView");
		var loginView = new LoginView();
		loginView.open();
	});
	var flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	
	var toolbar = Titanium.UI.createToolbar({
		items:[registerButton, flexSpace, loginButton],
		top:410,
		borderTop:false,
		borderBottom:true
	});
	self.add(toolbar);


	
	return self;
}
module.exports = winHot;
