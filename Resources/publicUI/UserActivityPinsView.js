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
		top:10,
		left:10,
		width:35,
		height:35,
		backgroundColor:settings.defaultImageColor
	});
	var avatar = activity.board.smallAvatar;
	var imageUser = Ti.UI.createImageView({
		image:avatar,
		top:10,
		left:10,
		width:35,
		height:35,
		defaultImage:'images/clear.png'
	});
	viewTop.add(imageUserBg);
	viewTop.add(imageUser);
	imageUser.addEventListener("click",function(e){
		Ti.App.fireEvent("app:openUser",{id:activity.board.userId,tab:"tabActivity"});
	});
	
	var labelTop = Ti.UI.createLabel({
		top:5,
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
		top: 28,
		left: 55,
		height: 20,
		width:255,
		text: activity.memo,
		color:'#888',
		font:{fontFamily:'Arial',fontSize:12,fontWeight:"bold"}
	})
	viewTop.add(labelMemo);
	
	var listView = Ti.UI.createView({
		top:55,
		left:0,
		width:320,
		height:66		
	});
	self.add(listView)
	var addPictures=function(datas){
		for(var i=0;i<datas.length && i<5;i++){
			var p = datas[i];
			if (!p.imgWidth){
				p.imgWidth=56;
			}
			if (!p.imgHeight){
				p.imgHeight=56;
			}
			var h2 =p.imgHeight * (56 / p.imgWidth);
			var h = (h2>56)?56:h2;
			var t= (h>=56)?0:(56-h) / 2;
			var imageBg = Ti.UI.createView({
				top:0,//t,
				left:[10,71,132,193,254][i],
				width: 56,
				height: 56,//h,
				backgroundColor:settings.defaultImageColor
			});
			var image = Ti.UI.createImageView({
				top:0,//t,
				left:[10,71,132,193,254][i],
				width: 56,
				height:56,//h,
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
	
	return self;
}
module.exports = UserActivityPinsView;
