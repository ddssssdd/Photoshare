var winCamera2=function(imageobj){
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false,
		fullscreen:false
	});
	var homeButton = Ti.UI.createButton({
		backgroundImage:settings.getImageFile('back.png'),
		width:62,
		height:28
	});
	self.leftNavButton = homeButton;
	homeButton.addEventListener("click",function(e){
		self.close();
	})
	
	var rightButton = Ti.UI.createButton({		
		width: 62, //old: 68
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
	
	var contentHeight=480-44-48-20; //remove statusbar, navbar, tabbar height
	var h = (imageobj.height?imageobj.height:100) * 320 / (imageobj.width?imageobj.width:100); //get proportionate height
	var t = (h >= contentHeight) ? 0 : (contentHeight - h) / 2;
		 
	var imageView = Ti.UI.createImageView({
		image:imageobj,
		height:h,
		width:320,
		top:t
	});
	self.add(imageView);
	return self;
};
module.exports = winCamera2;
