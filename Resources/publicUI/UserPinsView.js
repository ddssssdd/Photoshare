var UserPinsView = function(user){
	this.user = user;
	var contentView = Ti.UI.createView({
		top:0,
		left:0,
		width:320		
	});
	
	
	var viewTop = Ti.UI.createView({
		top:0,
		left:0,
		height: 50
	});
	contentView.add(viewTop);
	var imageBg = Ti.UI.createView({
		top:5,
		left:5,
		width:44,
		height:44,
		backgroundColor:settings.defaultImageColor
	});
	viewTop.add(imageBg)
	var imageUser = Ti.UI.createImageView({
		image:user.avatar?user.avatar:"http://beta.pinspire.com.hk/images/avatar-default.jpg",
		top:5,
		left:5,
		width:44,
		height:44,
		defaultImage:'images/clear.png'
	});
	viewTop.add(imageUser);
	imageUser.addEventListener("click",function(e){
		Ti.App.fireEvent("app:openUser",{id:user.id,tab:"tabFollowing"});	
	})
	
	var labelTop = Ti.UI.createLabel({
		top:10,
		left: 54,
		height: 30,
		width: 180,
		text: user.firstName+" "+user.lastName,
		font:{fontFamily:'Arial',fontSize:14,fontWeight:"bold"}
	})
	viewTop.add(labelTop);
	
	
	var btnUnFollow = Ti.UI.createButton({
		top:10,
		right:10,
		height: 28,
		width: 69,
		backgroundImage: "images/unfollow.png",
		/*color:'#878787',
		font:{fontFamily:'Helvetica Neue',fontSize:1},*/
		action:"unfollowall"
	})
	viewTop.add(btnUnFollow);
	btnUnFollow.addEventListener("click",function(e){
		
		var userService = require("services/UserService");
		userService.followAllBoard(user.id,btnUnFollow.action,function(e){
			if (e.status=="success"){
				if (e.text=="unfollowall"){
					btnUnFollow.backgroundImage = "images/follow.png";
					btnUnFollow.action="followall";	
					btnUnFollow.width = 59;
				}else{
					btnUnFollow.backgroundImage = "images/unfollow.png";
					btnUnFollow.action="unfollowall";
					btnUnFollow.width = 69;
				}
				
			}
		});
		
		
	})
	
	var listView = Ti.UI.createView({
		top:54,
		left:0,
		width:320,
		height:100		
	});
	var addPictures=function(datas){
		
		for(var i=0;i<datas.length && i<3;i++){
			var p = datas[i];
			if (!p.width){
				p.width=100;
			}
			if (!p.height){
				p.height=100;
			}
			var h2 =p.height * (100 / p.width);
			var h = (h2>100)?100:h2;
			var t= (h>=100)?0:(100-h) / 2;
			var imageBg = Ti.UI.createView({
				top:0,
				left:[5,110,215][i],
				width: 100,
				height:h
			});
			var image = Ti.UI.createImageView({
				top:0,
				left:[5,110,215][i],
				width: 100,
				height:h,
				image:p.url,
				photoObj:p,
				defaultImage:'images/clear.png'
			});
			image.addEventListener("click", function(e) {
					//Ti.App.fireEvent("app:imageClick.explore",{id:e.source.photoObj.id,list:datas});
				Ti.App.fireEvent("app:imageClick",{id:e.source.photoObj.id,list:datas,tab:"tabFollowing"});
			});
			listView.add(imageBg);
			listView.add(image);
			if (h2>listView.height){
				listView.height = h2;
			}
		}
	}
	var userService = require("services/UserService");
	userService.getPins(user.id,addPictures);
	
	contentView.add(listView);
		
	contentView.height = listView.height+50;
	return contentView;
};

module.exports = UserPinsView;
