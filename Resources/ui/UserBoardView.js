var UserBoardView = function(user,tabName,bid){
	this.user = user;
	this.tabName = tabName;
	this.bid = bid;
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		barImage:"images/top_logo_bg.png",
		navBarHidden:false,
		tabBarHidden:true,
		fullscreen:false
	});
	
	var BackNavButton = require("publicUI/BackNavButton");
	new BackNavButton(self);
		
	var view = Ti.UI.createView({
		top : 0,
		width : 320,
		height : 50,
		backgroundColor:'#eee'
	});
	var imageBg= Ti.UI.createView({
		top:5,
		left:5,
		width:45,
		height:45,
		backgroundColor:settings.defaultImageColor
	});
	var image = Ti.UI.createImageView({
		image : user.avatar?user.avatar:"http://beta.pinspire.com.hk/images/avatar-default.jpg",
		width : 45,
		height : 45,
		top : 5,
		left : 5,
		defaultImage:"images/clear.png"
	});
	view.add(imageBg);
	view.add(image);
	var labelUser = Ti.UI.createLabel({
		text : user.firstName+" "+user.lastName,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 16,
			fontWeight:"bold"
		},
		top: 15,
		left : 60,
		height:'auto'
	})
	view.add(labelUser);
	var borderLine= Ti.UI.createView({
		top:51,
		left:0,
		width:320,
		height:1,
		backgroundColor:'#ccc'
	});
	
	/*
	var lblInfo = Ti.UI.createLabel({
		top:30,
		left:60,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 12,
			fontWeight:'bold'
		},
		text: user.pin_count+" pins "+user.following_count+" followings"
	})
	view.add(lblInfo);
	*/
	var scrollView = Ti.UI.createScrollView({
		top:0,
		left:0,
		contentHeight:'auto',
		width:320
	});
	self.add(scrollView);
	scrollView.add(view);
	scrollView.add(borderLine);
	var bottomView = Ti.UI.createView({
			top : 50,
			left : 0,
			width : 320,
			height: 1000
		})
	scrollView.add(bottomView);
	
	
	var ScrollViewFill = require("publicUI/ScrollPictureView");	
	var loadPins=function(datas,hasFollowed){
		new ScrollViewFill(datas,bottomView,tabName);
		
		var rightButton = Ti.UI.createButton({
			height : 28,
			width : hasFollowed?69:62,
			backgroundImage : hasFollowed?"images/unfollow.png":"images/follow.png",
			isFollowed:hasFollowed
		});
		self.rightNavButton = rightButton;
		rightButton.addEventListener("click",function(e){
			var userService= require("services/UserService");
			userService.followBoard(bid,user.id,function(e){
				rightButton.backgroundImage = "images/"+e.text+".png";
				rightButton.width = (e.text=="follow")?62:69;
				//Ti.App.fireEvent("app:message",{text:e.memo});
				self.close();
			})
		})

	}
	var userService= require("services/UserService");
	userService.getBoardPins(bid, loadPins);
	return self;
}
module.exports = UserBoardView;
