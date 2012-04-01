var BottomLoginBar = function(){
	var self = Titanium.UI.createView({
		bottom:0,
		left:0,
		width:320,
		height:47,
		backgroundImage:'images/bottom_bg.png',
		zIndex:11		
	});
	
	Ti.App.addEventListener("app:reload", function() {
		setTimeout(function(){
			registerButton.backgroundImage = 'images/'+settings.countryCode+'/signup.png';
			loginButton.backgroundImage ='images/'+settings.countryCode+'/login.png';	
		},1000);
		
	});


	var registerButton = Ti.UI.createButton({		
		top : 8,
		left : 10,
		width : 115,
		height : 31,
		style : Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		backgroundImage : 'images/'+settings.countryCode+'/signup.png'
	});
	registerButton.addEventListener("click", function(e) {
		
		var winRegister = require("ui/winRegister");
		var register = new winRegister(e);
		register.open();
	});
	self.add(registerButton);
	var loginButton = Ti.UI.createButton({
		
		top : 8,
		right : 10,
		width : 70,
		height : 31,
		style : Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		backgroundImage : 'images/'+settings.countryCode+'/login.png'

	});
	loginButton.addEventListener("click", function(e) {
		/*
		var LoginView = require("ui/LoginView");
		var loginView = new LoginView();
		*/
		var winLogin= require("ui/winLogin");
		var loginView = new winLogin();
		loginView.open();
	});
	self.add(loginButton);
	/*
	Titanium.App.addEventListener("app:tabgroup",function(e){
		if (e.visible){
			
			self.visible = true;
			return;
			self.bottom = -50;
			self.animate({bottom:0,duration:500},function(){
				self.bottom = 0;
			});
			
			
		}else{
			self.visible = false;
			return;
			self.bottom = 0;
			self.animate({bottom:-50,duration:500},function(){
				self.bottom = -50;				
			});			
		}
	});
	*/
	return self;
}


module.exports = BottomLoginBar;
