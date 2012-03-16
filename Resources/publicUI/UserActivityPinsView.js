var UserActivityPinsView = function(activity){
	
	this.activity = activity;
	var self = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:'auto'
	});
	var viewTop = Ti.UI.createView({
		top:0,
		left:0,
		height: 50,
		width:320
	});
	self.add(viewTop);
	var imageUserBg = Ti.UI.createView({
		top:5,
		left:5,
		width:40,
		height:40,
		backgroundColor:settings.defaultImageColor
	});
	var avatar = activity.board.smallAvatar;
	var imageUser = Ti.UI.createImageView({
		image:avatar?avatar:"http://beta.pinspire.com.hk/images/avatar-default.jpg",
		top:5,
		left:5,
		width:40,
		height:40,
		defaultImage:'images/clear.png'
	});
	viewTop.add(imageUserBg);
	viewTop.add(imageUser);
	imageUser.addEventListener("click",function(e){
		Ti.App.fireEvent("app:openUser",{id:activity.board.userId,tab:"tabActivity"});
	});
	
	var labelTop = Ti.UI.createLabel({
		top:0,
		left: 55,
		height: 30,
		text: activity.board.firstName+" "+activity.board.lastName,
		font:{fontFamily:'Arial',fontSize:16}
	})
	viewTop.add(labelTop);
	
	/*
	var labelboard = Ti.UI.createLabel({
		top:0,
		left:200,
		height:30,
		width:110,
		textAlign:"right",
		text: activity.board.title,
		font:{fontFamily:'Arial',fontSize:16,fontWeight:"bold"}
	})
	viewTop.add(labelboard);
	labelboard.addEventListener("click",function(e){
		var user={avatar:activity.board.samllAvatar,firstName:activity.board.firstName,lastName:activity.board.lastName,id:activity.board.userId};
		Ti.App.fireEvent("app:openInTab",{id:activity.board.id,userInfo:user,tab:"tabActivity"});
			
	});
	*/
	
	var labelMemo = Ti.UI.createLabel({
		top: 20,
		left: 55,
		height: 30,
		text: activity.memo,
		color:'#888',
		font:{fontFamily:'Arial',fontSize:12,fontWeight:"bold"}
	})
	viewTop.add(labelMemo);
	/*
	var listView = Ti.UI.createView({
		top:50,
		left:0,
		width:320,
		height:105		
	});
	self.add(listView)
	var addPictures=function(datas){
		for(var i=0;i<datas.length && i<3;i++){
			var p = datas[i];
			if (!p.imgWidth){
				p.imgWidth=100;
			}
			if (!p.imgHeight){
				p.imgHeight=100;
			}
			var h2 =p.imgHeight * (100 / p.imgWidth);
			var h = (h2>100)?100:h2;
			var t= (h>=100)?0:(100-h) / 2;
			var imageBg = Ti.UI.createView({
				top:t,
				left:[5,110,215][i],
				width: 100,
				height:h,
				backgroundColor:settings.defaultImageColor
			});
			var image = Ti.UI.createImageView({
				top:t,
				left:[5,110,215][i],
				width: 100,
				height:h,
				image:p.imgUrl,
				photoObj:{id:p.id,pin:p.imgUrl,width:p.imgWidth,height:p.imgHeight},
				defaultImage:'images/clear.png'
			});
			image.addEventListener("click", function(e) {				
				Ti.App.fireEvent("app:imageClick",{id:e.source.photoObj.id,list:datas,tab:"tabActivity"});
			});
			listView.add(imageBg);
			listView.add(image);
		}
	}
	addPictures(activity.pinsList)
	*/
	return self;
}
module.exports = UserActivityPinsView;
