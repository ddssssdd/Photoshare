var PictureListView=function(isLogin){
	var isLogin=isLogin;
	var self = Ti.UI.createWindow({
		//title:'List',
		backgroundColor : '#fff',		
		barImage:"images/top_logo.png",
		tabBarHidden:true,
		navBarHidden:false
	});
	
	if (!isLogin){
		var TopBarView = require("publicUI/TopBarView");
		var v = new TopBarView();
		self.add(v);
		v.addBackButton(function(e){
			alert("i am callback");
		});
		var BottomLoginBar = require("publicUI/BottomLoginBar");
		var b = new BottomLoginBar();
		self.add(b);
		
	}
	var registerButton = Ti.UI.createButton({
		//title : 'Sign up now',
		top : 8,
		left : 10,
		width : 115,
		height : 31,
		style : Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		backgroundImage : 'images/signup.png'
	});
	registerButton.addEventListener("click", function(e) {
		
		Ti.App.fireEvent("app:register");
	});
	var loginButton = Ti.UI.createButton({
		
		top : 8,
		right : 10,
		width : 70,
		height : 31,
		style : Ti.UI.iPhone.SystemButtonStyle.BORDERED,
		backgroundImage : 'images/login.png'

	});
	loginButton.addEventListener("click", function(e) {
		//userService.login();
		Ti.App.fireEvent("app:login");
	});
	var toolbar = Ti.UI.createView({
		width : 320,
		height : 47,
		left : 0,
		bottom : 0,
		//backgroundColor : '#d1d1d1'
		backgroundImage:'images/bottom_bg.png'
	});
	toolbar.add(registerButton);
	toolbar.add(loginButton);

	self.add(toolbar);
	toolbar.zIndex = 100;
	toolbar.visible = false;

	var processAnonymous=function(){
		isLogin = false;
		Ti.App.fireEvent("app:tabgroup",{visible:false});
		toolbar.visible = true;
		
		
	}
	
	Ti.App.addEventListener("app:loginSuccess", function(e) {
		isLogin = true;
		toolbar.visible = false;
		self.tabBarHidden = false;
		self.close();
	});


	/*
	Ti.App.addEventListener("app:logout",function(e){
		processAnonymous();
	});
	*/
	var isFirstOpen=false;
	self.addEventListener("focus",function(e){		
		var userService = require("services/UserService");
		if(!userService.isLogin()) {
			processAnonymous();
		} else {
			isLogin = true;
		}

		/*
		if (!isFirstOpen){
		
			var userService = require("services/UserService");
			if(!userService.isLogin()) {
				processAnonymous();
			} else {
				isLogin = true;
			}
			isFirstOpen = true;
		}
		*/
		
	
	});
	
	var categoryId = 0;
	var tag = "";
	var maxHeight = 100;
	var page = 0;
	var total = 100;
	var pages = 100;
	var ypos=[0,0,0];
	var scrollView = Ti.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		top:0,
		showVerticalScrollIndicator:true,
		verticalBounce :true
	});
	self.add(scrollView);
	/*
	scrollView.addEventListener("scrollEnd",function(e){
		Ti.API.info(e);
	});
	*/
	var view = Ti.UI.createView({
		top:0,
		left:0,
		width:320,
		height:480
	})
	scrollView.add(view);
	var lasty=0;
	var showing =true;
	var isLoading=false;
	scrollView.addEventListener("scroll",function(e){
		if (isLoading){
			return;
		}
		
		var direction = e.y - lasty;
		//Ti.API.info("scroll.direction="+direction)
		if (direction>0){
			if (e.y>0){
				if (showing){
					toolbar.visible = false;
					//self.navBarHidden = true;
					self.tabBarHidden = true;
					self.hideNavBar();
				
					
					showing =false;
					Ti.App.fireEvent("app:tabgroup",{visible:false});
				}	
			}
			
		}else{
			if (!showing){
				if (!isLogin){
					toolbar.visible = true;	
				}				
				//self.navBarHidden = false;
				self.tabBarHidden = false;
				self.showNavBar();
				
				showing =true;
				Ti.App.fireEvent("app:tabgroup",{visible:true});
			}
			
		}
		
		lasty = e.y;
	})
	
	self.bottomGet=function(e){
		
		/*
		Ti.API.log("Info",e.source.contentOffset.y);
		if (e.decelerating){
			Ti.API.log("Info", "i am decelerating");
		}
		*/
		if(e.y >= view.height /2) {
			Ti.API.log("INFO", "i am in bottom");
			scrollView.removeEventListener("scroll", self.bottomGet);
			
			page = page +1;
			if (page<=pages){
				self.showData();	
			}
			
		}
	}
	self.showData=function(category){
		if (category){
			//self.title = category.title;	
			categoryId = category.id;
		}
		
		isLoading =true;
		var categoryService = require("services/CategoryService");
		var processData = function(datas){
			
			var xpos=[5,110,215];
			for(var i=0;i<datas.length;i++){				
				var photo = datas[i];
				var x = xpos[i % 3];
				var y = ypos[i % 3];
				var h = photo.height * (100 / photo.width);

				
				var bgView = Ti.UI.createView({
					top : y,
					left : x,
					width : 105,
					height : h + 5
				});
				var image = Ti.UI.createImageView({
					image : photo.url,
					width : 100,
					height : h,
					photoObj : photo,
					defaultImage:'images/none.png'
				});
				ypos[i % 3] = ypos[i % 3] + h + 10;
				bgView.add(image);
				view.add(bgView);
				//view.add(image);

				image.addEventListener("click", function(e) {
					//Ti.App.fireEvent("app:imageClick.explore",{id:e.source.photoObj.id,list:datas});
					Ti.App.fireEvent("app:imageClick",{id:e.source.photoObj.id,list:datas,tab:"tabExplore"});
				});
			}
			
			var max = ypos[0];
			for(var i=0;i<ypos.length;i++) {
				var item = ypos[i];
				if(item > max)
					max = item;
			}
			view.height = max;
			maxHeight = max;
			scrollView.addEventListener("scroll", self.bottomGet);
			isLoading = false;
		};
		var offset = page*27+1;
		categoryService.getCategory(categoryId,offset,processData);
		
	};
	
	return self;
};
module.exports = PictureListView;
