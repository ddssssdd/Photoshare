var winCamera=function(){
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
		if (imageView){
			self.remove(imageView);
			imageView = null;			
		}
		isGetPhoto = false;
		initShow();
	})
	var imageView=null;
	var rightButton = Ti.UI.createButton({		
		width: 62,
		height:28,
		backgroundImage:'images/pinit.png'
	});
	self.rightNavButton = rightButton;
	rightButton.addEventListener("click",function(e){
		var winRepin= require("ui/winRepin");
		var win = new winRepin();
		self.tab.open(win);
	});
	/*
	var toolBar= Ti.UI.createView({
		bottom:50,
		left:0,
		width:320,
		height:50,
		backgroundColor:'#d1d1d1',
		zIndex:10
	});
	self.add(toolBar);
	
	var cameraButton = Ti.UI.createButton({
		top:5,
		left:10,
		width:80,
		height:40,
		title:'Camera'
	});
	toolBar.add(cameraButton);
	cameraButton.addEventListener("click",function(e){
		openPhoto(true);
	});
	
	
	var photoButton = Ti.UI.createButton({
		top:5,
		right:10,
		width:80,
		height:40,
		title:'Photo'
	});
	toolBar.add(photoButton);
	photoButton.addEventListener("click",function(e){
		openPhoto(false);
	});
	*/
	function initShow(){
		
		var moreOption = Ti.UI.createOptionDialog({
			options : [LL('open_camera'), LL('open_photo_gallery'), LL('cancel')],
			cancel : 2,
			destructive:2
		});
		moreOption.show();
		moreOption.addEventListener("click", function(e) {
			if(e.index == 0) {
				openPhoto(true);
			}
			if(e.index == 1) {
				openPhoto(false);
			}
			if(e.index == 2) {
				Ti.API.info("cancel!");
				isGetPhoto=false;
			}
		});


	}
	var isGetPhoto = false;
	self.addEventListener("focus",function(e){
		setTimeout(function(){
			if (!isGetPhoto){			
				initShow();	
			}
		},500);
		
		
	});
	/*
	Ti.App.addEventListener("app:select.board",function(e){		
		var userService= require("services/UserService");
		userService.createPin(imageView.image,e.boardId,e.description,function(e){
			self.remove(imageView);
			imageView = null;	
			Ti.App.fireEvent("app:message",{text:"create pin success"});
			initShow();
						
		});
		
		
	});
	*/
	var successCall= function(event) {
		// called when media returned from the camera
		Ti.API.debug('Our type was: ' + event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
			if (imageView){
				self.remove(imageView);
				imageView = null;
			}
			imageView = Ti.UI.createImageView({
				//width : self.width,
				//height : self.height,
				image : event.media
			});
			self.add(imageView);		
			isGetPhoto= true;
		} else {
			//alert("got the wrong type back =" + event.mediaType);
			Ti.App.fireEvent("app:message", {
				text : LL('got_the_wrong_type_back')+ event.mediaType
			});
		} 
	}
	var cancelCall = function(error){
		imageView = null;
		initShow();
	}
	
	var errorCall = function(error) {
				
	}

	var openPhoto=function(isCamera){
		isGetPhoto=true;
		if (isCamera){
			
			Titanium.Media.showCamera({
				success : successCall,
				cancel : cancelCall,
				error : errorCall,
				saveToPhotoGallery : false,
				allowEditing : true,
				mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO]
			});


			
		}else{
			
			Titanium.Media.openPhotoGallery({
				success : successCall,
				cancel : cancelCall,
				error : errorCall,
				saveToPhotoGallery : false,
				allowEditing : true,
				mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO]
			});
	
		}
	
	}
	


	return self;
};
module.exports = winCamera;
