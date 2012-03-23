var AppMainWindow=function(){
	
	
	Titanium.UI.setBackgroundColor('#000');
	if (Titanium.Platform.name == 'iPhone OS'){
		Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.OPAQUE_BLACK;	
	}
	
	
	
	var tabGroup = Ti.UI.createTabGroup({});
	
	/*
	var winFollowing2 = require("ui/winFollowing2");
	var tabFollowing = Ti.UI.createTab({
		icon : "images/following.png",		
		window : new winFollowing2()
	});
	*/
	var winFollowing = require("ui/winFollowing");
	var tabFollowing = Ti.UI.createTab({
		icon : "images/following.png",		
		window : new winFollowing()
	});
	var winExplore = require("ui/winExplore");
	var tabExplore = Titanium.UI.createTab({
		icon : 'images/explore.png',	
		window : new winExplore()
	});

	
	var winCamera = require("ui/winCamera");
	var tabCamera = Titanium.UI.createTab({
		icon : 'images/spot.png',
		window : new winCamera()
	});
	
	var winActivity = require("ui/winActivity2");
	var tabActivity = Ti.UI.createTab({		
		icon : "images/activity.png",
		window : new winActivity()
	});

	var winProfile = require("ui/winProfile");
	var tabProfile = Ti.UI.createTab({		
		icon : "images/profile.png",
		window : new winProfile()
	});
	
	tabGroup.addTab(tabFollowing);
	tabGroup.addTab(tabExplore);
	tabGroup.addTab(tabCamera);
	tabGroup.addTab(tabActivity);
	tabGroup.addTab(tabProfile);
	// open tab group
	
	Ti.App.addEventListener("app:openWindow",function(e){
		if (e.tab=="winProfile"){
			if (e.url=="editProfile"){
				var winEditProfile = require("ui/winEditProfile");
				var v = new winEditProfile();
				tabProfile.open(v);	
			}
			
		}
		var PictureListView = require("ui/PictureListView");
		var pview = new PictureListView(true);
		tabExplore.open(pview);	
		pview.showData(e.category,e.key);
	})
	Ti.App.addEventListener("app:imageClick",function(e){
		
		var PictureFullScreenView = require("publicUI/PictureFullScreenView");
		var picture = new PictureFullScreenView(e.id,e.list,e.tab);
				
		if (e.tab=="tabProfile"){
			tabProfile.open(picture);	
		}
		if (e.tab=="tabActivity"){
			tabActivity.open(picture);	
		}
		if (e.tab=="tabExplore"){
			tabExplore.open(picture);	
		}
		if (e.tab=="tabFollowing"){
			tabFollowing.open(picture);
		}
		
	});
	/*
	Ti.App.addEventListener("app:imageClick.explore",function(e){	
		var PictureView = require("ui/PictureView");
		var picture = new PictureView(e.id,e.list);
		tabExplore.open(picture);
	});
	
	Ti.App.addEventListener("app:activity.openImage",function(e){
		//alert(e);
		var PictureView = require("ui/PictureView");
		var picture = new PictureView(e.id,e.list);
		tabActivity.open(picture);
	});
	*/
	
	Ti.App.addEventListener("app:openUser",function(e){
		var createProfileView = function(u){
			var win = Ti.UI.createWindow({
				backgroundColor:'#fff',
				barImage:"images/top_logo.png",
				navBarHidden:false,
				tabBarHidden:true
			});
			var BackNavButton = require("publicUI/BackNavButton");
			new BackNavButton(win);
			
			var UserProfileView = require("publicUI/UserProfileView");
			var userView = new UserProfileView(u,e.tab);
			win.add(userView);
		
			if(e.tab == "tabProfile") {
				tabProfile.open(win);
			}
			if(e.tab == "tabActivity") {
				tabActivity.open(win);
			}
			if(e.tab == "tabExplore") {
				tabExplore.open(win);
			}
			if(e.tab == "tabFollowing") {
				tabFollowing.open(win);
			}

		}
		
		var userService = require("services/UserService");
		userService.getProfile(e.id,createProfileView);
		
	});
	Ti.App.addEventListener("app:openInTab",function(e){
		if ((e) && (e.id)){
			var UserBoardView = require("ui/UserBoardView");
			var win = new UserBoardView(e.userInfo,e.tab,e.id);
			if (e.tab=="tabActivity"){
				tabActivity.open(win);	
			}
			if (e.tab=="tabProfile"){
				tabProfile.open(win);	
			}
			if (e.tab=="tabFollowing"){
				tabFollowing.open(win);	
			}
			if (e.tab == "tabExplore"){
				tabExplore.open(win);
			}
			
		}
	});
	var currentIndex=-1;
	Ti.App.addEventListener("app:takePhoto",function(e){
		currentIndex=e.index;
		var moreOption = Ti.UI.createOptionDialog({
			options : [ L('open_camera'), L('open_photo_gallery'), L('cancel')],
			cancel : 2,
			destructive:2
		});
		moreOption.show();
		moreOption.addEventListener("click", function(e) {
			
			if(e.index == 0) {
				openPhoto(true,e.index);
			}
			if(e.index == 1) {
				openPhoto(false,e.index);
			}
			if(e.index == 2) {
				Ti.API.info("cancel!");				
			}
		});
		
	});
	var successCall= function(event) {
		// called when media returned from the camera
		Ti.API.debug('Our type was: ' + event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
			
			/*
			var winCamera2=require("ui/winCamera2");
			var win = new winCamera2(event.media);
			*/
			var winRepin = require("ui/winRepin");
			var win = new winRepin(null,event.media);
			if(currentIndex == 0) {
				tabFollowing.open(win);
			}
			if(currentIndex == 1) {
				tabExplore.open(win);
			}
			if(currentIndex == 3) {
				tabActivity.open(win);
			}
			if(currentIndex == 4) {
				tabProfile.open(win);
			}

			
		} else {
			//alert("got the wrong type back =" + event.mediaType);
			Ti.App.fireEvent("app:message", {
				text : L('got_the_wrong_type_back') + event.mediaType
			});
		}
	}
	var cancelCall = function(error){
		
	}
	
	var errorCall = function(error) {
				
	}

	var openPhoto=function(isCamera){
		
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
	
	/*
	Ti.App.addEventListener("app:login",function(e){
		var LoginView = require("ui/LoginView");
		var loginView = new LoginView();
		tabExplore.open(loginView);
	});
	Ti.App.addEventListener("app:register",function(e){
		var winRegister = require("ui/winRegister");
		var register = new winRegister(e);
		tabExplore.open(register);
	});
	*/
	function showHotWin(){
		var PictureListView = require("ui/PictureListView");
		var pview = new PictureListView(false);
		pview.showData({id:0,title:L('what_is_hot')});
		pview.open({modal:true,fullscreen:false});
	}
	var userService = require("services/UserService");
	if (!userService.isLogin()){
		showHotWin();
	}
	Ti.App.addEventListener("app:logout",function(e){
		showHotWin();
	});
	
	

	Ti.App.addEventListener("app:repin",function(e){
		//alert(e);
		var winRepin = require("ui/winRepin");
		var w = new winRepin(e.photo);
		if (e.tab=="tabProfile"){
			tabProfile.open(w);	
		}
		if (e.tab=="tabActivity"){
			tabActivity.open(w);	
		}
		if (e.tab=="tabExplore"){
			tabExplore.open(w);	
		}
		if (e.tab=="tabFollowing"){
			tabFollowing.open(w);
		}
	});
	
	Ti.App.addEventListener("app:register.newUser",function(e){
		userService.register(e.email,e.password,e.firstname,e.lastname,function(r){
			if (r.status!="success"){
				//alert(r.memo);
				Ti.App.fireEvent("app:message",{text:r.memo});
			}
		});
	});
	
	Ti.App.addEventListener("app:loginSuccess",function(e){
		/*
		var winFollowing = require("ui/winFollowing");
		var win = new winFollowing();
		tabFollowing.open(win);
		*/
		tabGroup.setActiveTab(0);
		customTabGroup.setHighlightBar(0);
		//Ti.App.fireEvent("app:tabgroup",{visible:true});
	});	
	
	Ti.App.addEventListener("app:message",function(e){
		
		messageLabel.text = e.text;
		messageWin.open();
		setTimeout(function() {
			messageWin.close({
				opacity : 0,
				duration : 500
			});
		}, 1000);
	});
	var messageWin = Titanium.UI.createWindow({
		height : 50,
		width : 250,
		bottom : 240,
		borderRadius : 10,
		touchEnabled : false,

		orientationModes : [Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT]
	});
	var messageView = Titanium.UI.createView({
		id : 'messageview',
		height : 50,
		width : 250,
		borderRadius : 10,
		backgroundColor : '#000',
		opacity : 0.7,
		touchEnabled : false
	});

	var messageLabel = Titanium.UI.createLabel({
		id : 'messagelabel',
		text : '',
		color : '#fff',
		width : 250,
		height : 'auto',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 13
		},
		textAlign : 'center'
	});
	messageWin.add(messageView);
	messageWin.add(messageLabel);


	
	
	return tabGroup;

};
module.exports = AppMainWindow;
