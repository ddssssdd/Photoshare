var winCamera2=function(imageobj){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false
	});
	var homeButton = Ti.UI.createButton({
		backgroundImage:'images/back.png',
		width:67,
		height:28
	});
	self.leftNavButton = homeButton;
	homeButton.addEventListener("click",function(e){
		self.close();
	})
	
	var rightButton = Ti.UI.createButton({		
		width: 69,
		height:28,
		backgroundImage:'images/pinit.png'
	});
	self.rightNavButton = rightButton;
	rightButton.addEventListener("click",function(e){
		var winRepin= require("ui/winRepin");
		var win = new winRepin();
		self.tab.open(win);
	});
	
	Ti.App.addEventListener("app:select.board",function(e){		
		var userService= require("services/UserService");
		userService.createPin(imageView.image,e.boardId,e.description,function(e){
			Ti.App.fireEvent("app:message",{text:L('create_pin_success')});			
			self.close();				
		});	
	});
	var imageView = Ti.UI.createImageView({
		image:imageobj
	});
	self.add(imageView);
	return self;
};
module.exports = winCamera2;
