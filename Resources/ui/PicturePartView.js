var PicturePartView = function(f,photo,index){
	//board,width,height,url,description,timeAndSource
	
	var rowindex=index;
	var contentView = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:'auto'
	});
	
	
	var viewTop = Ti.UI.createView({
		top:0,
		left:0,
		height: 50
	});
	contentView.add(viewTop);
	var imageUserBg = Ti.UI.createView({
		top:10,
		left:10,
		width:35,
		height:35,
		backgroundColor:settings.defaultImageColor
	});
	var imageUser = Ti.UI.createImageView({
		image:f.avatar,
		top:10,
		left:10,
		width:35,
		height:35,
		defaultImage:'images/clear.png'
	});
	viewTop.add(imageUserBg);
	viewTop.add(imageUser);
	imageUser.addEventListener("click",function(e){
		Ti.App.fireEvent("app:openUser",{id:f.userId,tab:"tabFollowing"});
	});
	
	var labelTop = Ti.UI.createLabel({
		top:10,
		left: 55,
		height: 30,
		text: f.firstname+" "+f.lastname,
		width:105,
		font:{fontFamily:'Arial',fontSize:14,fontWeight:"bold"}
	})
	viewTop.add(labelTop);
	
	
	var labelBoard = Ti.UI.createLabel({
		top:10,
		right:10,
		height: 30,
		width: 140,
		text: photo.board,
		color:'#878787',
		textAlign:"right",
		font:{fontFamily:'Helvetica Neue',fontSize:14,fontWeight:'bold'}
	})
	viewTop.add(labelBoard);
	labelBoard.addEventListener("click",function(e){
		var user={avatar:f.avatar,firstName:f.firstname,lastName:f.lastname,id:f.userId};
		Ti.App.fireEvent("app:openInTab",{id:f.boardId,userInfo:user,tab:"tabFollowing"});
	});
	
	var h = 300 / (photo.width / photo.height);
	var imageBg = Ti.UI.createView({
		top:55,
		left:10,
		width: 300,
		height: h,
		backgroundColor:settings.defaultImageColor
	});
	contentView.add(imageBg);
	var image = Ti.UI.createImageView({
		top:55,
		left:10,
		image:photo.url,
		width: 300,
		height: h,
		defaultImage:'images/clear.png',
		photo:photo
	});
	//add the image click event. the same as Board
	image.addEventListener('click',function(e){
		var user={avatar:f.avatar,firstName:f.firstname,lastName:f.lastname,id:f.userId};
		Ti.App.fireEvent("app:openInTab",{id:f.boardId,userInfo:user,tab:"tabFollowing"});
	});
	
	contentView.add(image);
	
	var labelCreate = Ti.UI.createLabel({
		top: 60+h,
		left:10,
		height: 'auto',
		width:280,
		text:photo.description,
		font:{fontFamily:'Arial',fontSize:14,fontWeight:'bold'}
	});
	contentView.add(labelCreate);
	
	
	
	
	var labelUpdate = Ti.UI.createLabel({
		top: labelCreate.top+labelCreate.height+5,
		left:10,
		height: 'auto',
		width: 280,
		text: /*new Date(photo.dateCreated).toRelativeTime()*/photo.dateCreated+" from " + photo.website,
		color:'#878787',
		font:{fontFamily:'Helvetica Neue',fontSize:12,fontWeight:'bold'},
		url:photo.website
	});
	labelUpdate.addEventListener("click",function(e){
		Ti.App.fireEvent("app:openUrl",{url:e.source.url});
	});
	contentView.add(labelUpdate);
	
	var BottomToolBar = require("publicUI/BottomToolBar");
	var b = new BottomToolBar(labelUpdate.top+labelUpdate.height + 5);
	b.image = image;
	b.tabName = "tabFollowing";
	b.tab = null;
	//b.setPhotoUserId(f.userId);
	b.fireEvent("bottom:update.photo",{photoUserId:f.userId,photoId:f.photo.id,rowIndex:rowindex});
	contentView.add(b);
	
	/*var baseTop =b.top + 47;
	var hasRepin=false,hasLike=false,hasComment=false;*/
	
	var iconRepin=null,lblRepin=null;
	
	var createRepin=function(){
		
		/*if (iconRepin) {
			return;
		}*/
		iconRepin = Ti.UI.createImageView({
			top: b.top+47 +10,
			//top : baseTop + 10,
			left : 10,
			width : 15,
			height : 15,
			image : "images/pin_icon.png"
		});
		contentView.add(iconRepin);
		
		/*if (lblRepin){
			return;
		}*/
		lblRepin = Ti.UI.createLabel({
			top:b.top+47+10,
			//top : baseTop + 10,
			left : 35,
			height : 'auto',
			text : photo.repinCount + (photo.repinCount > 1 ? L('repins') : L('repin')),
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			}
		});
		
		contentView.add(lblRepin);
	}
	
	//If repincount>0 then add the Repin info.
	/*if(photo.repinCount > 0) {
		
		hasRepin=true;
		createRepin();
	}*/
	createRepin();
	
	var iconLike=null,lblLike=null;
	
	var createLike=function() {
		/*var _top = (hasRepin) ? baseTop + 35 : baseTop + 10;
		if (iconLike) {
			return;
		}*/
		iconLike = Ti.UI.createImageView({
			//top:_top,
			top : b.top + 47 + 35,
			left : 10,
			width : 15,
			height : 15,
			image : "images/like_icon.png"
		});
		contentView.add(iconLike);
		/*if (lblLike) {
			return;
		}*/
		lblLike = Ti.UI.createLabel({
			//top:_top-1,
			top : b.top + 41 + 40,
			left : 35,
			height : "auto",
			text : photo.likeCount + (photo.likeCount > 1 ? L('likes') : L('like')),
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			}
		});
		
		contentView.add(lblLike);
	}

	//if likecount>0 then add the like info.
	/*if(photo.likeCount > 0) {
		//hasLike=true;
		createLike();
	}*/
	createLike();
	
	var updatePosition=function(){
		if (hasRepin) {
			lblRepin.top=baseTop+10;
			iconRepin.top=baseTop+10;
		}else{
			iconRepin.visible=false;
			lblRepin.visible=false;
		}
		
		if (hasLike) {
			var _top = (hasRepin) ? baseTop + 35 : baseTop + 10;
			lblLike.top=_top;
			iconLike.top=_top;
		}else {
			iconLike.visible=false;
			lblLike.visible=false;
		}
		
		if (hasComment){
			var _top = (hasRepin) ? ((hasLike) ? baseTop + 60 : baseTop + 35 ) : baseTop + 10;
			imageComment.top=_top;
			childView.top=_top;
		}else {
			imageComment.visible=false;
			childView.visible=false;
		}
		
	}

	Ti.App.addEventListener("app:refresh.pin",function(e){
		
		if (e.pin.status=="success"){
		
			if(e.pin.pin.id != photo.id) {
				return;
			}
			
			lblRepin.text = e.pin.repinCount+(e.pin.repinCount>1?" Repins":" Repin")
			lblLike.text = e.pin.likeCount + (e.pin.likeCount>1?' Likes':' Like'),
			
			createComments(e.pin.commentsList);	
			
			/************ update repin and like count **********************/
			/*var repinStatus=null,likeStatus=null;
			var status={none:0,hidden:1,create:2,update:3};
			
			//according to the return data.
		
			repinStatus = (hasRepin) ? ((e.pin.repinCount > 0) ? status.update : status.hidden) : ((e.pin.repinCount > 0) ? status.create : status.none);
			likeStatus = (hasLike) ? ((e.pin.likeCount > 0) ? status.update : status.hidden) : ((e.pin.likeCount > 0) ? status.create : status.none);
			
			//likeStatus=2;
			
			//infoLabelright.text = e.pin.likeCount+" likes "+e.pin.repinCount+" repins";
			if (e.pin.commentsList.length>0) {
				hasComment=true;
				createComments(e.pin.commentsList);
			}	
			
			switch(repinStatus) {
				case status.hidden:
					hasRepin = false;
					updatePosition();
					break;
				case status.create:
					createRepin();
					hasRepin = true;
					updatePosition();
					break;
				case status.update:
					lblRepin.text = e.pin.repinCount + L('repins');
					break;
				case status.none:
					break;
			}

			switch(likeStatus) {
				case status.hidden:
					hasLike = false; //first set false.
					updatePosition();
					break;
				case status.create:
					createLike();
					hasLike = true;  //first set the true.
					updatePosition();
					break;
				case status.update:
					lblLike.text = e.pin.likeCount + L('likes');
					break;
				case status.none:
					break;
			}*/
			
			
				
			
		}
		
	});
	
	
	var childView =null;
	var imageComments=null;
	var createComments=function(datas){
		
	   
		//var _top = (hasRepin) ? ((hasLike) ? baseTop + 60 : baseTop + 35 ) : baseTop + 10;

		imageComments = Ti.UI.createImageView({
			image:"images/comment_icon.png",
			width:15,
			height:15,
			top: b.top+47+60,
			//top: _top,
			left: 10
		});
		contentView.add(imageComments);				
		var top1 =b.top+45+60;
		if (childView){
			contentView.remove(childView);
			childView = null;
		}
		childView = Ti.UI.createView({
			top:top1,
			//top:_top-2,
			left:35,
			width:260,
			height:'auto'
		});
		var t1 = 0;
		for(var i=0;i<datas.length;i++){
			var item = datas[i];
			
			var commentsView = Ti.UI.createView({
				top : t1,
				left : 0,
				width : 250,
				height : 'auto',
				layout : "horizontal"				
			});
			

			var labelName = Ti.UI.createLabel({
				text:item.lastName+", "+ item.firstName+": ",				
				height:'auto',
				left:2,
				width: 'auto',
				font:{fontSize:12,fontWeight:'bold'}
			});
			var label = Ti.UI.createLabel({
				text:item.content,
				height:'auto',
				left:5,
				width:'auto',
				font:{fontSize:12}
			});
			commentsView.add(labelName);
			commentsView.add(label);
			labelName.top = label.top;
			t1 = t1 + commentsView.height;
			childView.add(commentsView);
		};
		contentView.add(childView);
		
		//contentView.height = 280+h+datas.length*60;		
	};
	if (photo.commentCount>0){
		createComments(photo.comments);
	};
	
	contentView.height +=10;
	
	/*
	if (photo.commentCount>0){
		var categoryService = require("services/CategoryService");
		categoryService.getComments(photo.id,createComments);		
	}
	*/
	return contentView;
};

module.exports = PicturePartView;
